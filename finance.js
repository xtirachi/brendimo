const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyolVl3sprXlKJ4NEmG7CK5RBnVal-_udd6bdVtlG-qTezfJlKOhbYJ0wcjMg1sZrgivg/exec';  // Replace with your Google Apps Script URL

// Add Transaction
document.getElementById('transaction-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const transactionType = document.getElementById('transaction-type').value;
    const transactionSource = document.getElementById('transaction-source').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionReason = document.getElementById('transaction-reason').value;

      // Logging the request payload to verify correctness
    console.log({
        action: 'addTransaction',
        transactionType,
        transactionSource,
        transactionAmount,
        transactionReason
    });


    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
            action: 'addTransaction',
            transactionType,
            transactionSource,
            transactionAmount,
            transactionReason
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Transaction added successfully!');
            loadTransactions();
            loadBalances();
            loadDailyValues();
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
    fetch(`${GOOGLE_SCRIPT_URL}?action=getTodaysTransactions`)
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
    .catch(error => console.error('Error:', error));
}

// Load Balances
function loadBalances() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getBalances`)
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
    .catch(error => console.error('Error:', error));
}

// Load Daily Values
function loadDailyValues() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getDailyValues`)
    .then(response => response.json())
    .then(dailyValues => {
        document.getElementById('daily-expenses').textContent = dailyValues.dailyExpenses + ' AZN';
        document.getElementById('cash-in-hand').textContent = dailyValues.cashInHand + ' AZN';
    })
    .catch(error => console.error('Error:', error));
}

// Load data on page load
window.onload = function() {
    loadTransactions();
    loadBalances();
    loadDailyValues();
};
