/*
	bread.go

	This file contains the bread type
*/
package baker

// Bread struct will contain all possible properties of bread
type Bread struct {
	Tastiness    float64
	MixSeconds   int
	RiseMinutes  int
	KneadSeconds int
	BakeMinutes  int
	Items        []BreadAffector
}

// All items, ovens, etc... should impliment this interface
type BreadAffector interface {
	// Will be called for each second that the dough is mixed, param second is the total number of seconds the bread has been mixing for
	mix(second int, bread *Bread) *Bread

	// Will be called for each minute the dough is rising, param minute is the total number of minutes the bread has been rising for
	rise(minute int, bread *Bread) *Bread

	// Will be called for each second the dough is keaded, param second is the total number of seconds the bread has been kneading for
	knead(second int, bread *Bread) *Bread

	// Will be called when the dough is placed in the pan
	pan(bread *Bread) *Bread

	// Will be called for each minute the bread is cooking, param minute is the total number of minutes the bread has been cooking for
	bake(minute int, bread *Bread) *Bread
}
