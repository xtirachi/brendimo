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

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfXYx_RA38fJ1Q8NdoO2c6wTSUHrfrJEx8mGZWcWN2v8tpfD7VV64MFnHzav64EuY/exec';

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
    async function fetchDataFromGoogleSheet() {
        try {
            // Fetch products from Google Sheets
            const productsResponse = await fetch(`${GOOGLE_SCRIPT_URL}?action=getProducts`);
            const productsData = await productsResponse.json();
            products = productsData;
            populateProductDropdown();

            // Fetch sales data from Google Sheets for the selected month
            const salesResponse = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSales&month=${monthSelect.value}`);
            const salesDataResponse = await salesResponse.json();
            salesData = salesDataResponse;

            // Clear and populate the sales table with fetched sales data
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

            // Calculate totals after fetching sales data
            calculateTotals();

        } catch (error) {
            console.error('Error fetching data from Google Sheets:', error);
        }
    }

    // Event listener for the product form submission
    productForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const malAdi = document.getElementById('malAdi').value;
        const xerc = document.getElementById('xerc').value;
        const satisQiymeti = document.getElementById('satisQiymeti').value;
        const miqdar = document.getElementById('miqdar').value;

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'addProduct',
                    malAdi,
                    xerc,
                    satisQiymeti,
                    miqdar
                })
            });

            fetchDataFromGoogleSheet(); // Refresh products data after adding
        } catch (error) {
            console.error('Error adding product:', error);
        }

        productForm.reset();
    });

    // Event listener for the sales form submission
    salesForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const tarix = document.getElementById('tarix').value;
        const malAdi = document.getElementById('malAdiSelect').value;
        const selectedProduct = products.find(product => product.name === malAdi);
        const satisQiymeti = selectedProduct.satisQiymeti;
        const xerc = selectedProduct.xerc;
        const sehifeAdi = document.getElementById('sehifeAdi').value;
        const discount = document.getElementById('discount').value || 0;

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
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
            });

            fetchDataFromGoogleSheet(); // Refresh sales data after adding a sale
        } catch (error) {
            console.error('Error adding sale:', error);
        }

        salesForm.reset();
    });

    // Event listener for when the user selects a different month
    monthSelect.addEventListener('change', fetchDataFromGoogleSheet);

    // Fetch all data from Google Sheets when the page is loaded
    fetchDataFromGoogleSheet();
});
