const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcuVBLNU3jFAOGgpfsRaZmx2qZgbO315UrCczuld2-OzF6rksnTKWDxuEY_8G4JD7IhQ/exec';  // Replace with actual URL

// Add Transaction
document.getElementById('transaction-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const transactionType = document.getElementById('transaction-type').value;
    const transactionSource = document.getElementById('transaction-source').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionReason = document.getElementById('transaction-reason').value;

    // Log payload to verify it's being built correctly
    console.log({
        action: 'addTransaction',
        transactionType,
        transactionSource,
        transactionAmount,
        transactionReason
    });

    // Make the POST request to add the transaction
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
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
    console.log('Loading transactions...');  // Debugging message

    fetch(`${GOOGLE_SCRIPT_URL}?action=getTodaysTransactions`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
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
    console.log('Loading balances...');  // Debugging message

    fetch(`${GOOGLE_SCRIPT_URL}?action=getBalances`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
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
    console.log('Loading daily values...');  // Debugging message

    fetch(`${GOOGLE_SCRIPT_URL}?action=getDailyValues`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(dailyValues => {
            document.getElementById('daily-expenses').textContent = dailyValues.dailyExpenses + ' AZN';
            document.getElementById('cash-in-hand').textContent = dailyValues.cashInHand + ' AZN';
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
