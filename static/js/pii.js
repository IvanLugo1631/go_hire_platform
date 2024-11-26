document.addEventListener("DOMContentLoaded", function() {
    // Get the saved step from localStorage (if available)
    const savedStep = sessionStorage.getItem('currentStep') || 1;
    setCurrentStep(savedStep);
    const form = document.getElementById('piiForm');

    // Populate PII form with saved data
    if(form) {
        populatePiiForm();
    }

    // Toggle mobile menu
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }
});

// Function to handle form submission and go to signature
function submitFormAndGoToSignature() {
    const form = document.getElementById('piiForm');
    const formData = new FormData(form);
    let hasError = false;

    // Clear previous error styles
    form.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            hasError = true;
        }
    });

    if (hasError) {
        const firstErrorField = form.querySelector('.error');
        firstErrorField.focus();
        return;
    }

    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    sessionStorage.setItem('piiData', JSON.stringify(formDataObject));
    window.location.href = '/signature';

    // Update the current step in sessionStorage
    const currentStep = 2;
    sessionStorage.setItem('currentStep', currentStep);
    setCurrentStep(currentStep);
}

// Function to set the current step based on the saved step from sessionStorage
function setCurrentStep(step) {
    const stepElements = document.querySelectorAll('.step');
    stepElements.forEach((element, index) => {
        element.classList.toggle('active', index + 1 === step);
    });
}


// Function to populate PII form with saved data
function populatePiiForm() {
    const form = document.getElementById('piiForm');
    if (!form) {
        console.error("Form with id 'piiForm' not found in the DOM.");
        return;
    }
    const savedData = sessionStorage.getItem('piiData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        const form = document.getElementById('piiForm');

        Object.entries(formData).forEach(([key, value]) => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = value;
            }
        });
    }
}