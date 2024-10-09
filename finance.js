// Fetch today's financial data from Google Apps Script and update the UI
function fetchFinancialData() {
    // Call the Google Apps Script function
    google.script.run.withSuccessHandler(function(data) {
        // Handle the data returned from Google Apps Script
        updateTransactionTable(data.transactions);
        updateBalances(data.balances);
        updateDailyValues(data.dailyValues);
    }).getFinancialData();  // Calls the backend `getFinancialData` function
}

// Update the transactions table with today's data
function updateTransactionTable(transactions) {
    const tableBody = document.getElementById('todaysTransactionsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';  // Clear existing rows

    transactions.forEach(transaction => {
        const newRow = tableBody.insertRow();
        transaction.forEach(data => {
            const newCell = newRow.insertCell();
            newCell.textContent = data;
        });
    });
}

// Update the bank and fund balances
function updateBalances(balances) {
    document.getElementById('leoBankBalance').textContent = balances.leoBank;
    document.getElementById('kapitalBankBalance').textContent = balances.kapitalBank;
    document.getElementById('investmentFundBalance').textContent = balances.investmentFund;
    document.getElementById('qutuBalance').textContent = balances.qutu;
    document.getElementById('bazarBalance').textContent = balances.bazar;
}

// Update the daily values like expenses and cash in hand
function updateDailyValues(dailyValues) {
    document.getElementById('dailyExpenses').textContent = dailyValues.dailyExpenses;
    document.getElementById('cashInHand').textContent = dailyValues.cashInHand;
}

// Add a new transaction by calling Google Apps Script's addTransaction function
function addTransaction() {
    const transactionData = {
        transactionType: document.getElementById('transactionType').value,
        transactionSource: document.getElementById('transactionSource').value,
        transactionAmount: document.getElementById('transactionAmount').value,
        transactionReason: document.getElementById('transactionReason').value
    };

    google.script.run.withSuccessHandler(function() {
        alert('Əməliyyat uğurla əlavə olundu!');  // Transaction added successfully
        fetchFinancialData();  // Refresh the data after adding the transaction
    }).addTransaction(transactionData);  // Calls the backend `addTransaction` function
}

// Initialize the page by fetching today's financial data
window.onload = function() {
    fetchFinancialData();
};
