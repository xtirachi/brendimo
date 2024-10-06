document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().split('T')[0];

    // Fetch financial data and display it
    fetch('https://script.google.com/macros/s/AKfycbxvp2upO2jBl42660X69RE8fGltwkqdToPaNWQzK4ZaMPBIN21akl-3_Gw3jqoFaIY/exec?action=getFinancialData')
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

    // Handle transaction form submission
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

        // Send the transaction data to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbxvp2upO2jBl42660X69RE8fGltwkqdToPaNWQzK4ZaMPBIN21akl-3_Gw3jqoFaIY/exec?action=addTransaction', {
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
