/*
	leaderboard.go

	This file contains the api handlers to get leaderboard data
*/

package main

import (
	"github.com/gin-gonic/gin"
	"upper.io/db.v3"
)

//Display the riches players on the leaderboard
func RichestPlayer(c *gin.Context) {
	var users []User
	var currency []int

	//query the db for the list of
	err = sess.Collection("users").Find().All(&users)
	if err != nil {
		// This error means that no rows were found, ie. the user does not exist
		if err == db.ErrNoMoreRows {
			c.JSON(401, gin.H{"error": "No Users found in database"})
			return
		} else {
			panic(err)
		}
	}

	for index := 0; index < len(users); index++ {
		currency = append(currency, users[index].Currency)
	}

	//Returns all users in json object
	c.JSON(200, gin.H{
		"currency": currency,
	})
}

//List of all the best breads that have been made
func BestBread(c *gin.Context) {

}

//Used to display the users level on the leaderbaord
// func UsersLevel(c *gin.Context) {
// 	//Get user from context
// 	currentUser, _ := c.Get("user")

// 	//Parses the user context
// 	user := currentUser.(User)

// 	//Get the current users currency
// 	userCurrency := user.Currency
// }
