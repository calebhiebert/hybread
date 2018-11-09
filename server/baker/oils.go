/*
	oils.go

	This file conatins the implimentations for the oils items

	Available Oil Types:
	- Butter
	- Grass-Fed Butter
	- Vegetable Oil
	- Pixie Oil
	- Mystery Grease
	- Engine Grease
	- Olive Oil
*/

package baker

type Oil struct {
	OilType string
	Amount  int
}

func (w Oil) mix(second int, bread *Bread) *Bread {
	return bread
}

func (w Oil) rise(minute int, bread *Bread) *Bread {
	return bread
}

func (w Oil) knead(second int, bread *Bread) *Bread {
	return bread
}

func (w Oil) pan(bread *Bread) *Bread {
	return bread
}

func (w Oil) bake(minute int, bread *Bread) *Bread {
	switch w.OilType {
	case "Butter":

	case "Grass-Fed Butter":

	case "Vegetable Oil":

	case "Pixie Oil":

	case "Mystery Grease":

	case "Engine Grease":

	case "Olive Oil":

	}
	return bread
}
