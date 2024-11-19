document.addEventListener("DOMContentLoaded", function() {
    // Get the saved step from localStorage (if available)
    const savedStep = localStorage.getItem('currentStep') || 1;
    setCurrentStep(savedStep);

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
z
});

    // Submit form and go to signature
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
        // Focus the first invalid field
        const firstErrorField = form.querySelector('.error');
        firstErrorField.focus();
        return;
    }

    // Proceed to submit the form if no errors
    fetch('/personal-information', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Server response:', data);
            window.location.href = '/signature';
            const currentStep = 2;
            localStorage.setItem('currentStep', currentStep);
            setCurrentStep(currentStep);
        } else {
            console.error('Server indicated failure:', data);
            alert('There was an error saving your data: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form: ' + error.message);
    });
}

