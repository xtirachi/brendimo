document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const salesForm = document.getElementById('salesForm');
    const malAdiSelect = document.getElementById('malAdiSelect');
    const salesTableBody = document.querySelector('#salesTable tbody');
    const monthSelect = document.getElementById('monthSelect');
    const monthlySales = document.getElementById('monthlySales');
    const monthlyCosts = document.getElementById('monthlyCosts');
    const monthlyProfit = document.getElementById('monthlyProfit');
    const dailySales = document.getElementById('dailySales');
    const dailyCosts = document.getElementById('dailyCosts');
    const dailyProfit = document.getElementById('dailyProfit');

    let products = [];
    let salesData = [];

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJrhFkmuvqF27POE_R7kzPgCH8pdcRYJnVsZP0Z8E6QOZTmvNeJA9ozkIdMeMQZrc/exec';

    // Set the current month by default in the month selector
    const currentMonth = new Date().toISOString().slice(0, 7);
    monthSelect.value = currentMonth;

    // Set the current date by default in the sales form
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('tarix').value = currentDate;

    // Function to populate the product dropdown
    function populateProductDropdown() {
        malAdiSelect.innerHTML = '';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            malAdiSelect.appendChild(option);
        });
    }

    // Function to calculate and display totals (sales, costs, profit)
    function calculateTotals() {
        let totalSales = 0;
        let totalCosts = 0;
        let dailySalesAmount = 0;
        let dailyCostsAmount = 0;
        const today = new Date().toISOString().split('T')[0];

        salesData.forEach(row => {
            const saleDate = row.tarix;
            const saleAmount = parseFloat(row.satisQiymeti) - parseFloat(row.endirim || 0);
            const costAmount = parseFloat(row.xerc);

            totalSales += saleAmount;
            totalCosts += costAmount;

            if (saleDate === today) {
                dailySalesAmount += saleAmount;
                dailyCostsAmount += costAmount;
            }
        });

        const totalProfit = totalSales - totalCosts;
        const dailyProfitAmount = dailySalesAmount - dailyCostsAmount;

        // Update the totals in the UI
        monthlySales.textContent = `Satışlar: ${totalSales.toFixed(2)}`;
        monthlyCosts.textContent = `Xərclər: ${totalCosts.toFixed(2)}`;
        monthlyProfit.textContent = `Gəlir: ${totalProfit.toFixed(2)}`;
        dailySales.textContent = `Satışlar: ${dailySalesAmount.toFixed(2)}`;
        dailyCosts.textContent = `Xərclər: ${dailyCostsAmount.toFixed(2)}`;
        dailyProfit.textContent = `Gəlir: ${dailyProfitAmount.toFixed(2)}`;
    }

    // Function to fetch data from Google Sheets and update the UI
    function fetchDataFromGoogleSheet() {
        // Fetch products from Google Sheets
        fetch(`${GOOGLE_SCRIPT_URL}?action=getProducts`)
            .then(response => response.json())
            .then(data => {
                products = data;
                populateProductDropdown();
            })
            .catch(error => console.error('Error fetching product data:', error));

        // Fetch sales data from Google Sheets for the selected month
        fetch(`${GOOGLE_SCRIPT_URL}?action=getSales&month=${monthSelect.value}`)
            .then(response => response.json())
            .then(data => {
                salesData = data;
                salesTableBody.innerHTML = '';
                salesData.forEach(row => {
                    const rowElement = document.createElement('tr');
                    rowElement.innerHTML = `
                        <td>${row.tarix}</td>
                        <td>${row.malAdi}</td>
                        <td>${row.xerc}</td>
                        <td>${row.satisQiymeti}</td>
                        <td>${row.endirim || 0}</td>
                        <td>${row.sehifeAdi}</td>
                    `;
                    salesTableBody.appendChild(rowElement);
                });

                calculateTotals(); // Update totals after sales data is loaded
            })
            .catch(error => console.error('Error fetching sales data:', error));
    }

    // Event listener for the product form submission
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const malAdi = document.getElementById('malAdi').value;
        const xerc = document.getElementById('xerc').value;
        const satisQiymeti = document.getElementById('satisQiymeti').value;
        const miqdar = document.getElementById('miqdar').value;

        products.push({ name: malAdi, xerc, satisQiymeti, miqdar });

        // Send the product data to Google Sheets (App Script)
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'addProduct',
                malAdi,
                xerc,
                satisQiymeti,
                miqdar
            })
        })
        .then(response => response.json())
        .then(() => {
            populateProductDropdown(); // Refresh product dropdown after adding
        })
        .catch(error => console.error('Error:', error));

        productForm.reset();
    });

    // Event listener for the sales form submission
    salesForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const tarix = document.getElementById('tarix').value;
        const malAdi = document.getElementById('malAdiSelect').value;
        const selectedProduct = products.find(product => product.name === malAdi);
        const satisQiymeti = selectedProduct.satisQiymeti;
        const xerc = selectedProduct.xerc;
        const sehifeAdi = document.getElementById('sehifeAdi').value;
        const discount = document.getElementById('discount').value || 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tarix}</td>
            <td>${malAdi}</td>
            <td>${xerc}</td>
            <td>${satisQiymeti}</td>
            <td>${discount}</td>
            <td>${sehifeAdi}</td>
        `;
        salesTableBody.appendChild(row);

        // Send the sales data to Google Sheets (App Script)
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'addSale',
                tarix,
                malAdi,
                satisQiymeti,
                xerc,
                discount,
                sehifeAdi
            })
        })
        .then(response => response.json())
        .then(() => {
            fetchDataFromGoogleSheet(); // Refresh sales data after adding a sale
        })
        .catch(error => console.error('Error:', error));

        salesForm.reset();
    });

    // Event listener for when the user selects a different month
    monthSelect.addEventListener('change', function() {
        fetchDataFromGoogleSheet(); // Fetch data for the selected month
    });

    // Fetch all data from Google Sheets when the page is loaded
    fetchDataFromGoogleSheet();
});
