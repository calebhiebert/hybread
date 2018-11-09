/*
	items.go

	This file contains things to do with items
*/
package main

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"upper.io/db.v3"
	"upper.io/db.v3/lib/sqlbuilder"
)

type Item struct {
	ID          int64  `db:"id,omitempty" json:"id"`
	Name        string `db:"name" json:"name"`
	Category    string `db:"category" json:"category"`
	Description string `db:"description" json:"description"`
	Cost        int    `db:"cost" json:"cost"`
}

type UserItem struct {
	UserID int64 `db:"user_id"`
	ItemID int64 `db:"item_id"`
	Count  int   `db:"count"`
}

type InventoryItem struct {
	ID          int64  `db:"item_id" json:"id"`
	Name        string `db:"name" json:"name"`
	Category    string `db:"category" json:"category"`
	Description string `db:"description" json:"description"`
	Cost        int    `db:"cost" json:"cost"`
	Count       int    `db:"count" json:"count"`
}

type PurchaseItemsInput struct {
	ItemID   int64 `json:"itemId"`
	Quantity int   `json:"quantity"`
}

type BulkPurchaseItemsInput = []PurchaseItemsInput

// GetItems handler will return all store items
func GetItems(c *gin.Context) {
	var items []Item

	// Find all items in the database
	err := sess.Collection("items").Find().All(&items)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while loading items", "ctx": err})
		return
	}

	// This method simulates a paginated system so we could add one in the future
	// For now it just returns all the items
	c.JSON(200, gin.H{
		"count":      len(items),
		"page":       1,
		"totalPages": 1,
		"items":      items,
	})
}

// PurchaseItem handler takes an item id and quantity and adds the item to the user's
// inventory while subtracting the cost from their wallets
func PurchaseItem(c *gin.Context) {

	currentUser, _ := c.Get("user")
	user := currentUser.(User)

	var input PurchaseItemsInput

	err := c.ShouldBindJSON(&input)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid arguments", "ctx": err})
		return
	}

	var item Item
	err = sess.Collection("items").Find(db.Cond{"id": input.ItemID}).One(&item)
	if err != nil {
		if err == db.ErrNoMoreRows {
			c.JSON(400, gin.H{"error": "The item does not exist"})
			return
		} else {
			c.JSON(500, gin.H{"error": "Error fetching item", "ctx": err})
		}
	}

	cost := item.Cost * input.Quantity

	// Check to make sure the user can afford this item
	if user.Currency-cost < 0 {
		c.JSON(400, gin.H{"error": "Insufficient currency for transaction"})
		return
	}

	ctx := context.Background()

	// Perform the purchase in a transaction to avoid bad charges on sudden server shutdown
	err = sess.Tx(ctx, func(tx sqlbuilder.Tx) error {

		// Update the user's
		_, err := tx.Update("users").Set("currency = ?", user.Currency-cost).Where("id = ?", user.ID).Limit(1).Exec()
		if err != nil {
			return err
		}

		// Get the current inventory amount (if any) of this item
		var userItem UserItem
		err = tx.SelectFrom("user_items").Where(db.Cond{"user_id": user.ID, "item_id": item.ID}).One(&userItem)
		if err != nil {
			// Update the userItem object with the correct item and user ids
			if err == db.ErrNoMoreRows {

				// If there was no row, we need to create the entry
				_, err := tx.InsertInto("user_items").Values(&UserItem{UserID: user.ID, ItemID: item.ID, Count: input.Quantity}).Exec()
				if err != nil {
					return err
				} else {
					return nil
				}
			} else {
				return err
			}
		}

		// Set the new quantity of item
		userItem.Count += input.Quantity

		// Update the inventory with the new count
		_, err = tx.Update("user_items").Set("count = ?", userItem.Count).Where("user_id = ?", user.ID).And("item_id = ?", item.ID).Exec()
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Error purchasing item", "ctx": err})
	}
}

// PurchaseBulkItems is a handler to allow for purchasing more than one item at a time
func PurchaseBulkItems(c *gin.Context) {
	currentUser, _ := c.Get("user")

	user := currentUser.(User)

	var input map[int64]int64

	err := c.ShouldBindJSON(&input)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid Arguments", "ctx": err})
		return
	}

	fmt.Printf("%+v\n", input)

	var itemIds []int64

	for itemId, _ := range input {
		itemIds = append(itemIds, itemId)
	}

	var items []Item
	err = sess.SelectFrom("items").Where("id IN ?", itemIds).All(&items)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while doing item lookup", "ctx": err})
		return
	}

	fmt.Printf("%+v\n", itemIds)
	fmt.Printf("%+v\n", items)

	// Make sure all the items were returned
	if len(itemIds) != len(items) {
		c.JSON(500, gin.H{"error": "Not all items existed", "ids": itemIds, "items": items})
		return
	}

	var totalCost int

	// Extract a slice of user ids
	for _, item := range items {
		quantity := input[item.ID]
		totalCost += item.Cost * int(quantity)
	}

	// Make sure the user has enough money
	if totalCost > user.Currency {
		c.JSON(400, gin.H{"error": "Insufficient currency for transaction"})
		return
	}

	ctx := context.Background()

	err = sess.Tx(ctx, func(tx sqlbuilder.Tx) error {

		// Update the user's currency
		_, err := tx.Update("users").Set("currency = ?", user.Currency-totalCost).Where("id = ?", user.ID).Limit(1).Exec()
		if err != nil {
			return err
		}

		// Modify user inventory
		// TODO use less db queries
		for _, itemId := range itemIds {
			// Get the current inventory amount (if any) of this item
			var userItem UserItem
			err = tx.SelectFrom("user_items").Where(db.Cond{"user_id": user.ID, "item_id": itemId}).One(&userItem)
			if err != nil {
				// Update the userItem object with the correct item and user ids
				if err == db.ErrNoMoreRows {

					// If there was no row, we need to create the entry
					_, err := tx.InsertInto("user_items").Values(&UserItem{UserID: user.ID, ItemID: itemId, Count: int(input[itemId])}).Exec()
					if err != nil {
						return err
					}
				} else {
					return err
				}
			}

			// Set the new quantity of item
			userItem.Count += int(input[itemId])

			// Update the inventory with the new count
			_, err = tx.Update("user_items").Set("count = ?", userItem.Count).Where("user_id = ?", user.ID).And("item_id = ?", itemId).Exec()
			if err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Error purchasing items", "ctx": err})
		return
	}
}

// GetInventory handler returns the current user's inventory
func GetInventory(c *gin.Context) {

	// Grab the current user from the context
	currentUser, _ := c.Get("user")

	// Cast the user to the actual user type
	user := currentUser.(User)

	userItems, err := GetUserInventory(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error while loading user items", "ctx": err})
		return
	}

	c.JSON(200, userItems)
}

func GetUserInventory(id int64) ([]InventoryItem, error) {
	var userItems []InventoryItem

	err := sess.Select("i.id as item_id", "ui.count as count", "i.name as name", "i.category as category", "i.description as description", "i.cost as cost").From("user_items ui").Join("items i").On("i.id = ui.item_id").Where("user_id = ?", id).All(&userItems)
	if err != nil {
		return nil, err
	}

	return userItems, nil
}
