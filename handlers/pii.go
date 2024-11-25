package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"onboarding/types"
)

type PersonalInformationStore struct {
	Contacts map[int64]PersonalInformation
	NextID   int64
	Lock     sync.Mutex
}

type PersonalInformation struct {
	ID        int64
	FirstName string
	LastName  string
	Email     string
	State     string
}

var personalInfoStore = PersonalInformationStore{
	Contacts: make(map[int64]PersonalInformation),
	NextID:   1,
}

// HandlePersonalInformation handles the personal information form
func HandlePersonalInformation(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			log.Printf("Error parsing multipart form: %v", err)
			http.Error(w, "Unable to parse form: "+err.Error(), http.StatusBadRequest)
			return
		}

		info := PersonalInformation{
			FirstName: r.FormValue("first-name"),
			LastName:  r.FormValue("last-name"),
			Email:     r.FormValue("email"),
			State:     r.FormValue("state"),
		}
		fmt.Println(info)

		// Store the personal information
		personalInfoStore.Lock.Lock()
		info.ID = personalInfoStore.NextID
		personalInfoStore.Contacts[personalInfoStore.NextID] = info
		personalInfoStore.NextID++
		personalInfoStore.Lock.Unlock()

		// Send JSON response
		response := map[string]interface{}{
			"success": true,
			"message": "Data saved successfully",
			"info":    info,
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Printf("Error encoding response: %v", err)
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
			return
		}
		return
	}

	// Handle GET request
	data := types.PageData{
		PageTitle: "Personal Information",
	}

	tmpl := GetTemplate()
	if tmpl == nil {
		log.Printf("Template not initialized")
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if err := tmpl.Lookup("pii.go.html").Execute(w, data); err != nil {
		log.Printf("Error executing template: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}