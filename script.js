function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    splashScreen.classList.add('hidden');

    setTimeout(() => {
        splashScreen.style.display = 'none'; 
        mainContent.style.display = 'block'; 
    }, 1500); 
}

document.getElementById('start-button').addEventListener('click', function() {
    hideSplashScreen();
});

// Function to apply the shake and flowy effect to the first note
function applyInitialAnimations() {
    const firstField = document.getElementById('field1');
    
    // Apply shake effect initially
    firstField.classList.add('shake');
    
    // Remove shake effect after it completes
    setTimeout(() => {
        firstField.classList.remove('shake');
        firstField.classList.add('flowy'); // Add flowy effect for continuous animation
    }, 1000); // Adjust this time to match the shake animation duration
}
// Function to show the next textarea when something is typed in the current one
function showNextOnInput(currentFieldId, nextFieldId) {
    const currentField = document.getElementById(currentFieldId);
    const nextField = document.getElementById(nextFieldId);

    // Listen for any input in the current textarea
    currentField.addEventListener('input', function() {
        // Check if there is any input in the current field
        if (currentField.value.trim() !== '') {
            nextField.style.display = 'block';  // Reveal the next textarea
            nextField.classList.add('fade-in'); // Apply fade-in effect
            nextField.classList.add('flowy');   // Add flowy effect to the next textarea
        }
    });
}

// Function to show the submit button when the last textarea is revealed
function showSubmitButton() {
    const submitButton = document.getElementById('submitButton');
    const lastField = document.getElementById('field4');

    // Listen for input in the last textarea
    lastField.addEventListener('input', function() {
        // Show the submit button when the last textarea has input
        if (lastField.value.trim() !== '') {
            submitButton.style.display = 'block';   // Reveal the submit button
            submitButton.classList.add('fade-in');  // Apply fade-in effect to the button
        }
    });
}

// Initialize the flowy effect for the first textarea and set up the sequential appearance
window.onload = function() {
    const firstField = document.getElementById('field1');
    firstField.classList.add('fade-in');  // Make the first textarea fade-in on load
    firstField.classList.add('flowy');    // Apply flowy animation to the first textarea

    // Set up the sequential appearance for the textareas
    showNextOnInput('field1', 'field2');
    showNextOnInput('field2', 'field3');
    showNextOnInput('field3', 'field4');

    // Show the submit button only after the last textarea has input
    showSubmitButton();
};

// Ensure form submission is handled properly
function handleFormSubmit(formId, url, responseMessageId) {
    const form = document.getElementById(formId);

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect data from the form fields
        const budget = document.getElementById('field2').value;
        const preferences = document.getElementById('field4').value;
        const exclude = document.getElementById('field3').value;
        const calories = document.getElementById('field1').value;

        // Create the data object
        const requestData = {
            budget: parseFloat(budget),
            include: preferences,
            exclude: exclude,
            calories: parseInt(calories, 10)
        };

        try {
            // Send POST request to backend
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData) // Send data as JSON
            });

            // Handle server response
            const result = await response.json();
            document.getElementById(responseMessageId).innerText = result.message;

            // Optionally update AI response section
            document.getElementById('ai-response').innerText = "Result from AI: " + result.data;

        } catch (error) {
            console.error('Error:', error);
            document.getElementById(responseMessageId).innerText = 'An error occurred. Please try again.';
        }
    });
}

// Call the function
handleFormSubmit('textForm', 'http://127.0.0.1:5000/post-data', 'responseMessage');
