/*
	baker.go

	This file contains code to simulate the baking of bread
*/
package baker

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
	switch name {
	case "Water":
	case "Fiji Water":
	case "Glacier Water":
	case "Mystery Water":
	case "Wator":
	case "Dirty Water":
	case "Child's Tears":
	case "Fountain of Youth Water":
	case "Angel's Tears":
		return Water{WaterType: name, Amount: count}
	case "Eggs":
	case "Organic Eggs":
	case "Golden Eggs":
	case "Dragon's Eggs":
	case "Fish Eggs":
	case "Mystery Eggs":
		return Egg{EggType: name, Amount: count}
	case "Wheat Flour":
	case "Oat Flour":
	case "Bone Flour":
	case "Mystery Flour":
		return Flour{FlourType: name, Amount: count}
	case "Cow's Milk":
	case "Goat's Milk":
	case "Basically Cheese":
	case "Demon's Milk":
	case "Milk of Magnesia":
	case "Dragon's Milk":
		return Milk{MilkType: name, Amount: count}
	case "Butter":
	case "Grass-Fed Butter":
	case "Vegetable Oil":
	case "Pixie Oil":
	case "Mystery Grease":
	case "Engine Grease":
	case "Olive Oil":
		return Oil{OilType: name, Amount: count}
	case "That Good Good Yeast":
	case "That Bad Bad Yeast":
	case "Quick Rise Yeast":
	case "Slow Rise Yeast":
	case "Instant Yeast":
	case "Artisanal Yeast":
	case "Low Rise Yeast":
		return Yeast{YeastType: name, Amount: count}
	}

	return nil
}
