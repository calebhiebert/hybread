/*
	baker.go

	This file contains code to simulate the baking of bread
*/
package baker

import (
	"fmt"
)

// Bake will bake the bread
func Bake(bread *Bread) (*Bread, error) {

	// Mix the bread
	for ms := 0; ms < bread.MixSeconds; ms++ {
		for _, item := range bread.Items {
			bread = item.mix(ms+1, bread)
		}
	}

	// Rise the bread
	for rm := 0; rm < bread.RiseMinutes; rm++ {
		for _, item := range bread.Items {
			bread = item.rise(rm+1, bread)
		}
	}

	// Knead the bread
	for ks := 0; ks < bread.KneadSeconds; ks++ {
		for _, item := range bread.Items {
			bread = item.knead(ks+1, bread)
		}
	}

	// Pan the bread
	for _, item := range bread.Items {
		bread = item.pan(bread)
	}

	// Bake the bread
	for bm := 0; bm < bread.BakeMinutes; bm++ {
		for _, item := range bread.Items {
			bread = item.bake(bm+1, bread)
		}
	}

	return bread, nil
}

// GetAffectorByName returns a BreadAffector object that is pre-filled based on the item name
func GetAffectorByName(name string, count int) BreadAffector {
	fmt.Println("GOT NAME", name, len(name))

	switch name {
	case "Water",
		"Fiji Water",
		"Glacier Water",
		"Mystery Water",
		"Wator",
		"Dirty Water",
		"Child's Tears",
		"Fountain of Youth Water",
		"Angel's Tears":
		return Water{WaterType: name, Amount: count}
	case "Eggs",
		"Organic Eggs",
		"Golden Eggs",
		"Dragon's Eggs",
		"Fish Eggs",
		"Mystery Eggs":
		return Egg{EggType: name, Amount: count}
	case "Wheat Flour",
		"Oat Flour",
		"Bone Flour",
		"Mystery Flour":
		return Flour{FlourType: name, Amount: count}
	case "Cow's Milk",
		"Goat's Milk",
		"Basically Cheese",
		"Demon's Milk",
		"Milk of Magnesia",
		"Dragon's Milk":
		return Milk{MilkType: name, Amount: count}
	case "Butter",
		"Grass-Fed Butter",
		"Vegetable Oil",
		"Pixie Oil",
		"Mystery Grease",
		"Engine Grease",
		"Olive Oil":
		return Oil{OilType: name, Amount: count}
	case "That Good Good Yeast",
		"That Bad Bad Yeast",
		"Quick Rise Yeast",
		"Slow Rise Yeast",
		"Instant Yeast",
		"Artisanal Yeast",
		"Low Rise Yeast":
		return Yeast{YeastType: name, Amount: count}
	}

	return nil
}
