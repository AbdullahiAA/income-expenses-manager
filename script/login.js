redirectIfLoggedIn()


document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()

    var username = document.querySelector('#username').value.trim()
    var password = document.querySelector('#password').value

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

    showError(error)
})

function showError(error) {
    if (error !== '') {
        var errMsgTag = document.querySelector('.error')
        
        if (errMsgTag === null) {
            var usernameTag = document.querySelector('#username')
            var errMsgTag = document.createElement('p')

            errMsgTag.className = 'error'
            usernameTag.before(errMsgTag)
        }

        errMsgTag.textContent = error
    }

    document.querySelector('#password').value = ''
}

function logIn() {
    localStorage.setItem('loggedIn', true)

    document.querySelector('#username').value = ''

    document.location = 'post-transaction.html'

}

function redirectIfLoggedIn() {
    let loginStatus = localStorage.getItem('loggedIn')

    if (loginStatus == 'true') {
        document.location = 'post-transaction.html'
    }
}