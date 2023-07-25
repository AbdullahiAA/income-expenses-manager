redirectIfNotLoggedIn();
displayBalance();
displayTodaysTransactions();

document.querySelector("#post-trans-form").addEventListener("submit", (e) => {
  e.preventDefault();

  var amount = document.querySelector("#amount").value;
  var type = document.querySelector("#type").value;
  var purpose = document.querySelector("#purpose").value.trim();
  var balance = getBalance();
  var error = "";

  if (amount === "" || type === "" || purpose === "") {
    error = "All fields are required";
  } else if (type === "Db" && amount > balance) {
    error = "Transaction failed. Insufficient fund";
  } else {
    postTheTransaction(amount, type, purpose);
  }

  if (error !== "") {
    showError(error);
  }
});

// Functions...
function showError(error) {
  removePrevMsgTag(".success");

  let msgTag = document.querySelector(".error");

  if (msgTag === null) {
    msgTag = document.createElement("p");
    msgTag.className = "error";

    let amountTag = document.querySelector("#amount");
    amountTag.before(msgTag);
  }

  msgTag.textContent = error;
}

function showSuccessMsg() {
  removePrevMsgTag(".error");

  let msgTag = document.querySelector(".success");

  if (msgTag === null) {
    msgTag = document.createElement("p");
    msgTag.className = "success";

    let amountTag = document.querySelector("#amount");
    amountTag.before(msgTag);
  }

  msgTag.textContent = "Transaction recorded successfully";
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

function getTransactions() {
  let transactions = localStorage.getItem("transactions");

  if (transactions === null) {
    transactions = [];
    transactions = JSON.stringify(transactions);
    localStorage.setItem("transactions", transactions);
  }

  return JSON.parse(transactions);
}

function displayTodaysTransactions() {
  var historyTbl = document.querySelector("#historyTable");
  var transactions = getTransactions();
  const today = getTime();

  const todaysTransactions = transactions.filter(
    (transaction) => transaction.time.date === today.date
  );

  // Show History...
  if (todaysTransactions.length == 0) {
    // Hide the transaction table if there are no recent transactions
    historyTbl.style.display = "none";

    // Show no transaction message
    let noTransTag = document.createElement("p");
    noTransTag.className = "noTransTag";
    noTransTag.textContent = "No transaction yet";
    historyTbl.before(noTransTag);
  } else {
    // Hide no transaction message
    let noTransTag = document.querySelector(".noTransTag");
    if (noTransTag !== null) noTransTag.remove();

    // Show transaction table
    historyTbl.style.display = "table";

    // Build the table
    let tbody = historyTbl.children[1];

    tbody.innerHTML = null;

    todaysTransactions.forEach((transaction) => {
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

      // Styling the debit and the credit records
      tdType.classList.add(transaction.type === "Cr" ? "credit" : "debit");
      tdAmount.classList.add(transaction.type === "Cr" ? "credit" : "debit");

      tr.append(tdTime);
      tr.append(tdPurpose);
      tr.append(tdType);
      tr.append(tdAmount);

      tbody.append(tr);
    });
  }
}

function postTheTransaction(amount, type, purpose) {
  let balance = getBalance();
  let transactions = getTransactions();

  let newTransaction = {
    id: Date.now(),
    time: getTime(),
    amount: amount,
    type: type,
    purpose: purpose,
  };

  transactions.unshift(newTransaction);

  // Save transactions to the localStorage...
  transactions = JSON.stringify(transactions);
  localStorage.setItem("transactions", transactions);

  // Update the total balance...
  if (type === "Cr") {
    balance += Number(amount);
  } else {
    balance -= Number(amount);
  }

  // Save balance to the localStorage...
  localStorage.setItem("balance", balance);
  displayBalance();
  displayTodaysTransactions();

  showSuccessMsg();
  clearFormFields();
}

function removePrevMsgTag(ClassName) {
  let theTag = document.querySelector(ClassName);
  if (theTag !== null) theTag.remove();
}

function clearFormFields() {
  document.querySelector("#amount").value = "";
  document.querySelector("#type").value = "";
  document.querySelector("#purpose").value = "";
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
