// Initialize expenses array from local storage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let myChart = null;

// Function to add a new expense
function addExpense() {
  const amountInput = document.getElementById('amount');
  const descriptionInput = document.getElementById('description');
  const typeSelect = document.getElementById('type');

  const amount = parseFloat(amountInput.value);
  const description = descriptionInput.value;
  const type = typeSelect.value;

  if (isNaN(amount) || description.trim() === '') {
    alert('Please enter valid amount and description.');
    return;
  }

  const newExpense = {
    date: new Date().toLocaleDateString(),
    amount,
    description,
    type
  };

  expenses.push(newExpense);
  saveExpenses();
  clearInputs();
  renderTable();
  calculateBalance();
  renderChart();
}

// Function to save expenses to local storage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to clear input fields after adding an expense
function clearInputs() {
  document.getElementById('amount').value = '';
  document.getElementById('description').value = '';
}

// Function to render the expense table
function renderTable() {
  const tbody = document.getElementById('expenseBody');
  tbody.innerHTML = '';

  expenses.forEach((expense, index) => {
    const row = `<tr>
      <td>${expense.date}</td>
      <td>${expense.amount}</td>
      <td>${expense.description}</td>
      <td>${expense.type}</td>
      <td><button onclick="editExpense(${index})">Edit</button> <button onclick="deleteExpense(${index})">Delete</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Function to delete an expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderTable();
  calculateBalance();
  renderChart();
}

// Function to edit an expense
function editExpense(index) {
  const expense = expenses[index];
  const amountInput = document.getElementById('amount');
  const descriptionInput = document.getElementById('description');
  const typeSelect = document.getElementById('type');

  amountInput.value = expense.amount;
  descriptionInput.value = expense.description;
  typeSelect.value = expense.type;

  expenses.splice(index, 1);
  saveExpenses();
  renderTable();
  calculateBalance();
  renderChart();
}

// Function to calculate and display the current balance
function calculateBalance() {
  const totalIncome = expenses.reduce((acc, expense) => {
    return expense.type === 'Income' ? acc + expense.amount : acc;
  }, 0);
  const totalExpense = expenses.reduce((acc, expense) => {
    return expense.type === 'Expense' ? acc + expense.amount : acc;
  }, 0);
  const currentBalance = totalIncome - totalExpense;
  document.getElementById('currentBalance').textContent = `$${currentBalance.toFixed(2)}`;
}

// Function to render the pie chart
function renderChart() {
  const totalIncome = expenses.reduce((acc, expense) => {
    return expense.type === 'Income' ? acc + expense.amount : acc;
  }, 0);
  const totalExpense = expenses.reduce((acc, expense) => {
    return expense.type === 'Expense' ? acc + expense.amount : acc;
  }, 0);
  const currentBalance = totalIncome - totalExpense;

  const chartData = {
    labels: ['Current Balance', 'Total Expenses'],
    datasets: [{
      data: [currentBalance, totalExpense],
      backgroundColor: ['#007bff', '#dc3545'],
      hoverBackgroundColor: ['#0056b3', '#c82333']
    }]
  };

  const ctx = document.getElementById('pieChart').getContext('2d');

  // Destroy existing chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'pie',
    data: chartData
  });
}

// Initial rendering
renderTable();
calculateBalance();
renderChart();

