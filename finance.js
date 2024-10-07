document.addEventListener('DOMContentLoaded', function() {
    // Set the date picker to today's date by default
    const datePicker = document.getElementById('datePicker');
    const today = new Date().toISOString().substr(0, 10);
    datePicker.value = today;

    // Fetch and display financial data for today on page load
    fetchFinancialData(today);

    // Add event listener for date change
    datePicker.addEventListener('change', function() {
        const selectedDate = this.value;
        fetchFinancialData(selectedDate);
    });

    // Add event listener for form submission
    const transactionForm = document.getElementById('transactionForm');
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitTransactionForm();
    });
});

function fetchFinancialData(selectedDate) {
    // Replace 'YOUR_SCRIPT_URL' with your actual Google Apps Script Web App URL
    fetch(`https://script.google.com/macros/s/AKfycbwWf55jzyIt_KyjxcVpbpTZxtLSGqYx6py8VQWwtdxrhec2ck0LeqWWE928xltJNLU/exec?action=getFinancialData&date=${selectedDate}`)
        .then(response => response.json())
        .then(data => {
            // Update the UI with the received data
            document.getElementById('leoBankBalance').textContent = data.leoBankBalance.toFixed(2);
            document.getElementById('kapitalBankBalance').textContent = data.kapitalBankBalance.toFixed(2);
            document.getElementById('investmentFundBalance').textContent = data.investmentFundBalance.toFixed(2);
            document.getElementById('qutuBalance').textContent = data.qutuBalance.toFixed(2);
            document.getElementById('bazarBalance').textContent = data.bazarBalance.toFixed(2);
            document.getElementById('dailyExpenses').textContent = data.dailyExpenses.toFixed(2);
            document.getElementById('todayCash').textContent = data.todayCash.toFixed(2);
            document.getElementById('totalProfit').textContent = data.totalProfit.toFixed(2);
        })
        .catch(error => {
            console.error('Error fetching financial data:', error);
            alert('Maliyyə məlumatlarını əldə etmək zamanı səhv baş verdi.');
        });
}

function submitTransactionForm() {
    // Collect form data
    const transactionType = document.getElementById('transactionType').value;
    const transactionSource = document.getElementById('transactionSource').value;
    const transactionAmount = parseFloat(document.getElementById('transactionAmount').value);
    const transactionReason = document.getElementById('transactionReason').value;

    if (!transactionType || !transactionSource || !transactionAmount || !transactionReason) {
        alert('Zəhmət olmasa, bütün sahələri doldurun.');
        return;
    }

    // Prepare data to send
    const data = {
        transactionType: transactionType,
        transactionSource: transactionSource,
        transactionAmount: transactionAmount,
        transactionReason: transactionReason
    };

    // Replace 'YOUR_SCRIPT_URL' with your actual Google Apps Script Web App URL
    fetch('https://script.google.com/macros/s/AKfycbyJyA04vD_r6iHVpM6E55y1O3r13ev9DFueRqMpesaDXWEVOrM2XvzKU40Eepz9KQ/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Əməliyyat uğurla yerinə yetirildi.');
            // Refresh the financial data
            const selectedDate = document.getElementById('datePicker').value;
            fetchFinancialData(selectedDate);
            // Reset the form
            document.getElementById('transactionForm').reset();
        } else {
            alert('Əməliyyat zamanı səhv baş verdi: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error submitting transaction:', error);
        alert('Əməliyyatı göndərmək zamanı səhv baş verdi.');
    });
}
