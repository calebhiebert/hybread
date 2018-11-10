/*
	auth.go

	This file contains custom authorization middleware
*/

package main

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"upper.io/db.v3"
)

// AuthMiddleware this middleware checks the http Authorization header against the tokens stored in redis to discover the current user
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		if header != "" {
			token := string([]rune(header)[len("Bearer "):])
			c.Set("token", token)

			// Grab the user id from redis
			res, err := rds.Get("auth:" + token).Result()
			if err != nil {
				// Redis has returned nil, meaning the token is invalid
				if err.Error() == "redis: nil" {
					c.Next()
					return
				} else {
					c.JSON(500, gin.H{"error": "Error while reading authentication token database", "ctx": err})
					return
				}
			}

			// The id is returned from redis as a string so it must be parsed to an integer
			id, err := strconv.Atoi(res)
			if err != nil {
				c.JSON(500, gin.H{"error": "Error while parsing token response", "ctx": err})
				return
			}

			// Perform a user lookup
			var user User

			err = sess.Collection("users").Find(db.Cond{"id": id}).One(&user)
			if err != nil {
				if err == db.ErrNoMoreRows {
					// Remove the token from redis because this user does not exist
					err = rds.Del("auth:" + token).Err()
					if err != nil {
						fmt.Println("Redis Auth Token Delete Error", err)
					}
				} else {
					c.JSON(500, gin.H{"error": "Error while performing initial user lookup", "ctx": err})
					return
				}
			}

			c.Set("user", user)
			c.Next()
		}
	}
}

// RequireAuthMiddleware this middleware checks to make sure the "user" property is set, if it is not, it returns an unauthorized error
func RequireAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userVal, exists := c.Get("user")

		if userVal == nil {
			c.AbortWithStatusJSON(403, gin.H{"error": "This action requires authentication"})
			return
		}

		user := userVal.(User)

		if !exists || user.ID == 0 {
			c.AbortWithStatusJSON(403, gin.H{"error": "This action requires authentication"})
			return
		}

		c.Next()
	}
}
