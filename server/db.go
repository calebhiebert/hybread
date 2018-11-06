/*
	db.go

	This file contains helper classes for common database actions
*/
package main

import (
	"fmt"
	"os"
)

// Create all database tables and print the result
func initializeDatabase() error {
	schema := GetSchema()

	_, err := sess.Exec(schema)
	if err != nil {
		return err
	}

	fmt.Println("Initialized Database")
	return nil
}

// Drop all database tables and print the result
func dropDatabase() error {
	if os.Getenv("RESET_DB") == "true" {
		schema := GetDropSchema()

		res, err := sess.Exec(schema)
		if err != nil {
			return err
		}
		fmt.Printf("SCHEMA %+v\n", res)
	}
	return nil
}
