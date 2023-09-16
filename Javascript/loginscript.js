document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#login-form");
    const signupForm = document.querySelector("#signup-form");
    const switchToSignup = document.querySelector("#switch-to-signup");
    const switchToLogin = document.querySelector("#switch-to-login");

    // Function to switch to the signup form
    function switchToSignupForm() {
        document.querySelector("#form-title").textContent = "Sign Up";
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        switchToSignup.style.display = "none";
        switchToLogin.style.display = "block";
    }

    // Function to switch to the login form
    function switchToLoginForm() {
        document.querySelector("#form-title").textContent = "Login";
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        switchToSignup.style.display = "block";
        switchToLogin.style.display = "none";
    }

    // Function to handle signup form submission
    function handleSignupFormSubmission(e) {
        e.preventDefault();
        const signupUsername = signupForm.querySelector("input[name='signup-username']").value;
        const signupPassword = signupForm.querySelector("input[name='signup-password']").value;

        // Save user data to localStorage
        localStorage.setItem("username", signupUsername);
        localStorage.setItem("password", signupPassword);

        alert("Signup successful! You can now log in.");
        signupForm.reset();
        switchToLoginForm();
    }

    // Function to handle login form submission
    function handleLoginFormSubmission(e) {
        e.preventDefault();
        const loginUsername = loginForm.querySelector("input[name='username']").value;
        const loginPassword = loginForm.querySelector("input[name='password']").value;

        // Retrieve user data from localStorage
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");

        // Check if the entered username and password match the stored data
        if (loginUsername === storedUsername && loginPassword === storedPassword) {
            alert("Login Successful!");
        } else {
            alert("Login failed. Please check your username and password.");
        }
        loginForm.reset();
    }

    // Event listeners
    switchToSignup.addEventListener("click", function (e) {
        e.preventDefault();
        switchToSignupForm();
    });

    switchToLogin.addEventListener("click", function (e) {
        e.preventDefault();
        switchToLoginForm();
    });

    signupForm.addEventListener("submit", handleSignupFormSubmission);
    loginForm.addEventListener("submit", handleLoginFormSubmission);

    // Check if the user is already logged in on page load
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
        switchToLoginForm();
    }
});
