document.addEventListener('DOMContentLoaded', function () {
    // Fetch financial data from Google Sheets and display it
    fetch('https://script.google.com/macros/s/AKfycbye_Tl9FP47Ux2YYjeOrqyTc84Grsou8n2NG6aiQxLTIeqxPJ5qQIwxoD_D7yL7_x0/exec?action=getFinancialData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('leoBankValue').innerText = data.leoBank + ' AZN';
            document.getElementById('kapitalBankValue').innerText = data.kapitalBank + ' AZN';
            document.getElementById('investmentFundValue').innerText = data.investmentFund + ' AZN';
            document.getElementById('totalStockValue').innerText = data.totalStockValue + ' AZN';  // Display Total Stock Value
            document.getElementById('eldekiPul').innerText = data.eldekiPul + ' AZN';  // Display Əldəki Pul
        })
        .catch(error => {
            console.error('Error fetching financial data:', error);
        });
    
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
            date: new Date().toISOString().slice(0, 10)
        };

        // Send transaction to Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbye_Tl9FP47Ux2YYjeOrqyTc84Grsou8n2NG6aiQxLTIeqxPJ5qQIwxoD_D7yL7_x0/exec?action=addTransaction', {
            method: 'POST',
            body: JSON.stringify(transactionData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Transaction added successfully!');
                window.location.reload();  // Reload the page to update values
            }
        })
        .catch(error => {
            console.error('Error adding transaction:', error);
        });
    });


// Update current cash value, apply styles for positive/negative amounts
function updateCurrentCash(cashValue) {
    const cashElement = document.getElementById('currentCash');
    cashElement.innerText = cashValue.toFixed(2) + ' AZN';

    if (cashValue >= 0) {
        cashElement.style.color = 'green';
    } else {
        cashElement.style.color = 'red';
    }
}


// Adjust turnover manually (this can open a prompt or a modal for input)
function adjustTurnover() {
    const newTurnover = prompt("Yeni Dövriyyəni daxil et (Enter new Turnover amount):");
    if (newTurnover) {
        // Update turnover in Google Sheets
        fetch('https://script.google.com/macros/s/AKfycbye_Tl9FP47Ux2YYjeOrqyTc84Grsou8n2NG6aiQxLTIeqxPJ5qQIwxoD_D7yL7_x0/exec?action=updateTurnover', {
            method: 'POST',
            body: JSON.stringify({ newTurnover: parseFloat(newTurnover) })
        })
        .then(response => response.json())
        .then(data => {
            alert('Dövriyyə yeniləndi! (Turnover updated)');
            location.reload(); // Reload the page to fetch updated data
        })
        .catch(error => {
            console.error('Error updating turnover:', error);
        });
    }
}
     });