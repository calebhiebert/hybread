/*
	main.go

	This is Hybread's main server file
*/
package main

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"upper.io/db.v3/lib/sqlbuilder"
	"upper.io/db.v3/postgresql"
)

// Database session, used for all database operations
var sess sqlbuilder.Database

// Redis client
var rds *redis.Client

// This does not strictly have to be here, but it makes for cleaner code
var err error

func main() {

	// Establish a connection to the redis server
	err = ConnectRedis()
	if err != nil {
		fmt.Println("Could not connect to Redis")
		log.Fatal(err)
	}

	// Establish a connection to the database
	err = ConnectDatabase()
	if err != nil {
		fmt.Println("Could not connect to Database")
		log.Fatal(err)
	}
	defer sess.Close()

	err := SeedItems()
	if err != nil {
		fmt.Println("Error while seeding items", err)
	}

	err = SeedUser("test", "test")
	if err != nil {
		fmt.Println("Error seeding user", err)
	}

	// Start up the gin server
	r := gin.Default()

	// Apply CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"https://hybread.io", "http://localhost:4200"},
		AllowMethods: []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	r.GET("/healthz", HealthCheck)

	// Create the api route group, this is similar to an express sub-router
	api := r.Group("/api")

	// Perform user lookup for all requests, note: this middleware will not require authentication
	api.Use(AuthMiddleware())

	// Create the api version group, this is similar to an express sub-router
	v1 := api.Group("/v1")

	// Create a separate v1 group with no path prefix, any routes on this group will require authentication
	v1Auth := v1.Group("")

	// Require authentication on routes in the v1auth group
	v1Auth.Use(RequireAuthMiddleware())

	// User related routes, full path ends up being <server>/api/v1/users
	v1.POST("/users", CreateUser)
	v1.POST("/login", Login)
	v1.GET("/username-available", UsernameAvailable)
	v1.GET("/check-authentication", CheckAuthentication)

	// Authenticated routes
	v1Auth.GET("/users", GetUsers)
	v1Auth.GET("/items", GetItems)
	v1Auth.GET("/inventory", GetInventory)
	v1Auth.POST("/purchase", PurchaseItem)
	v1Auth.POST("/bpurchase", PurchaseBulkItems)
	v1Auth.POST("/bake", BakeBread)

	r.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"error": "The requested route was not found on this server"})
	})

	// Start the server (default port is 8080)
	r.Run()
}

// ConnectRedis establishes a connection to the redis server and runs some test commands
func ConnectRedis() error {
	config := &redis.Options{
		MaxRetries: 3,
	}

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

	if os.Getenv("RESET_DB") == "true" {
		err = dropDatabase()
		if err != nil {
			// There may have been an error with dropping non-existent tables, this can be safely ignored
			// return err
		}
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
