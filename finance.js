document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('datePicker');
    const today = new Date().toISOString().substr(0, 10);
    datePicker.value = today;

    fetchFinancialData(today);

    datePicker.addEventListener('change', function() {
        const selectedDate = this.value;
        fetchFinancialData(selectedDate);
    });

    const transactionForm = document.getElementById('transactionForm');
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitTransactionForm();
    });
});

function fetchFinancialData(selectedDate) {
    fetch(`https://script.google.com/macros/s/AKfycbxoLnkqabNC_8sLUo4R19mDIEBqA5tgQONColGxHu72vvKAtFgSlYfUnoLWQE1QZPs/exec?action=getFinancialData&date=${selectedDate}`)
        .then(response => response.json())
        .then(data => {
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
    const transactionType = document.getElementById('transactionType').value;
    const transactionSource = document.getElementById('transactionSource').value;
    const transactionAmount = parseFloat(document.getElementById('transactionAmount').value);
    const transactionReason = document.getElementById('transactionReason').value;

    if (!transactionType || !transactionSource || !transactionAmount || !transactionReason) {
        alert('Zəhmət olmasa, bütün sahələri doldurun.');
        return;
    }

    const data = {
        transactionType: transactionType,
        transactionSource: transactionSource,
        transactionAmount: transactionAmount,
        transactionReason: transactionReason
    };

    fetch('https://script.google.com/macros/s/AKfycbxoLnkqabNC_8sLUo4R19mDIEBqA5tgQONColGxHu72vvKAtFgSlYfUnoLWQE1QZPs/exec?action=addTransaction', {
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
            const selectedDate = document.getElementById('datePicker').value;
            fetchFinancialData(selectedDate);
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
