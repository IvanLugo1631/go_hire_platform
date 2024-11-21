package handlers

import (
	"log"
	"fmt"
	"net/http"
	"onboarding/types"
	"encoding/json"
)

	// Signature page
func HandleSignature(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodPost {
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			log.Printf("Error parsing multipart form: %v", err)
			http.Error(w, "Unable to parse form: "+err.Error(), http.StatusBadRequest)
			return
		}

		signature := r.FormValue("signature")
		fmt.Println(signature)
	
		response := map[string]interface{}{
			"success": true,
			"message": "Data saved successfully",
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Printf("Error encoding response: %v", err)
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
			return
		}
		return

	}

	data := types.PageData{
		PageTitle: "Signature for Terms and Conditions",
	}
	err := tpl.Lookup("signature.go.html").Execute(w, data)
	if err != nil {
		log.Printf("Error rendering template: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}