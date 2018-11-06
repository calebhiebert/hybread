/*
	seeder.go

	This file contains functions to seed the database with data

	ITEMS
	The seeder will load any files in the "items" directory.
	These files should be json, with the base element as an array of items.
	All files in the directory will have their items validated and loaded into the database
*/
package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func LoadItems() (*[]Item, error) {

	// Get a list of all files in the "items" directory
	files, err := ioutil.ReadDir("./items")
	if err != nil {
		return nil, err
	}

	var items []Item

	// Loop through the files and parse them as json
	for _, f := range files {

		// Read the file
		fileBytes, err := ioutil.ReadFile("./items/" + f.Name())
		if err != nil {
			return nil, err
		}

		var fileItems []Item

		// Parse the file into an []Item slice
		err = json.Unmarshal(fileBytes, &fileItems)
		if err != nil {
			return nil, err
		}

		// Perform validation on the items
		for _, item := range fileItems {
			if item.Name == "" {
				return nil, errors.New("Item missing name")
			} else if item.Category == "" {
				return nil, errors.New("Item missing category")
			} else if item.Description == "" {
				return nil, errors.New("Item missing description")
			}
		}

		// Add the items to the array
		items = append(items, fileItems...)
	}

	return &items, nil
}

func SeedItems() error {
	items, err := LoadItems()
	if err != nil {
		return err
	}

	// Loop through each item and insert it into the database
	for _, item := range *items {
		_, err := sess.InsertInto("items").Values(&item).Exec()
		if err != nil {
			return err
		}
	}

	return nil
}

func SeedUser(username string, password string) error {
	// Hash the user's password for storing in the database
	pword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}

	// Create a user instance to be saved in the database
	user := User{
		Username: username,
		Password: string(pword),
	}

	// Insert the new user into the database, use InsertReturning so we can get the created user back
	err = sess.Collection("users").InsertReturning(&user)
	if err != nil {

		// Check for a duplicate username error
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			return nil
		} else {
			return err
		}
	}

	return nil
}
