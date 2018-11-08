/*
	flour.go

	This file conatins the implimentations for the flour items

	Available Flour Types:
		- Wheat Flour
		- Oat Flour
		- Bone Flour
		- Mystery Flour
*/

package baker

type Flour struct {
	FlourType string
	Amount    int
}

func (w Flour) mix(second int, bread *Bread) *Bread {
	// bread.Tastiness++
	return bread
}

func (w Flour) rise(minute int, bread *Bread) *Bread {
	// bread.Tastiness--
	return bread
}

func (w Flour) knead(second int, bread *Bread) *Bread {
	return bread
}

func (w Flour) pan(bread *Bread) *Bread {
	return bread
}

func (w Flour) bake(minute int, bread *Bread) *Bread {
	switch w.FlourType {
	case "Wheat Flour":

	case "Oat Flour":

	case "Bone Flour":

	case "Mystery Flour":

	}

	return bread
}
