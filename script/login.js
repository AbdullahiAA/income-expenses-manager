redirectIfLoggedIn()

document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const username = document.querySelector('#username').value.trim()
    const password = document.querySelector('#password').value

    var error = ''

    if (username === '' && password === '') {
        error = 'Please input your login details'
    } else if (username === '' || password === '') {
        error = 'Please fill both fields'
    } else if (username === 'admin' && password === 'tripleal2k') {
        logIn()
    } else {
        error = 'Incorrect login details'
    }

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