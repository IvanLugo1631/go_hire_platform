document.addEventListener("DOMContentLoaded", () => {
    const consentCheckbox = document.getElementById("consent-checkbox");
    const signatureSection = document.getElementById("signature-section");
    const activateSignatureBtn = document.getElementById("activate-signature");
    const sigCanvas = document.getElementById("sig-canvas");
    const submitBtn = document.getElementById("sig-submitBtn");
    const clearBtn = document.getElementById("sig-clearBtn");
    const fullNameInput = document.getElementById("full-name");
    const nextButton = document.getElementById("next-button");

    let isCanvasInitialized = false;
    let isSigned = false;

    // Check if there is any saved data in sessionStorage and populate the form accordingly
    const signatureData = sessionStorage.getItem('signatureData');
    const signatureName = sessionStorage.getItem('signatureName');
    const consentGiven = sessionStorage.getItem('consentGiven');

    // TODO:Create block functions to structure the code and make it more readable

    if (signatureData) {
        // If signature data exists in sessionStorage, draw the signature on the canvas
        const img = new Image();
        img.src = signatureData;
        img.onload = () => {
            const ctx = sigCanvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
        };
        // Simulate the "Sign" button behavior: Open the canvas and show signature section
        signatureSection.classList.remove("hidden");
        sigCanvas.classList.remove("hidden");
        submitBtn.classList.remove("hidden");
        clearBtn.classList.remove("hidden");
        activateSignatureBtn.classList.add("hidden");

        if (!isCanvasInitialized) {
            initializeCanvas();
            isCanvasInitialized = true;
        }
    }

    // Populate the full name input field and consent checkbox based on sessionStorage data
    if (signatureName) {
        fullNameInput.value = signatureName;
    }
    if (consentGiven === 'true') {
        consentCheckbox.checked = true;
        signatureSection.classList.remove("hidden");
    } else {
        signatureSection.classList.add("hidden");
    }

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
        sessionStorage.removeItem('signatureData');
        isSigned = false;
        toggleSubmitButton();
    });

    submitBtn.addEventListener("click", () => {
        if (!isSigned) {
            alert("Please provide your signature before submitting.");
            return;
        }

        // Store the signature data, name, and consent status in sessionStorage
        const dataURL = sigCanvas.toDataURL("image/png");
        sessionStorage.setItem('signatureData', dataURL);
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

    // Next button click handler to validate session data
    nextButton.addEventListener("click", () => {
        const signatureData = sessionStorage.getItem('signatureData');
        const signatureName = sessionStorage.getItem('signatureName');
        const consentGiven = sessionStorage.getItem('consentGiven');

        if (!signatureData || !signatureName || consentGiven !== 'true') {
            alert('You must provide all required information (signature, name, and consent) to proceed.');
            return;
        }

        // If validation passes, redirect to the next page
        window.location.href = '/employment';
    });
});

function goBackToPii() {
    sessionStorage.setItem('currentStep', 1);
    setCurrentStep(1);
    window.location.href = '/personal-information';
}

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
