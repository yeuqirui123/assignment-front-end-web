/* main */

const howItWorksButton = document.getElementById("howItWorksButton");
const howItWorksContent = document.getElementById("howItWorksContent");
const faqButton = document.getElementById("faqButton");
const faqContent = document.getElementById("faqContent");
const toggleFaqButton = document.getElementById("toggleFaqButton");
const plusImgSrc = "Photos/plus.png";
const minusImgSrc = "Photos/minus.png";



// Toggling 'How It Works' content
howItWorksButton.addEventListener("click", function () {
    if (howItWorksContent.style.display === "none" || howItWorksContent.style.display === "") {
        howItWorksContent.style.display = "block";
        faqContent.style.display = "none";
    } else {
        howItWorksContent.style.display = "none";
    }
});

// Toggling 'FAQ' content
faqButton.addEventListener("click", function () {
    if (faqContent.style.display === "none" || faqContent.style.display === "") {
        faqContent.style.display = "block";
        howItWorksContent.style.display = "none";
    } else {
        faqContent.style.display = "none";
    }
});

// Rotating image logic
const faqContentDiv = document.getElementById("faqcontent");

const imgElement = toggleFaqButton.querySelector("img");

let isCollapsed = true; // Initial state is collapsed

toggleFaqButton.addEventListener("click", function () {
    if (isCollapsed) {
        faqContentDiv.classList.remove("collapse");
        imgElement.src = minusImgSrc;
        imgElement.classList.add("rotate-180");
        isCollapsed = false;
    }
    else {
        faqContentDiv.classList.add("collapse");
        imgElement.src = plusImgSrc;
        imgElement.classList.remove("rotate-180");
        isCollapsed = true;
    }
});

/* profile */
$(document).ready(function () {
    const loggedInUser = 'user1';

    // ---------------------
    // Helper Functions
    // ---------------------

    function getProfiles() {
        return JSON.parse(localStorage.getItem(loggedInUser) || '[]');
    }

    function saveProfiles(profiles) {
        localStorage.setItem(loggedInUser, JSON.stringify(profiles));
    }

    function updateProfileDisplay() {
        let profiles = getProfiles();
        displayProfiles(profiles);
    }

    // ---------------------
    // Profile Display & Management
    // ---------------------

    // Function for display profile
    function displayProfiles(profiles) {
        const $profilesList = $('#profilesList').empty();

        if (profiles.length === 0) {
            // If no profiles, show a message
            $profilesList.append('<li class="list-group-item text-center">No profiles added.</li>');
            return; // Exit the function early
        }

        profiles.forEach((profile, index) => {
            const profileNumber = index + 1;
            const profileImage = profile.image ? 
            `<img id="profilelistimg" src="${profile.image}" alt="Pet Image" style="max-width: 100px; margin-bottom: 20px;">` 
            : 
            '<br><div style="border: 2px solid #ccc; padding: 10px; width: 100px; text-align: center;">No image added</div><br>';
        

            const $profileItem = $(`
                <li class="list-group-item profile-item" style="padding: 10px; border: 1px solid #ddd; margin-bottom: 10px;">
                    <span style="font-weight: bold; margin-bottom: 10px;">#${profileNumber}</span>
                    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                        ${profileImage}
                        <div>
                            <strong>Name:</strong> ${profile.name} <br>
                            <strong>Breed:</strong> ${profile.breed} <br>
                            <strong>Age:</strong> ${profile.age} <br>
                            <strong>Medical History:</strong> ${profile.medicalHistory} <br>
                        </div>
                    </div>
                    <div class="text-center" style="margin-top: 10px;">
                        <button class="btn btn-light edit-button" data-index="${index}">
                            <img src="Photos/edit.png" alt="Edit" width="24" height="24">
                        </button>
                        <button class="btn btn-light delete-button" data-index="${index}">
                            <img class="delete-icon" src="Photos/delete1.png" alt="Delete" width="24" height="24">
                        </button>
                    </div>
                </li>
            `);

            $profilesList.append($profileItem);
            $profileItem.find('.edit-button').on('click', () => editProfile(index));
        });
    }


    // Function for delete profile
    $('#profilesList').on('click', '.delete-button', function () {
        const index = $(this).data('index');
        const confirmationMessage = 'Are you sure you want to delete this profile?\nThis action cannot be undo.';
        if (confirm(confirmationMessage)) {
            const profiles = getProfiles();
            profiles.splice(index, 1);
            saveProfiles(profiles);
            updateProfileDisplay();
        }
    });


    // Function to populate the form with the selected profile's information for editing
    function editProfile(index) {
        const profiles = getProfiles();
        const selectedProfile = profiles[index];

        // Populate the edit form fields with the selected profile's information
        $('#editPetForm #petName').val(selectedProfile.name);
        $('#editPetForm #petBreed').val(selectedProfile.breed);
        $('#editPetForm #petAge').val(selectedProfile.age);
        $('#editPetForm #medicalHistory').val(selectedProfile.medicalHistory);
        $('#editPetForm #petProfileImage').attr('src', selectedProfile.image);

        // Display the edit form
        $('#editPetForm').show();
        $('#profilesListContainer').hide();

        // Adjust the submit handler of the edit form
        $('#editPetForm').off('submit').on('submit', function (e) {

            const ageInput = $('#editPetForm #petAge').val().trim();
            const agePattern = /^((1[0-2]|[1-9])\s+months?)|((\d{1,2})\s+years(\s*((1[0-2]|[1-9])\s+months?)?)?)$/i;

            // Check if the age input is invalid
            if (!agePattern.test(ageInput)) {
                e.preventDefault();
                $('#ageErrorMessage').text('Invalid Age Input. Please use the format: 1-99 years/ 1-12 months/ 1-99 years 1-12 months');
                $('#ageErrorMessage').show();
                return;
            } else {
                $('#ageErrorMessage').hide(); // Hide the error message if the age input is valid
            }

            // Update the selected profile's information
            selectedProfile.name = $('#editPetForm #petName').val();
            selectedProfile.breed = $('#editPetForm #petBreed').val();
            selectedProfile.age = $('#editPetForm #petAge').val();
            selectedProfile.medicalHistory = $('#editPetForm #medicalHistory').val();
            selectedProfile.image = $('#editPetForm #petProfileImage').attr('src');

            // Update the profile in the local storage
            profiles[index] = selectedProfile;
            saveProfiles(profiles);

            alert('Pet Profile updated successfully!');

            // Optionally, hide the edit form and show the profile list again
            $('#editPetForm').hide();
            $('#profilesListContainer').show();

            // Optionally, refresh the profiles list to reflect the changes
            displayProfiles(profiles);
        });
    }

    // ---------------------
    // Event Handlers for UI
    // ---------------------

    // Show Add Profile Form when the "Add Profile" button is clicked
    $('#addProfileButton').on('click', function () {
        $('#petForm').show();
        $('#profilesListContainer').hide();
    });

    // Show Saved Pet Profiles when the "View Profiles" button is clicked
    $('#viewProfilesButton').on('click', function () {
        $('#petForm').hide();
        $('#profilesListContainer').show();
    });

    $(document).click(function (event) {
        var $target = $(event.target);
        if (!$target.closest('#editPetForm').length && !$target.closest('.edit-button').length) {
            $('#editPetForm').hide();
        }
    });


    // ---------------------
    // Pet Form Submission
    // ---------------------
    $('#petForm').on('submit', function (e) {
        const ageInput = $('#petAge').val().trim();
        const agePattern = /^((1[0-2]|[1-9])\s+months?)|((\d{1,2})\s+years(\s*((1[0-2]|[1-9])\s+months?)?)?)$/i;

        // Check if the age input is invalid
        if (!agePattern.test(ageInput)) {
            e.preventDefault();
            $('#ageErrorMessage').text('Invalid Age Input. Please use the format: 1-99 years/ 1-12 months/ 1-99 years 1-12 months');
            $('#ageErrorMessage').show();
            return;
        } else {
            $('#ageErrorMessage').hide(); // Hide the error message if the age input is valid
        }

        // If the age input is valid, proceed with saving the profile
        const newProfile = {
            image: $('#petProfileImage').attr('src'),
            name: $('#petName').val(),
            breed: $('#petBreed').val(),
            age: ageInput,
            medicalHistory: $('#medicalHistory').val(),
        };

        const profiles = getProfiles();
        profiles.push(newProfile);
        saveProfiles(profiles);


        // Clear the form
        this.reset();

        // Optionally, if you want to reset the image preview as well:
        $('#petProfileImage').attr('src', '');

        // Hide the form
        $('#petForm').hide();

        alert('Pet Profile saved successfully!');

        displayProfiles(profiles);
    });


    $('.pet-image-input').on('change', function () {
        const fileInput = this;
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $(fileInput).closest('form').find('.pet-profile-image').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
        else {
            $(fileInput).closest('form').find('.pet-profile-image').attr('src', '');
        }
    });

    // add view

    // ---------------------
    // Initialize on page load
    // ---------------------
    updateProfileDisplay();
});

$('#addProfileButton').on('click', function () {
    const petForm = $('#petForm');
    const profilesListContainer = $('#profilesListContainer');

    if (petForm.css('display') === 'none' || petForm.css('display') === '') {
        petForm.css('display', 'block');
        profilesListContainer.css('display', 'none');
    } else {
        petForm.css('display', 'none');
    }
});

$('#viewProfilesButton').on('click', function () {
    const petForm = $('#petForm');
    const profilesListContainer = $('#profilesListContainer');

    if (profilesListContainer.css('display') === 'none' || profilesListContainer.css('display') === '') {
        profilesListContainer.css('display', 'block');
        petForm.css('display', 'none');
    } else {
        profilesListContainer.css('display', 'none');
    }
});



//SET COOKIES
const acceptButton = document.getElementById("acceptBtn");
const declineButton = document.getElementById("declineBtn");
const cookieBox = document.querySelector(".wrapper");
const overlay = document.querySelector(".overlay");

function hidePopup() {
    cookieBox.style.display = "none";
    overlay.style.display = "none";
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function acceptCookies() {
    console.log("Accepted cookies");
    setCookie("cookieConsent", "accepted", 365); // Setting cookie for a year
    hidePopup();
}

function declineCookies() {
    console.log("Declined cookies");
    hidePopup();
}

acceptButton.addEventListener("click", acceptCookies);
declineButton.addEventListener("click", declineCookies);

function checkCookieConsent() {
    const consent = getCookie("cookieConsent");
    if (consent === "accepted") {
        hidePopup();
    } else {
        cookieBox.style.display = "block";
        overlay.style.display = "block";
    }
}

// Check cookie consent status when the page loads
window.addEventListener("load", checkCookieConsent);




//Flexbox
$(document).ready(function () {
    let currentBox = 0;
    const boxes = $(".flexbox");

    // Show the first box by default
    $(boxes[currentBox]).show();

    // Function to hide forms and profiles when navigating
    function hideFormsAndProfiles() {
        $('#petForm').hide();
        $('#profilesListContainer').hide();
    }

    $("#prevButton").click(function () {
        $(boxes[currentBox]).hide();
        currentBox--;
        if (currentBox < 0) currentBox = boxes.length - 1;
        $(boxes[currentBox]).show();
        hideFormsAndProfiles();
    });

    $(".nextButton").click(function () {
        $(boxes[currentBox]).hide();
        currentBox++;
        if (currentBox >= boxes.length) currentBox = 0;
        $(boxes[currentBox]).show();
        hideFormsAndProfiles();
    });
});




//Location
document.getElementById('getLocation').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // Get user's latitude and longitude
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            // Save the user's latitude and longitude to session storage
            sessionStorage.setItem('userLatitude', userLatitude);
            sessionStorage.setItem('userLongitude', userLongitude);

            alert("Location saved into sessionStorage!");

        }, function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});



//Footer
const sections = document.querySelectorAll('section');

sections.forEach(section => {
    section.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 30;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 30;

        section.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });

    section.addEventListener('mouseleave', () => {
        section.style.transform = 'translate(0, 0)';
    });
});