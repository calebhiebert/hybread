/*
	leaderboard.go

	This file contains the api handlers to get leaderboard data
*/

package main

import (
	"github.com/gin-gonic/gin"
	"upper.io/db.v3"
)

type RichestLeaderboard struct {
	Username string `json:"username" db:"username"`
	Currency int    `json:"currency" db:"currency"`
	Rank     int    `json:"rank" db:"rank"`
}

// RichestPlayer this handler will return the 10 most rich players
func RichestPlayer(c *gin.Context) {
	var richestPlayers []RichestLeaderboard

	// Select currency and username ordered by currency and limited to the 10 top players
	err := sess.Select("currency", "username", db.Raw("ROW_NUMBER() OVER (ORDER BY currency DESC) as rank")).From("users").Limit(10).All(&richestPlayers)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while loading leaderbord", "ctx": err})
		return
	}

	c.JSON(200, richestPlayers)
}

func BestBread(c *gin.Context) {}
