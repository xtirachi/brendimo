document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const salesForm = document.getElementById('salesForm');
    const malAdiSelect = document.getElementById('malAdiSelect');
    const salesTableBody = document.querySelector('#salesTable tbody');

    // Placeholder for products list - This will be fetched from Google Sheets
    const products = [];

    // Placeholder for Google Apps Script URL (Replace with actual URL)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiwaqsioF5lyTJjsmvZvqGioFBn37fUMrl7By4V5UqFPB4fN0g8HyryEcEDpeFYdg/exec';

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
        const satisMeblegi = document.getElementById('satisMeblegi').value;
        const gelir = document.getElementById('gelir').value;
        const sehifeAdi = document.getElementById('sehifeAdi').value;

        // Add sales data to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tarix}</td>
            <td>${malAdi}</td>
            <td>${satisMeblegi}</td>
            <td>${satisMeblegi}</td>
            <td>${gelir}</td>
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
                satisMeblegi,
                gelir,
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
});
