package main

import (
	"embed"
	"encoding/json"

	"html/template"
	"log"
	"net/http"
	"sync"
)

//go:embed templates/*
var templateFS embed.FS

var tpl *template.Template

type PageData struct {
	Title     string
	PageTitle string
}

// Handle personal information form (GET and POST)
func handlePersonalInformation(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodPost {
        // Debug: Log the content type
        log.Printf("Received Content-Type: %s", r.Header.Get("Content-Type"))

        // Parse the multipart form
        err := r.ParseMultipartForm(10 << 20) // 10 MB max memory
        if err != nil {
            log.Printf("Error parsing multipart form: %v", err)
            http.Error(w, "Unable to parse form: "+err.Error(), http.StatusBadRequest)
            return
        }

        // Access form values
        contact := Contact{
            FirstName: r.FormValue("first-name"),
            LastName:  r.FormValue("last-name"),
            Email:     r.FormValue("email"),
            State:     r.FormValue("state"),
        }

        // Validate required fields
        if contact.FirstName == "" || contact.LastName == "" || contact.Email == "" {
            log.Printf("Missing required fields: FirstName='%s', LastName='%s', Email='%s'",
                contact.FirstName, contact.LastName, contact.Email)
            http.Error(w, "Missing required fields", http.StatusBadRequest)
            return
        }

        // Store the contact
        contactStore.Lock.Lock()
        contact.ID = contactStore.NextID
        contactStore.Contacts[contactStore.NextID] = contact
        contactStore.NextID++
        contactStore.Lock.Unlock()

        // Debug: Log the stored contact
        log.Printf("Successfully stored contact: %+v", contact)

        // Send JSON response
        response := map[string]interface{}{
            "success": true,
            "message": "Data saved successfully",
            "contact": contact,
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
    data := PageData{
        PageTitle: "Personal Information",
    }
    if err := tpl.Lookup("pii.go.html").Execute(w, data); err != nil {
        log.Printf("Error executing template: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}



func main() {
	var err error
	tpl, err = template.New("views").ParseFS(templateFS,
		"templates/header.go.html",
		"templates/footer.go.html",
		"templates/navbar.go.html",
		"templates/home.go.html",
		"templates/progressbar.go.html",
		"templates/pii.go.html",
		"templates/signature.go.html",
		"templates/employment.go.html",
	)
	if err != nil {
		log.Fatalf("Error parsing templates: %v", err)
	}

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Route for personal information
	http.HandleFunc("/personal-information", handlePersonalInformation)

	// Home page
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		data := PageData{
			PageTitle: "Home",
		}
		err := tpl.Lookup("home.go.html").Execute(w, data)
		if err != nil {
			log.Printf("Error rendering template: %s", err)
			http.Error(w, "Internal Server Error", 500)
			return
		}
	})

	// Signature page
	http.HandleFunc("/signature", func(w http.ResponseWriter, r *http.Request) {
		data := PageData{
			PageTitle: "Signature for Terms and Conditions",
		}
		err := tpl.Lookup("signature.go.html").Execute(w, data)
		if err != nil {
			log.Printf("Error rendering template: %s", err)
			http.Error(w, "Internal Server Error", 500)
			return
		}
	})

	// Employment page
	http.HandleFunc("/employment", func(w http.ResponseWriter, r *http.Request) {
		data := PageData{
			PageTitle: "Employment",
		}
		err := tpl.Lookup("employment.go.html").Execute(w, data)
		if err != nil {
			log.Printf("Error rendering template: %s", err)
			http.Error(w, "Internal Server Error", 500)
			return
		}
	})

	// Start the server
	log.Println("http://0.0.0.0:8089")
	log.Fatal(http.ListenAndServe(":8089", nil))
}


type BGOrderData struct {
	Config Config `json:"config"`
	// PII // name and stuff
	SignedBy string `json:"signed_by,omitempty"`
	VEMP  []EmploymentRequest            `json:"vemp,omitempty"`
	}
	
	type Config struct {
	VEMP struct {
	Min int `json:"min,omitempty"`
	Max int `json:"max,omitempty"`
	}
	}
	
	
	type EmploymentRequest struct {
	Employer         string `json:"employer,omitempty"`
	StaffingAgency   string `json:"staffing_agency,omitempty"`
	Title            string `json:"title,omitempty"`
	PhoneNumber      string `json:"phone_number,omitempty"`
	Location         string `json:"location,omitempty"`
	Website          string `json:"website,omitempty"`
	Salary           string `json:"salary,omitempty"`
	StartDate        string `json:"start_date,omitempty"`
	EndDate          string `json:"end_date,omitempty"`
	ReasonForLeaving string `json:"reason_for_leaving,omitempty"`
	CurrentEmployer  bool   `json:"current_employer,omitempty"`
	DoNotContact     bool   `json:"do_not_contact,omitempty"`
	ContactName      string `json:"contact_name,omitempty"`
	ContactTitle     string `json:"contact_title,omitempty"`
	ContactEmail     string `json:"contact_email,omitempty"`
	}
	
	type ContactStore struct {
		Contacts map[int64]Contact
		NextID   int64
		Lock     sync.Mutex
	}
	
	type Contact struct {
		ID        int64
		FirstName string
		LastName  string
		Email     string
		State   string
	}
	
	var contactStore = ContactStore{
		Contacts: make(map[int64]Contact),
		NextID:   1,
	}