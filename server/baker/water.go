/*
	water.go

	This file contains the implimentations for the water items
*/
package baker

type Water struct {
	WaterType string
}

func (w Water) mix(second int, bread *Bread) *Bread {
	bread.Tastiness++
	return bread
}

func (w Water) rise(minute int, bread *Bread) *Bread {
	bread.Tastiness--
	return bread
}

func (w Water) knead(second int, bread *Bread) *Bread {
	return bread
}

func (w Water) pan(bread *Bread) *Bread {
	return bread
}

func (w Water) bake(minute int, bread *Bread) *Bread {
	if w.WaterType == "Fiji Water" && minute == 50 {
		bread.Tastiness += 6000
	}

	return bread
}
