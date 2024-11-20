package handlers

import (
	"log"
	"net/http"
	"onboarding/types"

)

// Home page
func HandleHome(w http.ResponseWriter, r *http.Request) {
	
	data := types.PageData{
		PageTitle: "Home",
	}
	err := tpl.Lookup("home.go.html").Execute(w, data)
	if err != nil {
		log.Printf("Error rendering template: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}


