document.addEventListener("DOMContentLoaded", () => {
    const consentCheckbox = document.getElementById("consent-checkbox");
    const signatureSection = document.getElementById("signature-section");
    const activateSignatureBtn = document.getElementById("activate-signature");
    const sigCanvas = document.getElementById("sig-canvas");
    const submitBtn = document.getElementById("sig-submitBtn");
    const clearBtn = document.getElementById("sig-clearBtn");
    const fullNameInput = document.getElementById("full-name");

    let isCanvasInitialized = false;
    let isSigned = false;

    consentCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            signatureSection.classList.remove("hidden");
        } else {
            signatureSection.classList.add("hidden");
        }
    });

    activateSignatureBtn.addEventListener("click", () => {
        sigCanvas.classList.remove("hidden");
        submitBtn.classList.remove("hidden");
        clearBtn.classList.remove("hidden");
        activateSignatureBtn.classList.add("hidden");

        if (!isCanvasInitialized) {
            initializeCanvas();
            isCanvasInitialized = true;
        }
    });

    clearBtn.addEventListener("click", () => {
        const context = sigCanvas.getContext("2d");
        context.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
        isSigned = false;
        toggleSubmitButton();
    });

    submitBtn.addEventListener("click", () => {
        if (!isSigned) {
            alert("Please provide your signature before submitting.");
            return;
        }
        const dataURL = sigCanvas.toDataURL("image/png");

        sessionStorage.setItem('signatureData', dataURL);

        // Capture the full name and consent status, then store them
        sessionStorage.setItem('signatureName', fullNameInput.value);
        sessionStorage.setItem('consentGiven', consentCheckbox.checked);

        alert("Signature submitted successfully!");
    });

    function initializeCanvas() {
        const ctx = sigCanvas.getContext("2d");
        let drawing = false;
        let mousePos = { x: 0, y: 0 };
        let lastPos = mousePos;

        sigCanvas.addEventListener("mousedown", (e) => {
            drawing = true;
            lastPos = getMousePos(sigCanvas, e);
        });

        sigCanvas.addEventListener("mouseup", () => (drawing = false));

        sigCanvas.addEventListener("mousemove", (e) => {
            if (!drawing) return;
            mousePos = getMousePos(sigCanvas, e);
            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            lastPos = mousePos;

            isSigned = true;
            toggleSubmitButton();
        });

        function getMousePos(canvasDom, mouseEvent) {
            const rect = canvasDom.getBoundingClientRect();
            return {
                x: mouseEvent.clientX - rect.left,
                y: mouseEvent.clientY - rect.top,
            };
        }
    }

    function toggleSubmitButton() {
        submitBtn.disabled = !isSigned;
    }
    submitBtn.disabled = true;

});

    // Function to go back to PII page from signature
function goBackToPii() {
    sessionStorage.setItem('currentStep', 1);
    setCurrentStep(1);
    window.location.href = '/personal-information';
}

// Function to set the current step based on the saved step from localStorage
function setCurrentStep(step) {
    const stepElements = document.querySelectorAll('.step');
    stepElements.forEach((element, index) => {
        element.classList.toggle('active', index + 1 === step);
    });
}
 // Function to handle form submission and go to employment
function submitFormAndGoToEmployment() {
    const form = document.getElementById('signatureForm');
    const consentCheckbox = document.getElementById('consent-checkbox');
    let hasError = false;

    // Clear previous error styles
    form.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });

    // Validate the Terms and Conditions checkbox
    if (!consentCheckbox.checked) {
        alert('You must agree to the Terms and Conditions to proceed.');
        consentCheckbox.focus();
        hasError = true;
    }
    
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

    // Continue form submission or navigation here
    window.location.href = '/employment';
}



    // // Load form data from localStorage (if available)
    // const storedData = sessionStorage.getItem('piiData');
    // if (storedData) {
    //     const formDataObject = JSON.parse(storedData);
    //     for (const [key, value] of Object.entries(formDataObject)) {
    //         const inputElement = document.querySelector(`[name="${key}"]`);
    //         if (inputElement) {
    //             inputElement.value = value;
    //         }
    //     }
    // }
