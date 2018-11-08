/*
	yeast.go

	This file conatins the implimentations for the yeast items

	Available Yeast Types:
		- That Good Good Yeast
		- That Bad Bad Yeast
		- Quick Rise Yeast
		- Slow Rise Yeast
		- Instant Yeast
		- Artisanal Yeast
		- Low Rise Yeast
*/

package baker

type Yeast struct {
	YeastType string
	Amount    int
}

func (w Yeast) mix(second int, bread *Bread) *Bread {
	return bread
}

func (w Yeast) rise(minute int, bread *Bread) *Bread {
	return bread
}

func (w Yeast) knead(second int, bread *Bread) *Bread {
	return bread
}

func (w Yeast) pan(bread *Bread) *Bread {
	return bread
}

func (w Yeast) bake(minute int, bread *Bread) *Bread {
	switch w.YeastType {
	case "That Good Good Yeast":

	case "That Bad Bad Yeast":

	case "Quick Rise Yeast":

	case "Slow Rise Yeast":

	case "Instant Yeast":

	case "Artisanal Yeast":

	case "Low Rise Yeast":

	}

	return bread
}
