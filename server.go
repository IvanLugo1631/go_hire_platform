package main

import (
    "embed"
    "html/template"
    "log"
    "net/http"
    "onboarding/handlers"
    "os"
    
    "github.com/gorilla/sessions"
    "github.com/joho/godotenv"
)

//go:embed templates/*
var templateFS embed.FS

var store *sessions.CookieStore

func main() {
    // Load environment variables from the .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Get the session secret key from environment variables
    secretKey := []byte(os.Getenv("SESSION_SECRET_KEY"))
    store = sessions.NewCookieStore(secretKey)
    
    // Configure session options
    store.Options = &sessions.Options{
        Path:     "/",
        HttpOnly: true,
        MaxAge:   86400 * 1, // 1 day
        Secure:   false,
    }

    // Pass the session store to handlers
    handlers.SetSessionStore(store)

    // Parse templates
    tpl, err := template.New("views").ParseFS(templateFS,
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

    // Set the template for handlers to use
    handlers.SetTemplate(tpl)

    // Serve static files
    fs := http.FileServer(http.Dir("./static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))

    // Define routes
    http.HandleFunc("/", handlers.HandleHome)
    http.HandleFunc("/personal-information", handlers.HandlePersonalInformation)
    http.HandleFunc("/signature", handlers.HandleSignature)
    http.HandleFunc("/employment", handlers.HandleEmployment)

    // Start the server
    log.Println("Server started at http://0.0.0.0:8089")
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