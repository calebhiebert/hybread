package main

import (
	"testing"

	"github.com/calebhiebert/hybread/server/baker"
)

func TestAffector(t *testing.T) {
	affector := baker.GetAffectorByName("Fish Eggs", 1)

	if affector == nil {
		t.Error("Expected affector, but got nil")
	}

	affector = baker.GetAffectorByName("Water", 23)

	if affector == nil {
		t.Error("Expected affector, but got nil")
	}
}
