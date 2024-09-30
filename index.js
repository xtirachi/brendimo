// Load the current date by default
document.getElementById('tarix').value = new Date().toISOString().split('T')[0];

// Fetch product data from Google Sheets
function loadProducts() {
    fetch('https://script.google.com/macros/s/AKfycbyd3LN0TAor3EDORWdloZhgbl1V5FFqWNpMibqY_kNRHWfulqK8yhzjg1XpjVDM1Q/exec?action=getProducts')
        .then(response => response.json())
        .then(data => {
            const productDropdown = document.getElementById('malAdi');
            data.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.name;
                option.text = product.name;
                productDropdown.appendChild(option);
            });
        });
}

// When a product is selected, fetch the cost and sales price
document.getElementById('malAdi').addEventListener('change', function () {
    const selectedProduct = this.value;
    fetch(`https://script.google.com/macros/s/AKfycbyd3LN0TAor3EDORWdloZhgbl1V5FFqWNpMibqY_kNRHWfulqK8yhzjg1XpjVDM1Q/exec?action=getProductDetails&productName=${selectedProduct}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('xerc').value = data.cost;
            document.getElementById('satisQiymeti').value = data.salesPrice;
        });
});

// Submit the sales data
document.getElementById('salesForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const salesData = {
        tarix: formData.get('tarix'),
        malAdi: formData.get('malAdi'),
        sehifeAdi: formData.get('sehifeAdi'),
        endirim: formData.get('endirim') || 0,
        xerc: formData.get('xerc'),
        satisQiymeti: formData.get('satisQiymeti')
    };

    fetch('https://script.google.com/macros/s/AKfycbyd3LN0TAor3EDORWdloZhgbl1V5FFqWNpMibqY_kNRHWfulqK8yhzjg1XpjVDM1Q/exec?action=addSale', {
        method: 'POST',
        body: JSON.stringify(salesData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Satış uğurla əlavə edildi!');
        // Reset form
        document.getElementById('salesForm').reset();
        document.getElementById('tarix').value = new Date().toISOString().split('T')[0];
    });
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}

// Initialize products on page load
loadProducts();
