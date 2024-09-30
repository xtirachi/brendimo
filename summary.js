// Fetch sales data for the selected date range
document.getElementById('salesSummaryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    fetch(`https://script.google.com/macros/s/AKfycbyd3LN0TAor3EDORWdloZhgbl1V5FFqWNpMibqY_kNRHWfulqK8yhzjg1XpjVDM1Q/exec?action=getSales&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            const salesTableBody = document.getElementById('salesTable').querySelector('tbody');
            salesTableBody.innerHTML = '';  // Clear previous results

            let totalSales = 0;
            let totalCost = 0;
            let totalProfit = 0;

            data.sales.forEach(sale => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${sale.date}</td>
                    <td>${sale.productName}</td>
                    <td>${sale.cost}</td>
                    <td>${sale.salesPrice}</td>
                    <td>${sale.discount}</td>
                    <td>${sale.salesSource}</td>
                    <td>${sale.profit}</td>
                `;

                salesTableBody.appendChild(row);

                // Update totals
                totalSales += parseFloat(sale.salesPrice);
                totalCost += parseFloat(sale.cost);
                totalProfit += parseFloat(sale.profit);
            });

            // Display totals
            document.getElementById('totalSales').innerText = totalSales.toFixed(2);
            document.getElementById('totalCost').innerText = totalCost.toFixed(2);
            document.getElementById('totalProfit').innerText = totalProfit.toFixed(2);
        });
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}
