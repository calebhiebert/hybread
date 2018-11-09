/*
	users.go

	This file contains gin route handlers for performing User operations
*/
package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jkomyno/nanoid"
	"golang.org/x/crypto/bcrypt"
	db "upper.io/db.v3"
)

type CreateUserArgs struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginArgs struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// User the struct that gets mapped to the database user table
type User struct {
	ID       int64  `db:"id,omitempty" json:"id"`
	Username string `db:"username" json:"username"`
	Password string `db:"password" json:"password,omitempty"`
	Currency int    `db:"currency" json:"currency"`
}

// CreateUser the handler for creating a new user account
func CreateUser(c *gin.Context) {
	var inputArgs CreateUserArgs

	//Parses the data out of the post request
	err := c.ShouldBindJSON(&inputArgs)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid arguments",
			"ctx":   err,
		})
		return
	}

	// Check if the username is too short.
	if len(inputArgs.Username) < 3 {
		c.JSON(400, gin.H{
			"error": "Username is too short!",
		})
		return
	}

	// Check if the username is too long
	if len(inputArgs.Username) > 32 {
		c.JSON(400, gin.H{
			"error": "Username is too long!",
		})
		return
	}

	//Check if the password is too short
	if len(inputArgs.Password) < 3 {
		c.JSON(400, gin.H{
			"error": "Password is too short!",
		})
		return
	}

	// Hash the user's password for storing in the database
	pword, err := bcrypt.GenerateFromPassword([]byte(inputArgs.Password), 12)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unknown error occured while processing",
		})
		return
	}

	// Overwrite the inputargs password field with the hash so we don't store any plaintext passwords
	inputArgs.Password = string(pword)

	// Create a user instance to be saved in the database
	user := User{
		Username: inputArgs.Username,
		Password: inputArgs.Password,
	}

	// Insert the new user into the database, use InsertReturning so we can get the created user back
	err = sess.Collection("users").InsertReturning(&user)
	if err != nil {

		// Check for a duplicate username error
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			c.JSON(400, gin.H{
				"error": "Username is already taken",
			})
			return
		} else {
			panic(err)
		}
	}

	// Clear the password field so it does not get serialized to json in the response
	user.Password = ""

	c.JSON(200, &user)
}

func GetUsers(c *gin.Context) {

}

// CheckAuthentication checks the validity of the caller's authentication
func CheckAuthentication(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		c.JSON(200, gin.H{
			"authenticated": false,
		})
	} else {
		scrubbedUser := user.(User)
		scrubbedUser.Password = ""

		c.JSON(200, gin.H{
			"authenticated": true,
			"user":          scrubbedUser,
		})
	}
}

//Logout the user
func Logout(c *gin.Context) {
	currentUser, _ := c.Get("user")

	user := currentUser.(User)

	err = rds.Del(fmt.Sprintf("id:%d", user.ID)).Err()
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while deleting id-token", "ctx": err})
		return
	}
}

// Login the handler for obtaining a Bearer token to access the rest of the API
func Login(c *gin.Context) {
	var login LoginArgs

	// Check that the basic input requirements are fulfilled
	err := c.ShouldBindJSON(&login)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid arguments",
			"ctx":   err,
		})
		return
	}

	var user User

	// Search the database for a username matching the one provided
	err = sess.Collection("users").Find(db.Cond{"username": strings.TrimSpace(login.Username)}).One(&user)
	if err != nil {

		// This error means that no rows were found, ie. the user does not exist
		if err == db.ErrNoMoreRows {
			c.JSON(401, gin.H{"error": "Invalid username or password"})
			return
		} else {
			panic(err)
		}
	}

	// Compare the provided password with the hashed version, if this returns nil for the error, it's a match
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password))
	if err != nil {
		c.JSON(401, gin.H{"error": "Invalid username or password"})
		return
	}

	// Check for an existing token
	existingToken, err := rds.Get(fmt.Sprintf("id:%d", user.ID)).Result()
	if err != nil {
		// The error can be safely ignored if it's just a nil message
		if err.Error() != "redis: nil" {
			c.JSON(500, gin.H{"error": "Error during token lookup", "ctx": err})
			return
		}
	} else {
		// Send the existing token to avoid creating a bunch of extra tokens
		c.JSON(200, gin.H{"token": existingToken})
		return
	}

	// Generate a new Bearer token for the user
	token, err := nanoid.Nanoid(64)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error during token generation", "ctx": err})
		return
	}

	// Save the token in Redis for 24 hours. The redis value is just the user's id
	err = rds.Set("auth:"+token, user.ID, 24*time.Hour).Err()
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while caching token", "ctx": err})
		return
	}
	// Save the token in Redis for 24 hours. The redis value is just the user's id
	err = rds.Set(fmt.Sprintf("id:%d", user.ID), token, 24*time.Hour).Err()
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while caching id-token", "ctx": err})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})
}

// UsernameAvailable the handler for checking if a given username is taken or not
func UsernameAvailable(c *gin.Context) {

	// Grab the username from the query paramter "username"
	username := c.Query("username")

	var user User

	// Lookup a user by username
	err := sess.Collection("users").Find(db.Cond{"username": username}).One(&user)
	if err != nil {
		// If the user was not found, that means this username is available
		if err == db.ErrNoMoreRows {
			c.JSON(200, gin.H{"username": username, "available": true})
			return
		} else {
			c.JSON(500, gin.H{"error": "Error performing database lookup", "ctx": err})
			return
		}
	}

	// If the user was found, that means this username is not available
	c.JSON(200, gin.H{"username": username, "available": false})
}
