/*
	leaderboard.go

	This file contains the api handlers to get leaderboard data
*/

package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"upper.io/db.v3"
)

//Display the riches players on the leaderboard
func RichestPlayer(c *gin.Context) {

	var users []User

	//query the db for the list of
	err = sess.Collection("users").Find().All(&users)
	if err != nil {
		// This error means that no rows were found, ie. the user does not exist
		if err == db.ErrNoMoreRows {
			c.JSON(401, gin.H{"error": "No Users found"})
			return
		} else {
			panic(err)
		}
	}

	fmt.Print(users)
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
