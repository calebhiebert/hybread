/*
	main.go

	This is Hybread's main server file
*/
package main

import (
	"errors"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"upper.io/db.v3/lib/sqlbuilder"
	"upper.io/db.v3/postgresql"
)

var sess sqlbuilder.Database
var rds *redis.Client
var err error

func main() {

	// Establish a connection to the redis server
	err = ConnectRedis()
	if err != nil {
		log.Fatal(err)
	}

	// Establish a connection to the database
	err = ConnectDatabase()
	if err != nil {
		log.Fatal(err)
	}

	defer sess.Close()

	// Start up the gin server
	r := gin.Default()

	r.GET("/healthz", HealthCheck)

	// Create the api route group, this is similar to an express sub-router
	api := r.Group("/api")

	// Create the api version group, this is similar to an express sub-router
	v1 := api.Group("/v1")

	// User related routes, full path ends up being <server>/api/v1/users
	v1.POST("/users", CreateUser)
	v1.POST("/login", Login)

	// Start the server (default port is 8080)
	r.Run()
}

// ConnectRedis establishes a connection to the redis server and runs some test commands
func ConnectRedis() error {
	config := &redis.Options{}

	// Check the environment for the host setting, default to localhost
	if os.Getenv("RD_HOST") != "" {
		config.Addr = os.Getenv("RD_HOST")
	} else {
		config.Addr = "localhost:6379"
	}

	// Use the password from the environment, default to no password
	if os.Getenv("RD_PASS") != "" {
		config.Addr = os.Getenv("RD_PASS")
	}

	rds = redis.NewClient(config)

	// Set the "test" redis key to "foo"
	_, err := rds.Set("test", "foo", 0).Result()
	if err != nil {
		return err
	}

	// Get the "test" redis key
	res, err := rds.Get("test").Result()
	if err != nil {
		return err
	}

	// The result should equal "foo"
	if res != "foo" {
		return errors.New("Redis test failed")
	}

	err = rds.Del("test").Err()
	if err != nil {
		return err
	}

	return nil
}

// ConnectDatabase establishes a database connection and runs a test command
func ConnectDatabase() error {

	// Default settings
	settings := postgresql.ConnectionURL{
		Database: "hybread",
		Host:     "localhost",
		User:     "hybread",
		Password: "hybread",
	}

	// Grab the host setting from the environment if available
	if os.Getenv("PG_HOST") != "" {
		settings.Host = os.Getenv("PG_HOST")
	}

	// Grab the user setting from the environment if available
	if os.Getenv("PG_USER") != "" {
		settings.User = os.Getenv("PG_USER")
	}

	// Grab the password setting from the environment if available
	if os.Getenv("PG_PASS") != "" {
		settings.Password = os.Getenv("PG_PASS")
	}

	// Grab the db setting from the environment if available
	if os.Getenv("PG_DB") != "" {
		settings.Database = os.Getenv("PG_DB")
	}

	// Open the database connection
	sess, err = postgresql.Open(settings)
	if err != nil {
		return err
	}

	// This can be commented out sometimes
	// Completely clears the database
	err = dropDatabase()
	if err != nil {
		return err
	}

	// Creates all database tables
	err = initializeDatabase()
	if err != nil {
		return err
	}

	return nil
}

// A gin route to check on application health
func HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "gud",
	})
}
