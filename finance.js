// Constants
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzBYjsU_4Xy-IpCTNRQ0J6qaV1tEh9ruGJJQ0ULtl-X_uTCeqNCLx1OsVlbiv0mgMHsNQ/exec'; // Replace with actual Google Apps Script URL

// Helper: Get formatted date (yyyy-mm-dd)
function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Set default date in date picker
document.getElementById('transaction-date').value = getFormattedToday();

// Load data based on selected date
document.getElementById('load-date-data').addEventListener('click', () => {
    const selectedDate = document.getElementById('transaction-date').value;
    loadTransactions(selectedDate);
    loadDailyValues(selectedDate);
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
                li.textContent = `${source}: ${balance} AZN`;
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
            document.getElementById('daily-sales').textContent = `${data.dailySales} AZN`;
            document.getElementById('daily-profits').textContent = `${data.dailyProfit} AZN`;
            document.getElementById('cash-in-hand').textContent = `${data.cashOnHand} AZN`;
        })
        .catch(error => console.error('Error loading daily values:', error));
}

// Post new transaction to Google Apps Script
function postTransaction({ transactionType, transactionSource, transactionAmount, transactionReason }) {
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
            alert('Tranzaksiya uğurla əlavə edildi.');
            loadTransactions(getFormattedToday()); // Reload transactions for today
            loadBalances(); // Reload balances
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => console.error('Error posting transaction:', error));
}

// Load today's data on page load
window.onload = () => {
    const today = getFormattedToday();
    loadTransactions(today);  // Load transactions for today
    loadBalances();           // Load balances on page load
    loadDailyValues(today);    // Load daily values for today
};
