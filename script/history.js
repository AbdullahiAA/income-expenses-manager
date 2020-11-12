redirectIfNotLoggedIn()
displayBalance()

var historyTbl = document.querySelector('#historyTable')
var transactions = getTransactions()


// Show History...
if (transactions.length == 0) {
    historyTbl.before('No history is recorded')
    historyTbl.remove()

    // Removing the clear history button
    document.querySelector('.panel__footer').remove()
} else {
    let tbody = historyTbl.children[1]
    
    transactions.forEach(transaction => {
        let tr = document.createElement('tr')
        
        let tdTime = document.createElement('td')
        let tdPurpose = document.createElement('td')
        let tdType = document.createElement('td')
        let tdAmount = document.createElement('td')

        tdTime.innerHTML = `${transaction.time.dayName}<br>${transaction.time.date}<br>${transaction.time.time}`
        tdPurpose.textContent = transaction.purpose
        tdType.textContent = transaction.type
        tdAmount.innerHTML = '&#8358; ' + transaction.amount

        tr.append(tdTime)
        tr.append(tdPurpose)
        tr.append(tdType)
        tr.append(tdAmount)

        tbody.append(tr)
    });
}


// Clear History...
document.querySelector('#clear-history').addEventListener('click', (e) => {
    e.preventDefault()

    let confirmClearing = confirm('Are you sure that you want to clear all the history record(s)?\n\nNOTE: The balance will be reset to ₦ 0');

    if (confirmClearing) {
        let transactions = []
        transactions = JSON.stringify(transactions)
        
        localStorage.setItem('transactions', transactions)
        localStorage.setItem('balance', 0)

        historyTbl.innerHTML = ('<p>... History Cleared ...</p>')

        displayBalance()

        // Removing the clear history button
        document.querySelector('.panel__footer').remove()

    }
})


// Functions...
function getTransactions() {
    let transactions = localStorage.getItem('transactions')

    if (transactions === null) {
        transactions = []
        transactions = JSON.stringify(transactions)
        localStorage.setItem('transactions', transactions)
    }

    return JSON.parse(transactions)
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

function redirectIfNotLoggedIn() {
    let loginStatus = localStorage.getItem('loggedIn')

    if (loginStatus == 'false') {
        document.location = 'index.html'
    }
}