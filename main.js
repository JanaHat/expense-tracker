const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const form = document.getElementById('form');
const list = document.getElementById('list');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const incomeD = document.getElementById('income');
const expenseD = document.getElementById('expense');

// const dummyTransactions = [
//     {id: 1, text: 'Flower', amount: -20},
//     {id: 2, text: 'Salary', amount: 300},
//     {id: 3, text: 'Book', amount: -10},
//     {id: 4, text: 'Camera', amount: 150},
// ];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if(text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateId(),
            date: date.value,
            text: text.value,
            amount: +amount.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
        date.value = '';
    }
}

// Generate random id
function generateId() {
    return Math.floor(Math.random() * 10000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.date} ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">-</button>
    `;

    list.appendChild(item);
}

// Remove transaction by id
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
    updateLocalStorage();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}




// Update the balance, income, expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    balance.innerText = `£${total}`;
    moneyPlus.innerText = `£${income}`;
    moneyMinus.innerText = `£${expense}`;
}



// Init app
function init () {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);
incomeD.addEventListener('click', showIncome);
expenseD.addEventListener('click', showExpense);