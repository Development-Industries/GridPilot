// Handle navigation to Terms and Conditions page
document.getElementById('termsLink').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = chrome.runtime.getURL('terms.html');
});

// Handle back button to return to popup.html
document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = chrome.runtime.getURL('popup.html');
});

 