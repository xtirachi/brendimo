const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6sVT4FRip05kZDULV6tIPeo2pf5w-WdVZ38oY5ec03TboRtntzcSWoLmOawsWhwfSBw/exec';  // Replace with actual URL

// Helper function to get the formatted date (yyyy-mm-dd)
function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Set the default value of the date picker to today
document.getElementById('transaction-date').value = getFormattedToday();

// Event listener for the "Göstər" button to load data based on selected date
document.getElementById('load-date-data').addEventListener('click', function() {
    const selectedDate = document.getElementById('transaction-date').value;
    loadTransactions(selectedDate);  // Load transactions for the selected date
    loadDailyValues(selectedDate);   // Load daily values for the selected date
});

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
            alert('Tranzaksiya uğurla əlavə edildi və balans dəyişildi.');
            loadTransactions(getFormattedToday());  // Reload today's transactions after adding a new one
            loadBalances(); // Reload balances after adding a new transaction
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Tranzaksiyanı əlavə etməkdə problem: ' + error.message);
    });
});

// Load Transactions for the selected date
function loadTransactions(date) {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getTransactionsByDate&date=${date}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(transactions => {
        const tbody = document.getElementById('transactions-body');
        tbody.innerHTML = ''; // Clear existing transactions
        transactions.forEach(function(transaction) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.transactionDate}</td>
                <td>${transaction.transactionType}</td>
                <td>${transaction.transactionSource}</td>
                <td>${transaction.transactionAmount}</td>
                <td>${transaction.transactionReason}</td>
            `;
            tbody.appendChild(row); // Add transaction row to the table
        });
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Əməliyyatları yükləməkdə xəta: ' + error.message);
    });
}


// Load Balances
function loadBalances() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getBalances`, { method: 'GET' })
        .then(response => response.json())
        .then(balances => {
            const ul = document.getElementById('balances-list');
            ul.innerHTML = '';  // Clear existing balances
            // Loop through each balance and display it
            for (const [source, balance] of Object.entries(balances)) {
                const li = document.createElement('li');
                li.textContent = `${source}: ${balance} AZN`;
                ul.appendChild(li);  // Add balance to the list
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Balansları yükləməkdə xəta: ' + error.message);
        });
}

// Load Daily Values (Sales, Profits, Cash on Hand) for the selected date
function loadDailyValues(date) {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getDailyValues&date=${date}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            // Log the response data for debugging
            console.log('Daily values:', data);
            
            // Update the HTML elements with the fetched data
            document.getElementById('daily-sales').textContent = data.dailySales + ' AZN'; // Total daily sales
            document.getElementById('daily-profits').textContent = data.dailyProfit + ' AZN'; // Total daily profits
            document.getElementById('cash-in-hand').textContent = data.cashOnHand + ' AZN'; // Cash on hand
        })
        .catch(error => {
            console.error('Error fetching daily values:', error);
            alert('Günlük dəyərləri yükləməkdə xəta: ' + error.message);
        });
}

// Load data on page load (default to today's data)
window.onload = function() {
    const today = getFormattedToday();
    loadTransactions(today);  // Load today's transactions
    loadBalances();           // Load balances on page load
    loadDailyValues(today);   // Load today's daily values
};
