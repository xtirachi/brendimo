document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().split('T')[0];

    // Fetch financial data and display it
    fetch('https://script.google.com/macros/s/AKfycbwIg9zgb84eGcw70zusF1ULP2o3KA1jDkzhAwRK-PLc8z3SgZR_yNnYq0RP1lhyorE/exec?action=getFinancialData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('leoBankValue').innerText = data.leoBank + ' AZN';
            document.getElementById('kapitalBankValue').innerText = data.kapitalBank + ' AZN';
            document.getElementById('investmentFundValue').innerText = data.investmentFund + ' AZN';
            document.getElementById('qutuValue').innerText = data.qutu + ' AZN';
            document.getElementById('bazarValue').innerText = data.bazar + ' AZN';
            document.getElementById('digerXerclerValue').innerText = data.digerXercler + ' AZN';
            document.getElementById('eldekiPul').innerText = data.eldekiPul + ' AZN';
            document.getElementById('totalProfit').innerText = data.totalProfit + ' AZN';
        })
        .catch(error => console.error('Error fetching financial data:', error));

  document.getElementById('transactionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
    const source = document.getElementById('transactionSource').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const reason = document.getElementById('transactionReason').value;

    // Get the selected date range
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const transactionData = {
        type: transactionType,
        source: source,
        amount: amount,
        reason: reason,
        date: new Date().toISOString().split('T')[0],  // Current date
        startDate: startDate,
        endDate: endDate
    };

    // Send the transaction data to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbwIg9zgb84eGcw70zusF1ULP2o3KA1jDkzhAwRK-PLc8z3SgZR_yNnYq0RP1lhyorE/exec?action=addTransaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Transaction added successfully!');
            window.location.reload();  // Reload the page to update values
        } else {
            console.error('Error in transaction:', data);
        }
    })
    .catch(error => {
        console.error('Error adding transaction:', error);
    });
});

});
