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

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJrhFkmuvqF27POE_R7kzPgCH8pdcRYJnVsZP0Z8E6QOZTmvNeJA9ozkIdMeMQZrc/exec';

    const currentMonth = new Date().toISOString().slice(0, 7);
    monthSelect.value = currentMonth;

    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('tarix').value = currentDate;

    function populateProductDropdown() {
        malAdiSelect.innerHTML = '';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            malAdiSelect.appendChild(option);
        });
    }

    function calculateTotals(data) {
        let totalSales = 0;
        let totalCosts = 0;
        let totalDiscounts = 0;
        let dailySalesAmount = 0;
        let dailyCostsAmount = 0;
        let dailyDiscountsAmount = 0;
        const today = new Date().toISOString().split('T')[0];

        data.forEach(row => {
            const saleDate = row.tarix;
            const saleAmount = parseFloat(row.satisQiymeti);
            const costAmount = parseFloat(row.xerc);
            const discountAmount = row.endirim ? parseFloat(row.endirim) : 0;

            totalSales += (saleAmount - discountAmount);
            totalCosts += costAmount;
            totalDiscounts += discountAmount;

            if (saleDate === today) {
                dailySalesAmount += (saleAmount - discountAmount);
                dailyCostsAmount += costAmount;
                dailyDiscountsAmount += discountAmount;
            }
        });

        const totalProfit = totalSales - totalCosts;
        const dailyProfitAmount = dailySalesAmount - dailyCostsAmount;

        monthlySales.textContent = `Satışlar: ${totalSales}`;
        monthlyCosts.textContent = `Xərclər: ${totalCosts}`;
        monthlyProfit.textContent = `Gəlir: ${totalProfit}`;
        dailySales.textContent = `Satışlar: ${dailySalesAmount}`;
        dailyCosts.textContent = `Xərclər: ${dailyCostsAmount}`;
        dailyProfit.textContent = `Gəlir: ${dailyProfitAmount}`;
    }

    function fetchDataFromGoogleSheet() {
        fetch(`${GOOGLE_SCRIPT_URL}?action=getProducts`)
            .then(response => response.json())
            .then(data => {
                products = data;
                populateProductDropdown();
            })
            .catch(error => console.error('Error fetching product data:', error));

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
                        <td>${row.endirim || 0}</td>
                        <td>${row.sehifeAdi}</td>
                    `;
                    salesTableBody.appendChild(rowElement);
                });

                calculateTotals(data);
            })
            .catch(error => console.error('Error fetching sales data:', error));
    }

    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const malAdi = document.getElementById('malAdi').value;
        const xerc = document.getElementById('xerc').value;
        const satisQiymeti = document.getElementById('satisQiymeti').value;
        const miqdar = document.getElementById('miqdar').value;

        products.push({ name: malAdi, xerc, satisQiymeti, miqdar });

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
            populateProductDropdown();
        })
        .catch(error => console.error('Error:', error));

        productForm.reset();
    });

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
        .catch(error => console.error('Error:', error));

        salesForm.reset();
    });

    monthSelect.addEventListener('change', function() {
        fetchDataFromGoogleSheet();
    });

    fetchDataFromGoogleSheet();
});

