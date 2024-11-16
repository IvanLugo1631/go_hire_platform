// Initialize position counter
let positionCounter = 1;

// Function to update the title with the position number
function updatePositionTitle() {
  const jobTitleElement = document.getElementById('job-title');
  jobTitleElement.textContent = `Position ${positionCounter}`;
}

// Function to add a new position (this will be triggered when the "Add Position" button is clicked)
document.getElementById('add-position').addEventListener('click', function() {
  positionCounter++;
  updatePositionTitle();
});

updatePositionTitle();


document.addEventListener("DOMContentLoaded", () => {
const successAlert = document.getElementById("success-alert");
const addPositionButton = document.getElementById("add-position");
const removePositionButton = document.getElementById("remove-position");
const savePositionButton = document.getElementById("save-position");
const employmentList = document.getElementById("employment-list");

let employmentHistory = [{
  id: '1',
  employer: '',
  title: '',
  startDate: '',
  endDate: '',
  currentEmployer: false,
  location: '',
  website: '',
  phoneNumber: '',
  contactEmail: ''
}];

let activeJobIndex = 0;

const validateForm = (job) => {
  const errors = {};
  if (!job.employer) errors.employer = 'Employer is required';
  if (!job.title) errors.title = 'Title is required';
  if (!job.startDate) errors.startDate = 'Start date is required';
  if (!job.currentEmployer && !job.endDate) errors.endDate = 'End date is required';
  return errors;
};

const renderEmploymentList = () => {
  employmentList.innerHTML = '';
  employmentHistory.forEach((job, index) => {
    const jobButton = document.createElement('button');
    jobButton.classList.add('w-full', 'px-4', 'py-2', 'text-left', 'border', 'border-gray-300', 'rounded-md', 'text-sm', 'font-medium', 'text-gray-700', 'hover:bg-gray-100', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-blue-500');
    jobButton.textContent = job.employer || `Position ${index + 1}`;
    jobButton.addEventListener('click', () => {
      activeJobIndex = index;
      renderFormFields(job);
    });
    employmentList.appendChild(jobButton);
  });
};

const renderFormFields = (job) => {
  const employerInput = document.getElementById("employer");
  const titleInput = document.getElementById("title");
  const locationInput = document.getElementById("location");
  const websiteInput = document.getElementById("website");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const currentEmployerInput = document.getElementById("currentEmployer");

  employerInput.value = job.employer;
  titleInput.value = job.title;
  locationInput.value = job.location;
  websiteInput.value = job.website;
  startDateInput.value = job.startDate;
  endDateInput.value = job.endDate;
  currentEmployerInput.checked = job.currentEmployer;

  document.getElementById("job-title").textContent = job.employer ? job.employer : 'New Position';
  removePositionButton.classList.toggle('hidden', activeJobIndex === -1);

  // Clear any previous error messages
  const errorElements = document.querySelectorAll('.text-red-600');
  errorElements.forEach((error) => error.classList.add('hidden'));
};

// TODO: Implement the handleInputChange function

// const handleInputChange = (field, value) => {
//   const job = employmentHistory[activeJobIndex];
//   job[field] = value;
//   employmentHistory[activeJobIndex] = job;
// };

const handleSavePosition = () => {
  const currentJob = employmentHistory[activeJobIndex];
  const errors = validateForm(currentJob);

  // Clear previous errors
  const errorElements = document.querySelectorAll('.text-red-600');
  errorElements.forEach((error) => error.classList.add('hidden'));

  // Show error messages for invalid fields
  for (const field in errors) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
      errorElement.textContent = errors[field];
      errorElement.classList.remove('hidden');
    }
  }

  // If no errors, show success alert
  if (Object.keys(errors).length === 0) {
    successAlert.classList.remove('hidden');
    setTimeout(() => successAlert.classList.add('hidden'), 3000);
  }
};

const addNewEmployment = () => {
  const newJob = {
    id: String(employmentHistory.length + 1),
    employer: '',
    title: '',
    startDate: '',
    endDate: '',
    currentEmployer: false,
    location: '',
    website: '',
    phoneNumber: '',
    contactEmail: ''
  };
  employmentHistory.push(newJob);
  activeJobIndex = employmentHistory.length - 1;
  renderEmploymentList();
  renderFormFields(newJob);
};

const removeEmployment = () => {
  if (employmentHistory.length > 1) {
    employmentHistory.splice(activeJobIndex, 1);
    activeJobIndex = Math.max(0, activeJobIndex - 1);
    renderEmploymentList();
    renderFormFields(employmentHistory[activeJobIndex]);
  }
};

addPositionButton.addEventListener('click', addNewEmployment);
removePositionButton.addEventListener('click', removeEmployment);
savePositionButton.addEventListener('click', handleSavePosition);

renderEmploymentList();
renderFormFields(employmentHistory[activeJobIndex]);
});