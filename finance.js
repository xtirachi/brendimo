const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhCBChw5NjGTruyOiNPdG1f4OTFYd08ufGY-Umgjb6FcsukcbGSZvpCHqz6n2mqg/exec';  // Replace with your Google Apps Script Web App URL

// Add a new transaction
function addTransaction() {
    const transactionData = {
        action: 'addTransaction',
        transactionType: document.getElementById('transactionType').value,
        transactionSource: document.getElementById('transactionSource').value,
        transactionAmount: document.getElementById('transactionAmount').value,
        transactionReason: document.getElementById('transactionReason').value
    };

    // Send POST request to Google Apps Script
    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'Transaction added successfully!') {
            alert('Əməliyyat uğurla əlavə olundu!');
            fetchFinancialData();  // Refresh the data after adding the transaction
        } else {
            alert('Əməliyyat əlavə olunmadı, xahiş edirik yenidən yoxlayın.');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Fetch today's financial data from Google Apps Script and update the UI
function fetchFinancialData() {
    // Send GET request to fetch financial data
    fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getFinancialData`)
    .then(response => response.json())
    .then(data => {
        // Handle the data returned from Google Apps Script
        updateTransactionTable(data.transactions);
        updateBalances(data.balances);
        updateDailyValues(data.dailyValues);
    })
    .catch(error => console.error('Error fetching financial data:', error));
}

// Update transaction table, balances, and daily values
// These functions update the UI with the fetched data
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

function updateBalances(balances) {
    document.getElementById('leoBankBalance').textContent = balances.leoBank;
    document.getElementById('kapitalBankBalance').textContent = balances.kapitalBank;
    document.getElementById('investmentFundBalance').textContent = balances.investmentFund;
    document.getElementById('qutuBalance').textContent = balances.qutu;
    document.getElementById('bazarBalance').textContent = balances.bazar;
}

function updateDailyValues(dailyValues) {
    document.getElementById('dailyExpenses').textContent = dailyValues.dailyExpenses;
    document.getElementById('cashInHand').textContent = dailyValues.cashInHand;
}

// Initialize the page by fetching today's financial data
window.onload = function() {
    fetchFinancialData();
};
