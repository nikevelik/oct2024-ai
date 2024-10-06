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













// function f makes request to the backend
async function f(budget, include, exclude, calories) {
      const response = await fetch('http://127.0.0.1:5000/post-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            budget,
            include,
            exclude,
            calories
        })
    });

    const result = await response.json();
    return result;
}


// how to call it
f(199, "I WANT RICE", "I HATE MEAT", 2000).then(function(data){
  // what to do with the result data
  console.log(data);
});
