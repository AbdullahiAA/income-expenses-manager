redirectIfNotLoggedIn();
displayBalance();

var historyTbl = document.querySelector("#historyTable");
var transactions = getTransactions();

// Show History...
if (transactions.length == 0) {
  historyTbl.before("No history is recorded");
  historyTbl.remove();

  // Removing the panel footer that contains the "Clear history" button...
  document.querySelector(".panel__footer").remove();
} else {
  let tbody = historyTbl.children[1];

  transactions.forEach((transaction) => {
    let tr = document.createElement("tr");

    let tdTime = document.createElement("td");
    let tdPurpose = document.createElement("td");
    let tdType = document.createElement("td");
    let tdAmount = document.createElement("td");

    tdTime.innerHTML = `${transaction.time.dayName}<br>${transaction.time.date}<br>${transaction.time.time}`;
    tdPurpose.textContent = transaction.purpose;
    tdType.textContent = transaction.type;
    tdAmount.innerHTML = `${transaction.type === "Cr" ? "+" : "-"}&#8358;${
      transaction.amount
    }`;

    // Styling the debit from credit
    tdType.classList.add(transaction.type === "Cr" ? "credit" : "debit");
    tdAmount.classList.add(transaction.type === "Cr" ? "credit" : "debit");

    tr.append(tdTime);
    tr.append(tdPurpose);
    tr.append(tdType);
    tr.append(tdAmount);

    tbody.append(tr);
  });
}

// Clear History...
document.querySelector("#clear-history").addEventListener("click", (e) => {
  e.preventDefault();

  let confirmClearing = confirm(
    "\nAre you sure that you want to clear all the history record(s)?\n\nNOTE: The balance will be reset to ₦ 0"
  );

  if (confirmClearing) {
    let transactions = [];
    transactions = JSON.stringify(transactions);

    localStorage.setItem("transactions", transactions);
    localStorage.setItem("balance", 0);

    historyTbl.innerHTML = "<p>... History Cleared ...</p>";

    displayBalance();

    // Removing the clear history button...
    document.querySelector(".panel__footer").remove();
  }
});

// Functions...
function getTransactions() {
  let transactions = localStorage.getItem("transactions");

  if (transactions === null) {
    transactions = [];
    transactions = JSON.stringify(transactions);
    localStorage.setItem("transactions", transactions);
  }

  return JSON.parse(transactions);
}

function getBalance() {
  let balance = localStorage.getItem("balance");

  if (balance === null) {
    balance = 0;
    localStorage.setItem("balance", balance);
  }

  return Number(balance);
}

function getTotalInflow() {
  let transactions = getTransactions();
  let inflow = 0;

  if (transactions.length > 0) {
    inflow = transactions
      .filter((transaction) => transaction.type === "Cr")
      .reduce((acc, item) => Number(acc) + Number(item.amount), 0);
  }

  return Number(inflow);
}

function getTotalOutflow() {
  let transactions = getTransactions();
  let outflow = 0;

  if (transactions.length > 0) {
    outflow = transactions
      .filter((transaction) => transaction.type === "Db")
      .reduce((acc, item) => Number(acc) + Number(item.amount), 0);
  }

  return Number(outflow);
}

function getTotalSpentToday() {
  let transactions = getTransactions();
  const today = getTime();
  let total = 0;

  if (transactions.length > 0) {
    total = transactions
      .filter(
        (transaction) =>
          transaction.type === "Db" && transaction.time.date === today.date
      )
      .reduce((acc, item) => Number(acc) + Number(item.amount), 0);
  }

  return Number(total);
}

function displayBalance() {
  let balanceTag = document.querySelector(".balance span");
  let inflowTag = document.querySelector(".inflow span");
  let outflowTag = document.querySelector(".outflow span");
  let spentTodayTag = document.querySelector(".today span");

  balanceTag.textContent = getBalance();
  inflowTag.textContent = getTotalInflow();
  outflowTag.textContent = getTotalOutflow();
  spentTodayTag.textContent = getTotalSpentToday();
}

function redirectIfNotLoggedIn() {
  let loginStatus = localStorage.getItem("loggedIn");

  if (loginStatus == "false") {
    document.location = "index.html";
  }
}

function getTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  let date = new Date();

  let dayName = days[date.getDay()];

  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  let hour = date.getHours();
  let __hour = hour;
  if (hour > 12) {
    __hour = hour - 12;
  }

  let minute = date.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }

  let meridian = "am";
  if (hour >= 12) {
    meridian = "pm";
  }

  return {
    dayName: dayName,
    date: `${day}-${month}-${year}`,
    time: `${__hour}:${minute}${meridian}`,
  };
}
