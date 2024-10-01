// Load the current date by default
document.getElementById('tarix').value = new Date().toISOString().split('T')[0];

let productList = [];

// Fetch product data from Google Sheets
function loadProducts() {
    fetch('https://script.google.com/macros/s/AKfycbyNQJTe-gDrwCs2NDnQHGkjZe8UsO5TLX-FDI3yETXfmr4I9rzauw0XZEVaesDiaA/exec?action=getProducts')
        .then(response => response.json())
        .then(data => {
            productList = data.products;  // Save the product list for search functionality
            populateProductDropdown(productList);
        });
}

// Populate product dropdown
function populateProductDropdown(products) {
    const productDropdown = document.getElementById('malAdi');
    productDropdown.innerHTML = ''; // Clear current options
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.text = product.name;
        productDropdown.appendChild(option);
    });
}

// When a product is selected, fetch the cost, sales price, and stock left
document.getElementById('malAdi').addEventListener('change', function () {
    const selectedProduct = this.value;
    fetch(`https://script.google.com/macros/s/AKfycbyNQJTe-gDrwCs2NDnQHGkjZe8UsO5TLX-FDI3yETXfmr4I9rzauw0XZEVaesDiaA/exec?action=getProductDetails&productName=${selectedProduct}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('xerc').value = data.cost;
            document.getElementById('satisQiymeti').value = data.salesPrice;
            document.getElementById('anbarQaligi').value = data.stockLeft;  // Display the stock left
        });
});

// Submit the sales data and update stock in both Sales and Products sheets
document.getElementById('salesForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const salesData = {
        tarix: formData.get('tarix'),
        malAdi: formData.get('malAdi'),
        sehifeAdi: formData.get('sehifeAdi'),
        endirim: formData.get('endirim') || 0,
        xerc: formData.get('xerc'),
        satisQiymeti: formData.get('satisQiymeti'),
        anbarQaligi: formData.get('anbarQaligi')
    };

    fetch('https://script.google.com/macros/s/AKfycbyNQJTe-gDrwCs2NDnQHGkjZe8UsO5TLX-FDI3yETXfmr4I9rzauw0XZEVaesDiaA/exec?action=addSaleAndUpdateStock', {
        method: 'POST',
        body: JSON.stringify(salesData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Satış uğurla əlavə edildi və anbar yeniləndi!');
        document.getElementById('salesForm').reset();
        document.getElementById('tarix').value = new Date().toISOString().split('T')[0];
        loadProducts();  // Reload the products to refresh stock amounts
    });
});

// Search functionality for products
document.getElementById('productSearch').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = productList.filter(product => product.name.toLowerCase().includes(searchTerm));
    populateProductDropdown(filteredProducts);
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}

// Initialize products on page load
loadProducts();
