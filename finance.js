document.addEventListener('DOMContentLoaded', function() {
    // Set the date picker to today's date by default
    const datePicker = document.getElementById('datePicker');
    const today = new Date().toISOString().substr(0, 10);
    datePicker.value = today;

    // Fetch and display financial data for today's date on page load
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

// Function to fetch financial data for a specific date
function fetchFinancialData(selectedDate) {
    fetch(`https://script.google.com/macros/s/AKfycbxmB0q3UhMtaVFnr2I4FkFD-zdaJ9EBji26DS9RfhfBePZdvziPMHZjN_TWE4aU74g/exec?action=getFinancialData&date=${selectedDate}`)
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

// Function to submit the transaction form
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

    // Send the POST request to log the transaction
    fetch('https://script.google.com/macros/s/AKfycbxmB0q3UhMtaVFnr2I4FkFD-zdaJ9EBji26DS9RfhfBePZdvziPMHZjN_TWE4aU74g/exec?action=addTransaction', {
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
            // Refresh the financial data for the selected date
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
