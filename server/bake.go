/*
	bake.go

	This file contains the http handler and types for baking the bread
*/
package main

import (
	"context"
	"errors"

	"github.com/calebhiebert/hybread/server/baker"
	"github.com/gin-gonic/gin"
	"upper.io/db.v3/lib/sqlbuilder"
)

type BakeInput struct {
	Ingredients  map[int64]int `json:"ingredients"`
	MixSeconds   int           `json:"mixSeconds"`
	RiseMinutes  int           `json:"riseMinutes"`
	KneadSeconds int           `json:"kneadSeconds"`
	BakeMinutes  int           `json:"bakeMinutes"`
	ToolIDs      []int64       `json:"toolIds"`
}

// BakeBread the handler that will do the actual baking of bread
// this is where the magic happens
func BakeBread(c *gin.Context) {

	currentUser, _ := c.Get("user")

	user := currentUser.(User)

	var input BakeInput

	err := c.ShouldBindJSON(&input)
	if err != nil {
		c.JSON(400, gin.H{"error": "Incorrect user input", "ctx": err})
		return
	}

	// Extract the item ids from the ingredients map
	var ingredientIds []int64

	for id := range input.Ingredients {
		ingredientIds = append(ingredientIds, id)
	}

	// Load all of the items for the bread ingredients
	var ingredients []Item
	err = sess.SelectFrom("items").Where("id IN ?", ingredientIds).All(&ingredients)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while loading ingredients", "ctx": err})
		return
	}

	// load all of the items for the tools
	var tools []Item
	err = sess.SelectFrom("items").Where("id IN ?", input.ToolIDs).All(&tools)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while loading tools", "ctx": err})
		return
	}

	// Load the user's inventory for verifying that they have the correct number of items
	userInventory, err := GetUserInventory(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while loading user inventory", "ctx": err})
		return
	}

	// Make sure the user has all the requred tools
	for _, tool := range tools {
		var inventoryItem InventoryItem

		for _, invItem := range userInventory {
			if invItem.ID == tool.ID {
				inventoryItem = invItem
			}
		}

		// Make sure they have at least 1 of the items
		if inventoryItem.Count == 0 {
			c.JSON(400, gin.H{"error": "Not enough inventory for tools"})
			return
		}
	}

	// Perform update actions inside a transaction in case we need to rollback changes
	ctx := context.Background()
	err = sess.Tx(ctx, func(tx sqlbuilder.Tx) error {

		// Verify that the user has the correct items in their inventory
		for _, ingredient := range ingredients {
			quantity := input.Ingredients[ingredient.ID]

			var inventoryItem InventoryItem

			for _, invItem := range userInventory {
				if invItem.ID == ingredient.ID {
					inventoryItem = invItem
				}
			}

			// Check if the user has enough of this item in their inventory
			if inventoryItem.Count < quantity {
				return errors.New("Not enough inventory")
			} else {
				inventoryItem.Count -= quantity

				// Update this item in the database
				_, err = tx.Update("user_items").Set("count = ?", inventoryItem.Count).Where("user_id = ?", user.ID).And("item_id = ?", inventoryItem.ID).Exec()
				if err != nil {
					return err
				}
			}
		}

		return nil
	})
	if err != nil {
		if err.Error() == "Not enough inventory" {
			c.JSON(400, gin.H{"error": "Not enough inventory"})
		} else {
			c.JSON(500, gin.H{"error": "Error while updating inventory", "ctx": err})
		}

		return
	}

	// Create a map where the key is the ingredient and the value is the quantity
	var ingredientMap map[Item]int = make(map[Item]int)

	for _, ingredient := range ingredients {
		ingredientMap[ingredient] = input.Ingredients[ingredient.ID]
	}

	// Construct the bread object
	bread := CreateBread(&input, &ingredientMap, &tools)

	c.JSON(200, gin.H{"notice": "Feature under development", "in": input, "tools": tools, "ingredients": ingredients, "inv": userInventory, "bread": bread})
}

func CreateBread(input *BakeInput, ingredients *map[Item]int, tools *[]Item) *baker.Bread {
	bread := baker.Bread{
		MixSeconds:   input.MixSeconds,
		RiseMinutes:  input.RiseMinutes,
		KneadSeconds: input.KneadSeconds,
		BakeMinutes:  input.BakeMinutes,
	}

	return &bread
}
