const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQWelniJWR5w3uwe6opfOGdE5R2f7e9mt1QeBfmBRnWSfLC971PriuF-zZbOlLDqtdcw/exec';  // Replace with actual URL

// Add Transaction
document.getElementById('transaction-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const transactionType = document.getElementById('transaction-type').value;
    const transactionSource = document.getElementById('transaction-source').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionReason = document.getElementById('transaction-reason').value;


    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'addTransaction',
            transactionType,
            transactionSource,
            transactionAmount,
            transactionReason
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Əlavə olundu və balans dəyişildi');
            window.location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error adding transaction: ' + error.message);
    });
});

// Load Today's Transactions
function loadTransactions() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getTodaysTransactions`, { method: 'GET' })
        .then(response => response.json())
        .then(transactions => {
            const tbody = document.getElementById('transactions-body');
            tbody.innerHTML = '';
            transactions.forEach(function(transaction) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.transactionDate}</td>
                    <td>${transaction.transactionType}</td>
                    <td>${transaction.transactionSource}</td>
                    <td>${transaction.transactionAmount}</td>
                    <td>${transaction.transactionReason}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Error loading transactions: ' + error.message);
        });
}

// Load Balances
function loadBalances() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getBalances`, { method: 'GET' })
        .then(response => response.json())
        .then(balances => {
            const ul = document.getElementById('balances-list');
            ul.innerHTML = '';
            for (const [source, balance] of Object.entries(balances)) {
                const li = document.createElement('li');
                li.textContent = `${source}: ${balance} AZN`;
                ul.appendChild(li);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Error loading balances: ' + error.message);
        });
}

// Load Daily Values
function loadDailyValues() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getDailyValues`, { method: 'GET' })
        .then(response => response.json())
        .then(dailyValues => {
            document.getElementById('daily-sales').textContent = dailyValues.totalDailySales + ' AZN';
            document.getElementById('daily-profits').textContent = dailyValues.totalDailyProfits + ' AZN';
            document.getElementById('cash-in-hand').textContent = dailyValues.cashOnHand + ' AZN';
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Error loading daily values: ' + error.message);
        });
}

// Load data on page load
window.onload = function() {
    loadTransactions();
    loadBalances();
    loadDailyValues();
};
