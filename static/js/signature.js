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
});

// Submit form and go to employment
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

    // Proceed to submit the form if no errors
    fetch('/signature', {
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
            window.location.href = '/employment';
            const currentStep = 3;
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

};