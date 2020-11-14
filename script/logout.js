document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault()

    localStorage.setItem('loggedIn', false)

    location.assign('index.html')
})