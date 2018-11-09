/*
	bake.go

	This file contains the http handler and types for baking the bread
*/
package main

import (
	"github.com/gin-gonic/gin"
)

type BakeInput struct {
	Ingredients  map[int64]int `json:"ingredients"`
	MixSeconds   int           `json:"mixSeconds"`
	RiseMinutes  int           `json:"riseMinutes"`
	KneadSeconds int           `json:"kneadSeconds"`
	BakeMinutes  int           `json:"bakeMinutes"`
	OvenID       int64         `json:"ovenId"`
}

func BakeBread(c *gin.Context) {

	var input BakeInput

	err := c.ShouldBindJSON(&input)
	if err != nil {
		c.JSON(400, gin.H{"error": "Incorrect user input"})
		return
	}

	c.JSON(200, gin.H{"notice": "Feature under development"})
}
