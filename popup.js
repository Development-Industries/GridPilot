// ============================
// Media Preview Handling
// ============================
let uploadedImage = null;
document.getElementById('mediaUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage = e.target.result;
            document.getElementById('previewImage').src = uploadedImage;
            document.getElementById('previewImage').style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('previewImage').style.display = 'none';
    }
});

// ============================
// Post Preview Functionality
// ============================
function previewPost() {
    const postContent = document.getElementById('postContent').value;

    // Validate that post content is present
    if (!postContent) {
        alert('Please write your post first!');
        return;
    }

    // Display post content in a modal or preview section
    document.getElementById('previewText').innerText = postContent;
    document.getElementById('previewModal').style.display = 'block'; // Assuming a modal exists
}

// Attach event listener to the preview button
document.getElementById('previewBtn').addEventListener('click', previewPost);

// ============================
// Post Scheduling Functionality
// ============================
function schedulePost() {
    const postContent = document.getElementById('postContent').value;
    const scheduleTime = document.getElementById('scheduleTime').value;

    // Validate that both post content and time are present
    if (!postContent || !scheduleTime) {
        alert('Please enter post content and select a schedule time.');
        return;
    }

    // Save scheduled post details in chrome storage (simulated)
    chrome.storage.sync.set({
        scheduledPost: { postContent, scheduleTime, media: uploadedImage }
    }, function () {
        alert('Post scheduled successfully.');
    });

    // Set up a Chrome alarm for the scheduled post time
    const postDate = new Date(scheduleTime);
    const timeUntilPost = (postDate.getTime() - Date.now()) / 60000; // Time in minutes
    chrome.alarms.create('postAlarm', { delayInMinutes: timeUntilPost });
}

// Attach event listener to the schedule button
document.getElementById('scheduleBtn').addEventListener('click', schedulePost);

// ============================
// Post Now Functionality
// ============================
function postNow() {
    const postContent = document.getElementById('postContent').value;

    // Validate post content
    if (!postContent) {
        alert('Please write your post first!');
        return;
    }

    // Simulate posting immediately (you would replace this with actual API calls)
    alert('Your post has been published!');
}

// Attach event listener to the post now button
document.getElementById('postNowBtn').addEventListener('click', postNow);

// ============================
// User Tagging Functionality
// ============================
const userList = ['@johndoe', '@janedoe', '@elonmusk']; // Example user list
const tagInput = document.getElementById('tagInput');
const suggestedTags = document.getElementById('suggestedTags');

// Handle user input and show suggested tags
tagInput.addEventListener('input', function () {
    const input = tagInput.value.toLowerCase();
    suggestedTags.innerHTML = ''; // Clear existing suggestions

    if (input) {
        // Filter users based on input
        const filteredUsers = userList.filter(user => user.toLowerCase().includes(input));

        // Display filtered users as suggestions
        filteredUsers.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            li.addEventListener('click', function () {
                tagInput.value = user; // Select the user on click
                suggestedTags.style.display = 'none'; // Hide suggestions
            });
            suggestedTags.appendChild(li);
        });

        suggestedTags.style.display = 'block'; // Show suggestions
    } else {
        suggestedTags.style.display = 'none'; // Hide if no input
    }
});

// ============================
// Facebook Login Popup
// ============================
document.getElementById('fbLoginButton').addEventListener('click', function () {
    chrome.identity.launchWebAuthFlow({
        url: 'https://www.facebook.com/v10.0/dialog/oauth?client_id=YOUR_FB_APP_ID&redirect_uri=https://[YOUR_EXTENSION_ID].chromiumapp.org/&response_type=token&scope=email,public_profile',
        interactive: true
    }, function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
            alert('Facebook login failed');
        } else {
            const accessToken = new URL(redirectUrl).hash.split('&')[0].split('=')[1];
            chrome.storage.sync.set({ facebookAccessToken: accessToken }, function () {
                alert('Logged in to Facebook');
            });
        }
    });
});

// ============================
// Twitter Login Popup
// ============================
document.getElementById('twitterLoginButton').addEventListener('click', function () {
    chrome.identity.launchWebAuthFlow({
        url: 'https://api.twitter.com/oauth/authenticate?oauth_token=YOUR_TWITTER_OAUTH_TOKEN',
        interactive: true
    }, function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
            alert('Twitter login failed');
        } else {
            const oauthVerifier = new URL(redirectUrl).searchParams.get('oauth_verifier');
            fetchTwitterAccessToken(oauthVerifier);
        }
    });
});

// ============================
// Instagram Login Popup
// ============================
document.getElementById('instaLoginButton').addEventListener('click', function () {
    chrome.identity.launchWebAuthFlow({
        url: 'https://api.instagram.com/oauth/authorize?client_id=YOUR_INSTAGRAM_APP_ID&redirect_uri=https://[YOUR_EXTENSION_ID].chromiumapp.org/&response_type=token&scope=user_profile,user_media',
        interactive: true
    }, function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
            alert('Instagram login failed');
        } else {
            const accessToken = new URL(redirectUrl).hash.split('&')[0].split('=')[1];
            chrome.storage.sync.set({ instagramAccessToken: accessToken }, function () {
                alert('Logged in to Instagram');
            });
        }
    });
});

// ============================
// Navigation to Other Pages
// ============================

// Navigate to login.html
document.getElementById('loginGridPilotBtn').addEventListener('click', function () {
    window.location.href = chrome.runtime.getURL('login.html');
});

// Navigate to terms.html (Terms and Conditions)
document.getElementById('termsBtn').addEventListener('click', function () {
    window.location.href = chrome.runtime.getURL('terms.html');
});

// Navigate to info.html (Other Apps Page)
document.getElementById('otherAppsBtn').addEventListener('click', function () {
    window.location.href = chrome.runtime.getURL('info.html');
});
