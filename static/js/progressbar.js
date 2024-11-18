
// Update the progress bar
    function setCurrentStep(currentStep) {
        // Get all step circles and progress bars
        const stepCircles = document.querySelectorAll("#progress-bar .rounded-full");
        const progressBars = document.querySelectorAll("#progress-bar .h-1");

        // Update step circles
        stepCircles.forEach((circle, index) => {
            if (index < currentStep - 1) {
                // Completed steps
                circle.classList.add("bg-blue-600", "text-white");
                circle.classList.remove("bg-gray-200", "text-gray-600");
            } else if (index === currentStep - 1) {
                // Current step
                circle.classList.add("bg-blue-600", "text-white");
                circle.classList.remove("bg-gray-200", "text-gray-600");
            } else {
                // Upcoming steps
                circle.classList.remove("bg-blue-600", "text-white");
                circle.classList.add("bg-gray-200", "text-gray-600");
            }
        });

        // Update progress bars
        progressBars.forEach((bar, index) => {
            if (index < currentStep - 1) {
                bar.classList.add("bg-blue-600");
                bar.classList.remove("bg-gray-200");
            } else {
                bar.classList.add("bg-gray-200");
                bar.classList.remove("bg-blue-600");
            }
        });
    }


