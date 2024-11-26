document.addEventListener("DOMContentLoaded", () => {
    const consentCheckbox = document.getElementById("consent-checkbox");
    const signatureSection = document.getElementById("signature-section");
    const activateSignatureBtn = document.getElementById("activate-signature");
    const sigCanvas = document.getElementById("sig-canvas");
    const submitBtn = document.getElementById("sig-submitBtn");
    const clearBtn = document.getElementById("sig-clearBtn");

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
        alert("Signature submitted! Data URL: " + dataURL);
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

    // Load form data from localStorage (if available)
    const storedData = sessionStorage.getItem('piiData');
    if (storedData) {
        const formDataObject = JSON.parse(storedData);
        for (const [key, value] of Object.entries(formDataObject)) {
            const inputElement = document.querySelector(`[name="${key}"]`);
            if (inputElement) {
                inputElement.value = value;
            }
        }
    }

    // Function to submit form and go to the employment page (if form is valid)
    const submitFormAndGoToEmployment = () => {
        const form = document.getElementById('signatureForm');
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
    };


    // Event listener for the back button
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', goBackToPii);
    }
});

    // Function to set the current step based on the saved step from localStorage
function setCurrentStep(step) {
    const stepElements = document.querySelectorAll('.step');
    stepElements.forEach((element, index) => {
        element.classList.toggle('active', index + 1 === step);
    });
}

    // Function to go back to PII page from signature
function goBackToPii() {
    sessionStorage.setItem('currentStep', 1);
    setCurrentStep(1);
    window.location.href = '/personal-information';
}