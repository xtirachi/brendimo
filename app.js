document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const salesForm = document.getElementById('salesForm');
    const malAdiSelect = document.getElementById('malAdiSelect');
    const salesTableBody = document.querySelector('#salesTable tbody');
    const monthSelect = document.getElementById('monthSelect');
    const monthlySales = document.getElementById('monthlySales');
    const monthlyCosts = document.getElementById('monthlyCosts');
    const dailySales = document.getElementById('dailySales');
    const dailyCosts = document.getElementById('dailyCosts');

    // Placeholder for products list - This will be fetched from Google Sheets
    let products = [];

    // Placeholder for Google Apps Script URL (Replace with actual URL)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzb73ZZnP0kqABnS0N1ybGMhIgw8u1vf8hIFEkxtjG0x9QO3V85AlYnZp9GySy6iL4/exec';

    // Set current month by default
    const currentMonth = new Date().toISOString().slice(0, 7);
    monthSelect.value = currentMonth;

    // Set current date by default in the sales form
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('tarix').value = currentDate;

    // Function to populate product dropdown from available products
    function populateProductDropdown() {
        malAdiSelect.innerHTML = '';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            malAdiSelect.appendChild(option);
        });
    }

    // Function to calculate and display daily and monthly totals
    function calculateTotals(data) {
        let totalSales = 0;
        let totalCosts = 0;
        let dailySalesAmount = 0;
        let dailyCostsAmount = 0;
        const today = new Date().toISOString().split('T')[0];

        data.forEach(row => {
            const saleDate = row.tarix;
            const saleAmount = parseFloat(row.satisQiymeti);
            const costAmount = parseFloat(row.xerc);

            totalSales += saleAmount;
            totalCosts += costAmount;

            if (saleDate === today) {
                dailySalesAmount += saleAmount;
                dailyCostsAmount += costAmount;
            }
        });

        monthlySales.textContent = `Satışlar: ${totalSales}`;
        monthlyCosts.textContent = `Xərclər: ${totalCosts}`;
        dailySales.textContent = `Satışlar: ${dailySalesAmount}`;
        dailyCosts.textContent = `Xərclər: ${dailyCostsAmount}`;
    }

    // Fetch products and sales data from Google Sheets
    function fetchDataFromGoogleSheet() {
        // Fetch products from Google Sheets
        fetch(`${GOOGLE_SCRIPT_URL}?action=getProducts`)
            .then(response => response.json())
            .then(data => {
                products = data;
                populateProductDropdown(); // Populate product dropdown
            })
            .catch(error => console.error('Error fetching product data:', error));

        // Fetch sales data from Google Sheets
        fetch(`${GOOGLE_SCRIPT_URL}?action=getSales&month=${monthSelect.value}`)
            .then(response => response.json())
            .then(data => {
                salesTableBody.innerHTML = '';
                data.forEach(row => {
                    const rowElement = document.createElement('tr');
                    rowElement.innerHTML = `
                        <td>${row.tarix}</td>
                        <td>${row.malAdi}</td>
                        <td>${row.xerc}</td>
                        <td>${row.satisQiymeti}</td>
                        <td>${row.sehifeAdi}</td>
                    `;
                    salesTableBody.appendChild(rowElement);
                });

                // Calculate and display totals
                calculateTotals(data);
            })
            .catch(error => console.error('Error fetching sales data:', error));
    }

    // Event listener to handle product form submission
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const malAdi = document.getElementById('malAdi').value;
        const xerc = document.getElementById('xerc').value;
        const satisQiymeti = document.getElementById('satisQiymeti').value;
        const miqdar = document.getElementById('miqdar').value;

        // Add product to the product list
        products.push({ name: malAdi, xerc, satisQiymeti, miqdar });

        // Send product data to Google Sheets (App Script)
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
        .then(data => {
            console.log('Product added:', data);
            populateProductDropdown(); // Refresh product dropdown
        })
        .catch(error => console.error('Error:', error));

        // Clear form
        productForm.reset();
    });

    // Event listener to handle sales form submission
    salesForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const tarix = document.getElementById('tarix').value;
        const malAdi = document.getElementById('malAdiSelect').value;
        const selectedProduct = products.find(product => product.name === malAdi);
        const satisQiymeti = selectedProduct.satisQiymeti;
        const xerc = selectedProduct.xerc;
        const sehifeAdi = document.getElementById('sehifeAdi').value;

        // Add sales data to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tarix}</td>
            <td>${malAdi}</td>
            <td>${xerc}</td>
            <td>${satisQiymeti}</td>
            <td>${sehifeAdi}</td>
        `;
        salesTableBody.appendChild(row);

        // Send sales data to Google Sheets (App Script)
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'addSale',
                tarix,
                malAdi,
                satisQiymeti,
                xerc,
                sehifeAdi
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sale added:', data);
        })
        .catch(error => console.error('Error:', error));

        // Clear form
        salesForm.reset();
    });

    // Event listener for month selection
    monthSelect.addEventListener('change', function() {
        fetchDataFromGoogleSheet(); // Fetch data for selected month
    });

    // Fetch all data from Google Sheets on page load
    fetchDataFromGoogleSheet();
});
