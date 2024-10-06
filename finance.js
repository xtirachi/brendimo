document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().split('T')[0];

    // Default: Load financial data for today's date
    fetchFinancialData(today);

    // Handle filtering financial data based on the selected date
    document.getElementById('filterButton').addEventListener('click', function () {
        const filterDate = document.getElementById('filterDate').value;
        if (filterDate) {
            fetchFinancialData(filterDate);
        }
    });

    // Fetch financial data for the given date
    function fetchFinancialData(date) {
        fetch(`https://script.google.com/macros/s/AKfycbzOz3jIb1Y8Bj0IZBD3kGI5jTNW65_W0yjMYuN9lXTdVl_M0f_zSvB9JbB1fNEMH9c/exec?action=getFinancialData&date=${date}`)
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
    }

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
            date: new Date().toISOString().split('T')[0]  // Always use the current date for transactions
        };

        // Send the transaction data to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbzOz3jIb1Y8Bj0IZBD3kGI5jTNW65_W0yjMYuN9lXTdVl_M0f_zSvB9JbB1fNEMH9c/exec?action=addTransaction', {
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
