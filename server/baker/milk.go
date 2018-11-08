/*
	milk.go

	This file conatins the implimentations for the milk items

	Available Milk Types:
	- Cow's Milk
	- Goat's Milk
	- Basically Cheese
	- Demon's Milk
	- Milk of Magnesia
	- Dragon's Milk
*/

package baker

type Milk struct {
	MilkType string
	Amount   int
}

func (w Milk) mix(second int, bread *Bread) *Bread {
	return bread
}

func (w Milk) rise(minute int, bread *Bread) *Bread {
	return bread
}

func (w Milk) knead(second int, bread *Bread) *Bread {
	return bread
}

func (w Milk) pan(bread *Bread) *Bread {
	return bread
}

func (w Milk) bake(minute int, bread *Bread) *Bread {
	switch w.MilkType {
	case "Cow's Milk":

	case "Goat's Milk":

	case "Basically Cheese":

	case "Demon's Milk":

	case "Milk of Magnesia":

	case "Dragon's Milk":

	}
	return bread
}
