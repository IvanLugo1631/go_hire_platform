package handlers

import (
	"html/template"
	"sync"
)

var (
	tpl  *template.Template
	once sync.Once
)

func SetTemplate(t *template.Template) {
	once.Do(func() {
		tpl = t
	})
}

func GetTemplate() *template.Template {
	return tpl
}