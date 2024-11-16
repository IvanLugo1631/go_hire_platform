package main

import (
	"embed"
	"html/template"
	"log"
	"net/http"
	"sync"
)
type PageData struct {
	Title     string
    PageTitle string
}


func main() {
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
		panic(err)
	}
	fs := http.FileServer(http.Dir("./static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))
	
	http.HandleFunc("/personal-information", func(w http.ResponseWriter, r *http.Request) {
		data := PageData{
			PageTitle: "Personal Information",
		}
		err := tpl.Lookup("pii.go.html").Execute(w, data)
		if err != nil {
			log.Printf("Error rendering template: %s", err)
			http.Error(w, "Internal Server Error", 500)
			return
		}
	})
	
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

	http.HandleFunc("/sign", func(w http.ResponseWriter, r *http.Request) {
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
	log.Println("http://0.0.0.0:8089")
	log.Fatal(http.ListenAndServe(":8089", nil))

}

//go:embed templates/*.go.html
var templateFS embed.FS

type ContactStore struct {
	Contacts map[int64]Contact
	NextId   int64
	Lock     sync.Mutex
}

type Contact struct {
	ID int64
}