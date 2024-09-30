// Fetch sales data for the selected date range and display in the table
document.getElementById('salesSummaryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    fetch(`https://script.google.com/macros/s/AKfycbxjjH5hZYsgMAaMlAIiX_lXJyTEOs3XKc71YdRuZhFbutEWRY083_ugfNXP2o-9ECo/exec?action=getSalesInRange&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            const salesTableBody = document.getElementById('salesTable').querySelector('tbody');
            salesTableBody.innerHTML = '';  // Clear previous results

            let totalSales = 0;
            let totalCost = 0;
            let totalProfit = 0;

            // Populate the table with sales data
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
                totalCost += parseFloat(sale.cost);
                totalSales += parseFloat(sale.salesPrice);
                totalProfit += parseFloat(sale.profit);
            });

            // Update the total row in the table
            document.getElementById('totalCost').innerText = totalCost.toFixed(2);
            document.getElementById('totalSales').innerText = totalSales.toFixed(2);
            document.getElementById('totalProfit').innerText = totalProfit.toFixed(2);
        });
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}
