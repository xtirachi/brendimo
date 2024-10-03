document.addEventListener('DOMContentLoaded', function () {
    // Fetch financial data and display it
    fetch('https://script.google.com/macros/s/AKfycbyH2oTxrFVLLDrRQY0iBIyBRjwQSSEzy5sY0227koNo-eav4YJrOWS7K6fsIES-3iA/exec?action=getFinancialData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('leoBankValue').innerText = data.leoBank + ' AZN';
            document.getElementById('kapitalBankValue').innerText = data.kapitalBank + ' AZN';
            document.getElementById('investmentFundValue').innerText = data.investmentFund + ' AZN';
            document.getElementById('totalStockValue').innerText = data.totalStockValue + ' AZN';
            document.getElementById('eldekiPul').innerText = data.eldekiPul + ' AZN';
        })
        .catch(error => console.error('Error fetching financial data:', error));

    // Handle Deposit and Withdrawal Form Submission
    document.getElementById('transactionForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
        const source = document.getElementById('transactionSource').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const reason = document.getElementById('transactionReason').value;

        const transactionData = {
            type: transactionType,
            source: source,
            amount: amount,
            reason: reason,
            date: new Date().toISOString().split('T')[0]  // Send the current date
        };

        // Send transaction to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbyH2oTxrFVLLDrRQY0iBIyBRjwQSSEzy5sY0227koNo-eav4YJrOWS7K6fsIES-3iA/exec?action=addTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)  // Send the transaction data
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
