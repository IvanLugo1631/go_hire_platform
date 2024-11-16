document.addEventListener("DOMContentLoaded", () => {
    const consentCheckbox = document.getElementById("consent-checkbox");
    const signatureSection = document.getElementById("signature-section");
    const activateSignatureBtn = document.getElementById("activate-signature");
    const sigCanvas = document.getElementById("sig-canvas");
    const submitBtn = document.getElementById("sig-submitBtn");
    const clearBtn = document.getElementById("sig-clearBtn");

    let isCanvasInitialized = false;

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
    });

    submitBtn.addEventListener("click", () => {
        const context = sigCanvas.getContext("2d");
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
        });

        function getMousePos(canvasDom, mouseEvent) {
            const rect = canvasDom.getBoundingClientRect();
            return {
                x: mouseEvent.clientX - rect.left,
                y: mouseEvent.clientY - rect.top,
            };
        }
    }
});