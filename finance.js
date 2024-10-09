document.getElementById('transactionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const transactionType = document.getElementById('transactionType').value;
    const transactionSource = document.getElementById('transactionSource').value;
    const transactionAmount = parseFloat(document.getElementById('transactionAmount').value);
    const transactionReason = document.getElementById('transactionReason').value;

    const transactionData = {
        action: 'addTransaction',
        transactionType,
        transactionSource,
        transactionAmount,
        transactionReason,
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxfHf2gITwXEscaJEzC0L35CcQ8tgeOVQDaW3wAN4-l2EViBG_ZqTC6vidaUEHHTw/exec', {
            method: 'POST',
            body: JSON.stringify(transactionData),
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        alert('Transaction added successfully');
        loadTodaysTransactions();
        loadBalances();
        loadDailyValues();
    } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Error adding transaction');
    }
});

async function loadTodaysTransactions() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxfHf2gITwXEscaJEzC0L35CcQ8tgeOVQDaW3wAN4-l2EViBG_ZqTC6vidaUEHHTw/exec?action=getTodaysTransactions');
    const transactions = await response.json();

    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = transactions.map(trx => `
        <tr>
            <td class="p-2">${trx.transactionDate}</td>
            <td class="p-2">${trx.transactionType}</td>
            <td class="p-2">${trx.transactionSource}</td>
            <td class="p-2">${trx.transactionAmount} AZN</td>
            <td class="p-2">${trx.transactionReason || ''}</td>
        </tr>
    `).join('');
}

async function loadBalances() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxfHf2gITwXEscaJEzC0L35CcQ8tgeOVQDaW3wAN4-l2EViBG_ZqTC6vidaUEHHTw/exec?action=getBankAndFundBalances');
    const balances = await response.json();

    const balancesList = document.getElementById('balancesList');
    balancesList.innerHTML = `
        <li>Leo Bank: ${balances.leoBankBalance} AZN</li>
        <li>Kapital Bank: ${balances.kapitalBankBalance} AZN</li>
        <li>Investment Fund: ${balances.investmentFundBalance} AZN</li>
        <li>Qutu: ${balances.qutuBalance} AZN</li>
        <li>Bazar: ${balances.bazarBalance} AZN</li>
    `;
}

async function loadDailyValues() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxfHf2gITwXEscaJEzC0L35CcQ8tgeOVQDaW3wAN4-l2EViBG_ZqTC6vidaUEHHTw/exec?action=getDailyValues');
    const values = await response.json();

    document.getElementById('dailyExpenses').innerText = `${values.dailyExpenses} AZN`;
    document.getElementById('cashInHand').innerText = `${values.cashInHand} AZN`;
}

// Adjust daily expenses
document.getElementById('adjustDailyExpensesForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const newDailyExpenses = parseFloat(document.getElementById('newDailyExpenses').value);

    const expensesData = {
        action: 'adjustDailyExpenses',
        newDailyExpenses: newDailyExpenses
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxfHf2gITwXEscaJEzC0L35CcQ8tgeOVQDaW3wAN4-l2EViBG_ZqTC6vidaUEHHTw/exec', {
            method: 'POST',
            body: JSON.stringify(expensesData),
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        alert(result.message);
        loadDailyValues();  // Reload daily values to reflect the changes
    } catch (error) {
        console.error('Error adjusting daily expenses:', error);
        alert('Error adjusting daily expenses');
    }
});

// Load data on page load
window.onload = function() {
    loadTodaysTransactions();
    loadBalances();
    loadDailyValues();
};
