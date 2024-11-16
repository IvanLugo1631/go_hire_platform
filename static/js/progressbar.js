document.addEventListener("DOMContentLoaded", () => {
    // Get current step from the data attribute (or set dynamically)
    const currentStep = parseInt(document.body.dataset.currentStep || "1");
    // Get all steps
    const steps = document.querySelectorAll(".step");
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        // Mark completed steps
        if (stepNumber < currentStep) {
            step.classList.add("completed");
        }
        // Mark active step
        if (stepNumber === currentStep) {
            step.classList.add("active");
        }
    });
});