package main

import (
	"testing"

	"github.com/calebhiebert/hybread/server/baker"
)

func TestBaking(t *testing.T) {
	bread := baker.Bread{
		MixSeconds:   10,
		RiseMinutes:  5,
		KneadSeconds: 5,
		BakeMinutes:  60,
		Items:        []baker.BreadAffector{baker.Water{WaterType: "Fiji Water", Amount: 3}},
	}

	baker.Bake(&bread)

	if bread.Tastiness != 6005 {
		t.Error("Expected 6005, got", bread.Tastiness)
	}
}
