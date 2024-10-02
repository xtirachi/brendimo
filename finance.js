document.addEventListener('DOMContentLoaded', function () {
 // Fetch financial data from Google Sheets and display it
    fetch('https://script.google.com/macros/s/AKfycbySP7kFHMRzxYR5rGuRf_kZSHz60Ypn1gNwI4ANe9k8u_1he1dddydHUrAnmy4qNbM/exec?action=getFinancialData')
       .then(response => response.json())
    .then(data => {
        // Display the values
        console.log('Financial Data:', data);  // Debugging: Check if data is received
        document.getElementById('leoBankValue').innerText = data.leoBank + ' AZN';
        document.getElementById('kapitalBankValue').innerText = data.kapitalBank + ' AZN';
        document.getElementById('investmentFundValue').innerText = data.investmentFund + ' AZN';
        document.getElementById('inventoryValue').innerText = data.inventoryValue + ' AZN';
        document.getElementById('turnoverValue').innerText = data.turnover + ' AZN';
        updateCurrentCash(data.currentCash);
    })
    .catch(error => {
        console.error('Error fetching financial data:', error);  // Debugging: Log the error
    });
  });
    // Handle the withdrawal form submission
    document.getElementById('withdrawForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const source = document.getElementById('withdrawSource').value;
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const reason = document.getElementById('withdrawReason').value;

        if (amount > 0) {
            // Submit the withdrawal data to Google Sheets
            fetch('https://script.google.com/macros/s/AKfycbySP7kFHMRzxYR5rGuRf_kZSHz60Ypn1gNwI4ANe9k8u_1he1dddydHUrAnmy4qNbM/exec?action=withdraw', {
                method: 'POST',
                body: JSON.stringify({ source, amount, reason })
            })
            .then(response => response.json())
            .then(data => {
                alert('Pul uğurla çıxarıldı! (Money successfully withdrawn)');
                location.reload(); // Reload the page to fetch updated data
            })
            .catch(error => {
                console.error('Error processing withdrawal:', error);
            });
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
        fetch('https://script.google.com/macros/s/AKfycbySP7kFHMRzxYR5rGuRf_kZSHz60Ypn1gNwI4ANe9k8u_1he1dddydHUrAnmy4qNbM/exec?action=updateTurnover', {
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
