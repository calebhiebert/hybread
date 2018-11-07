/*
	egg.go

	This file containers the implimentations for the egg items

	Avilable Egg Types:
		- Eggs
		- Organic Eggs
		- Golden Eggs
		- Dragon's Eggs
		- Fish Eggs
		- Mystery Eggs
*/

package baker

type Egg struct {
	EggType string
	Amount  int
}

func (w Egg) mix(second int, bread *Bread) *Bread {
	if w.EggType == "Eggs" {

	}

	if w.EggType == "Organic Eggs" {

	}

	if w.EggType == "Golden Eggs" {

	}

	if w.EggType == "Dragon's Eggs" {

	}

	if w.EggType == "Fish Eggs" {

	}

	if w.EggType == "Mystery Eggs" {

	}
	return bread
}

func (w Egg) rise(second int, bread *Bread) *Bread {
	return bread
}

func (w Egg) knead(second int, bread *Bread) *Bread {
	return bread
}

func (w Egg) pan(second int, bread *Bread) *Bread {
	return bread
}

func (w Egg) bake(minute int, bread *Bread) *Bread {
	return bread
}
