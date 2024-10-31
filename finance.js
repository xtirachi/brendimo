// Constants
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyqtwxhaQW4fErEJ_-s2zGBc3bTlKV_Wxkt23KqDW_Kdbq7VljEq96CNVDPIYf4QTEPA/exec'; // Replace with actual Google Apps Script URL

// Helper to set today's date as default for date picker
function setTodayAsDefaultDate() {
    const dateInput = document.getElementById('transaction-date');
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    dateInput.value = today;
}

// Load totals for today's date by default on page load
document.addEventListener('DOMContentLoaded', () => {
    setTodayAsDefaultDate();
    const today = document.getElementById('transaction-date').value;
    loadTransactions(today);
    loadBalances();
    loadDailyValues(today);
    updateTotals(today);

    // Re-fetch and update totals when date changes
    document.getElementById('load-date-data').addEventListener('click', () => {
        const selectedDate = document.getElementById('transaction-date').value;
        loadTransactions(selectedDate);
        loadBalances();
        loadDailyValues(selectedDate);
        updateTotals(selectedDate);
    });

    // Form submission for new transactions
    document.getElementById('transaction-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const transactionType = document.getElementById('transaction-type').value;
        const transactionSource = document.getElementById('transaction-source').value;
        const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
        const transactionReason = document.getElementById('transaction-reason').value;

        postTransaction({ transactionType, transactionSource, transactionAmount, transactionReason });
    });

    // Preset frequent transaction buttons
    document.querySelectorAll('button[data-amount]').forEach(button => {
        button.addEventListener('click', () => {
            const transactionType = 'Deposit';
            const transactionSource = button.getAttribute('data-source');
            const transactionAmount = parseFloat(button.getAttribute('data-amount'));
            const transactionReason = button.getAttribute('data-reason');

            postTransaction({ transactionType, transactionSource, transactionAmount, transactionReason });
        });
    });

    // Custom transaction options for Günlük Alış and Günlük Satış
    document.getElementById('daily-purchase').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('purchase-amount').value);
        const reasonSelect = document.getElementById('purchase-reason');
        const reason = reasonSelect.value === 'others' ? document.getElementById('purchase-reason-other').value : reasonSelect.value;

        postTransaction({ transactionType: 'Withdrawal', transactionSource: 'Anbar Maya', transactionAmount: amount, transactionReason: reason });
    });

    document.getElementById('daily-sale').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('sale-amount').value);
        const reasonSelect = document.getElementById('sale-reason');
        const reason = reasonSelect.value === 'others' ? document.getElementById('sale-reason-other').value : reasonSelect.value;

        postTransaction({ transactionType: 'Deposit', transactionSource: 'Anbar Maya', transactionAmount: amount, transactionReason: reason });
    });

    // Custom transaction for Fond Gəlirləri
    document.getElementById('fond-income').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('fond-income-amount').value);
        const reason = document.getElementById('fond-income-reason').value;

        postTransaction({ transactionType: 'Deposit', transactionSource: 'Fond Gəlirləri', transactionAmount: amount, transactionReason: reason });
    });

    // Show/hide custom reason input for "others" options
    document.querySelectorAll('select[id$="reason"]').forEach(select => {
        select.addEventListener('change', (event) => {
            const otherInput = document.getElementById(`${event.target.id}-other`);
            otherInput.style.display = event.target.value === 'others' ? 'block' : 'none';
        });
    });
});

// Fetch and display transactions by date
function loadTransactions(date) {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getTransactionsByDate&date=${date}`)
        .then(response => response.json())
        .then(transactions => {
            const tbody = document.getElementById('transactions-body');
            tbody.innerHTML = ''; // Clear previous transactions
            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.transactionDate}</td>
                    <td>${transaction.transactionType}</td>
                    <td>${transaction.transactionSource}</td>
                    <td>${transaction.transactionAmount} AZN</td>
                    <td>${transaction.transactionReason}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading transactions:', error));
}

// Fetch and display balances
function loadBalances() {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getBalances`)
        .then(response => response.json())
        .then(balances => {
            const ul = document.getElementById('balances-list');
            ul.innerHTML = ''; // Clear previous balances
            Object.entries(balances).forEach(([source, balance]) => {
                const li = document.createElement('li');
                li.textContent = `${source}: ${balance.toFixed(2)} AZN`;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading balances:', error));
}

// Fetch and display daily values (sales, profits, cash on hand)
function loadDailyValues(date) {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getDailyValues&date=${date}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('daily-sales').textContent = `${data.dailySales.toFixed(2)} AZN`;
            document.getElementById('daily-profits').textContent = `${data.dailyProfit.toFixed(2)} AZN`;
            document.getElementById('cash-in-hand').textContent = `${data.cashOnHand.toFixed(2)} AZN`;
        })
        .catch(error => console.error('Error loading daily values:', error));
}

function postTransaction({ transactionType, transactionSource, transactionAmount, transactionReason }) {
    console.log('postTransaction called:', { transactionType, transactionSource, transactionAmount, transactionReason });

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
    .then(response => {
        console.log('Response received:', response);
        return response.json();
    })
    .then(data => {
        console.log('Parsed response data:', data);
        if (data.status === 'success') {
            alert('Tranzaksiya uğurla əlavə edildi.');
            const today = getFormattedToday();
            loadTransactions(today); // Reload transactions for today
            loadBalances(); // Reload balances
            loadDailyValues(today); // Reload daily values
            updateTotals(today); // Update totals after transaction
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error posting transaction:', error);
        alert('Error posting transaction: ' + error.message);
    });
}


// Update total daily purchase, sales, and fund income by fetching from Google Apps Script
function updateTotals(date) {
    fetch(`${GOOGLE_SCRIPT_URL}?action=getDailyTotalsBySource&date=${date}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-daily-purchase').textContent = `${data.totals.totalDailyPurchase.toFixed(2)} AZN`;
            document.getElementById('total-daily-sales').textContent = `${data.totals.totalDailySales.toFixed(2)} AZN`;
            document.getElementById('total-fund-income').textContent = `${data.totals.totalFundIncome.toFixed(2)} AZN`;
        })
        .catch(error => console.error('Error fetching totals:', error));
}

// Helper: Get formatted date (yyyy-mm-dd)
function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Load data on page load (default to today's data)
window.onload = function() {
    const today = getFormattedToday();
    loadTransactions(today);  // Load today's transactions
    loadBalances();           // Load balances on page load
    loadDailyValues(today);   // Load today's daily values
};
