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
