package handlers

import (
	"log"
	"net/http"
	"onboarding/types"
)

	// Signature page
func HandleSignature(w http.ResponseWriter, r *http.Request) {
	
	data := types.PageData{
		PageTitle: "Signature for Terms and Conditions",
	}
	err := tpl.Lookup("signature.go.html").Execute(w, data)
	if err != nil {
		log.Printf("Error rendering template: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}