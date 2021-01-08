redirectIfLoggedIn()

// Processing the demo login...
document.getElementById('demo-login').addEventListener('click', () => {
    logIn()
})

document.querySelector('#login-form').addEventListener('submit', (e) => {
    // Preventing the default submittion from the form...
    e.preventDefault()

    // Getting the logIn details from the client side...
    const username = document.querySelector('#username').value.trim()
    const password = document.querySelector('#password').value

    var error = ''

    if (username === '' && password === '') {
        error = 'Please input your login details'
    } else if (username === '' || password === '') {
        error = 'Both fields are required'
    } else if (username === 'admin' && password === 'tripleal2k') {
        // Process the logIn function...
        logIn()
    } else {
        error = 'Incorrect login details, please try again'
    }

    // Display the error to the user is there is any...
    if (error !== '') {
        showError(error)
    }
})

// Functions...
function showError(error) {
    let errMsgTag = document.querySelector('.error')
    
    if (errMsgTag === null) {
        errMsgTag = document.createElement('p')
        errMsgTag.className = 'error'
        
        let usernameTag = document.querySelector('#username')
        usernameTag.before(errMsgTag)
    }

    errMsgTag.textContent = error

    // Reset the password field...
    document.querySelector('#password').value = ''
}

function logIn() {
    localStorage.setItem('loggedIn', true)

    document.location = 'post-transaction.html'
}

function redirectIfLoggedIn() {
    let loginStatus = localStorage.getItem('loggedIn')

    if (loginStatus == 'true') {
        document.location = 'post-transaction.html'
    }
}