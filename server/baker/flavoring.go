/*
flavoring.go

This file conatins the implimentations for the flavoring items

Available Flavoring Types:
	-	Sugar
	-	Salt
	-	Garlic
	-	Everything Nice
	-	Onions
	-	Rainbows
	-	Powdered Sasquatch Hairs
	-	Snails
	-	Dark Magic
	-	A Hearty Pat
	-	White Magic
	-	A Voodoo Curse
	-	Cyanide
	-	Raisins
	-	Apples
	-	Cinnamon
	-	A Lovely Song
	-	A Four Leaf Clover
	-	Your First Born Child
*/

package baker

type Flavoring struct {
	FlavoringType string
	Amount        int
}

func (w Flavoring) mix(second int, bread *Bread) *Bread {
	return bread
}

func (w Flavoring) rise(minute int, bread *Bread) *Bread {
	return bread
}

func (w Flavoring) knead(second int, bread *Bread) *Bread {
	return bread
}

func (w Flavoring) pan(bread *Bread) *Bread {
	return bread
}

func (w Flavoring) bake(minute int, bread *Bread) *Bread {
	switch w.FlavoringType {
	case "Sugar":

	case "Salt":

	case "Garlic":

	case "Everything Nice":

	case "Onions":

	case "Rainbows":

	case "Powdered Sasquatch Hairs":

	case "Snails":

	case "Dark Magic":

	case "A Hearty Pat":

	case "White Magic":

	case "A Voodoo Curse":

	case "Cyanide":

	case "Raisins":

	case "Apples":

	case "Cinnamon":

	case "A Lovely Song":

	case "A Four Leaf Clover":

	case "Your First Born Child":

	}

	return bread
}
