// pii.js
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

    // Submit form and go to signature
    function submitFormAndGoToSignature() {
        const formData = new FormData(document.getElementById('piiForm'));
        fetch('/personal-information', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Data saved successfully.');
                window.location.href = '/signature';
                // Update the current step to reflect progress and save it
                const currentStep = 2;
                localStorage.setItem('currentStep', currentStep);
                setCurrentStep(currentStep);
            } else {
                alert('There was an error saving your data.');
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form.');
        });
    }

    // Listen for the click event on the submit button
    const submitButton = document.querySelector('a[href="javascript:void(0)"]');
    if (submitButton) {
        submitButton.addEventListener('click', submitFormAndGoToSignature);
    }
});

