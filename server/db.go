/*
	db.go

	This file contains helper classes for common database actions
*/
package main

import (
	"fmt"
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
	schema := GetDropSchema()
	res, err := sess.Exec(schema)
	if err != nil {
		return err
	}
	fmt.Printf("SCHEMA %+v\n", res)

	return nil
}
