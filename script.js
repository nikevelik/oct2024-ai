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

// Function to show the next textarea when something is typed in the current one
function showNextOnInput(currentFieldId, nextFieldId) {
    const currentField = document.getElementById(currentFieldId);
    const nextField = document.getElementById(nextFieldId);

    // Listen for any input in the current textarea
    currentField.addEventListener('input', function() {
        // Check if there is any input in the current field
        if (currentField.value.trim() !== '') {
            nextField.classList.add('fade-in'); // Apply fade-in effect
        }
    });
}

// Function to show the submit button when the last textarea is revealed
function showSubmitButtonAndImage() {
    const submitButton = document.getElementById('submitButton');
    const swayingImage = document.getElementById('swayingImage');
    const lastField = document.getElementById('field4');

    // Listen for input in the last textarea
    lastField.addEventListener('input', function() {
        if (lastField.value.trim() !== '') {
            // Show the submit button and image
            submitButton.classList.add('fade-in');  // Apply fade-in effect to the button
            swayingImage.classList.add('fade-in');  // Apply fade-in effect to the image
        }
    });
}

// Initialize the flowy effect for the first textarea and set up the sequential appearance
window.onload = function() {
    const firstField = document.getElementById('field1');
    firstField.classList.add('fade-in');  // Make the first textarea fade-in on load

    // Set up the sequential appearance for the textareas
    showNextOnInput('field1', 'field2');
    showNextOnInput('field2', 'field3');
    showNextOnInput('field3', 'field4');

    // Show the submit button and the image only after the last textarea has input
    showSubmitButtonAndImage();
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
