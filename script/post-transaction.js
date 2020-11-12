redirectIfNotLoggedIn()
displayBalance()


document.querySelector('#post-trans-form').addEventListener('submit', (e) => {
    e.preventDefault()

    var amount = document.querySelector('#amount').value
    var type = document.querySelector('#type').value
    var purpose = document.querySelector('#purpose').value.trim()
    var balance = getBalance()
    var error = ''

    if (amount === '' || type === '' || purpose === '') {
        error = 'All fields are required'
    } else if (type === 'Db' && amount > balance) {
        error = 'Transaction denied. Amount is greater than your current balance'
    }
    else {
        postTheTransaction(amount, type, purpose)
    }

    if (error !== '') {
        showError(error)
    }
})

function showError(error) {
    removePrevMsgTag('.success')

    var msgTag = document.querySelector('.error')
    
    if (msgTag === null) {
        var amountTag = document.querySelector('#amount')
        var msgTag = document.createElement('p')

        msgTag.className = 'error'
        amountTag.before(msgTag)
    }

    msgTag.textContent = error
}

function showSuccessMsg() {
    removePrevMsgTag('.error')

    let msgTag = document.querySelector('.success')
    
    if (msgTag === null) {
        msgTag = document.createElement('p')
        msgTag.className = 'success'
    }
    
    let amountTag = document.querySelector('#amount')
    amountTag.before(msgTag)

    msgTag.textContent = 'Transaction posted successfully.'
}

function removePrevMsgTag(ClassName) {
    let theTag = document.querySelector(ClassName)
    if (theTag !== null) {
        theTag.remove()
    }
}

function getBalance() {
    let balance = localStorage.getItem('balance')

    if (balance === null) {
        balance = 0
        localStorage.setItem('balance', balance)
    }

    return Number(balance)
}

function displayBalance() {
    let balanceTag = document.querySelector('.balance span')

    balanceTag.textContent = getBalance()
}

function getTransactions() {
    let transactions = localStorage.getItem('transactions')

    if (transactions === null) {
        transactions = []
        transactions = JSON.stringify(transactions)
        localStorage.setItem('transactions', transactions)
    }

    return JSON.parse(transactions)
}

function postTheTransaction(amount, type, purpose) {
    let balance = getBalance()
    let transactions = getTransactions()

    let newTransaction = {
        id: Date.now(),
        time: getTime(),
        amount: amount,
        type: type,
        purpose: purpose
    }

    transactions.unshift(newTransaction)

    transactions = JSON.stringify(transactions)
    localStorage.setItem('transactions', transactions)

    if (type === 'Cr') {
        balance += Number(amount)
    } else {
        balance -= Number(amount)
    }

    localStorage.setItem('balance', balance)
    displayBalance()

    showSuccessMsg()
    clearFormFields()
}

function clearFormFields() {
    document.querySelector('#amount').value = ''
    document.querySelector('#type').value = ''
    document.querySelector('#purpose').value = ''
}

function redirectIfNotLoggedIn() {
    let loginStatus = localStorage.getItem('loggedIn')

    if (loginStatus == 'false') {
        document.location = 'index.html'
    }
}

function getTime() {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    let date = new Date()

    let dayName = days[date.getDay()]

    let day = date.getDate()
    let month = months[date.getMonth()]
    let year = date.getFullYear()

    
    let hour = date.getHours()
    var __hour = hour
    if (hour > 12) {__hour = hour - 12}
    
    let minute = date.getMinutes()
    if (minute < 10) {minute = '0' + minute}
    
    let meridian = 'am'
    if (hour >= 12) {meridian = 'pm'}

    return {
        dayName: dayName,
        date: `${day}-${month}-${year}`,
        time: `${__hour}:${minute}${meridian}`
    }
}