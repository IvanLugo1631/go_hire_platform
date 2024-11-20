	
	package handlers
	
	import (
		"log"
		"net/http"
		"onboarding/types"
	)
	
	// Employment page
func HandleEmployment(w http.ResponseWriter, r *http.Request) {

	data := types.PageData{
		PageTitle: "Employment",
	}
	err := tpl.Lookup("employment.go.html").Execute(w, data)
	if err != nil {
		log.Printf("Error rendering template: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

