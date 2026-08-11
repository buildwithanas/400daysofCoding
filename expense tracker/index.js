// Get DOM elements
const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

// Load transactions from localStorage or start with empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Generate a unique ID for each transaction
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Format number as currency
function formatCurrency(amount) {
  return '$' + Math.abs(amount).toFixed(2);
}

// Update the balance, income, and expense totals
function updateSummary() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0);

  balanceEl.textContent = '$' + total.toFixed(2);
  balanceEl.style.color = total < 0 ? '#e53e3e' : '#1a202c';

  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expense);
}

// Create a single transaction list item
function createTransactionEl(transaction) {
  const li = document.createElement('li');
  const isIncome = transaction.amount > 0;

  li.classList.add('transaction', isIncome ? 'income' : 'expenses');
  li.setAttribute('data-id', transaction.id);

  li.innerHTML = `
    <span class="transaction-desc">${transaction.description}</span>
    <span class="transaction-amount">${isIncome ? '+' : '-'}${formatCurrency(transaction.amount)}</span>
    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">&#x2715;</button>
  `;

  return li;
}

// Render all transactions to the list
function renderTransactions() {
  transactionList.innerHTML = '';

  if (transactions.length === 0) {
    transactionList.innerHTML = '<li style="text-align:center; color:#a0aec0; padding: 2rem 0;">No transactions yet.</li>';
    return;
  }

  // Show newest first
  [...transactions].reverse().forEach(t => {
    transactionList.appendChild(createTransactionEl(t));
  });
}

// Save transactions to localStorage
function saveToStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description || isNaN(amount) || amount === 0) {
    alert('Please enter a valid description and a non-zero amount.');
    return;
  }

  const transaction = {
    id: generateID(),
    description,
    amount
  };

  transactions.push(transaction);
  saveToStorage();
  renderTransactions();
  updateSummary();

  // Reset form
  descriptionInput.value = '';
  amountInput.value = '';
  descriptionInput.focus();
}

// Delete a transaction by ID
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToStorage();
  renderTransactions();
  updateSummary();
}

// Event listener for form submission
form.addEventListener('submit', addTransaction);

// Initial render on page load
renderTransactions();
updateSummary();