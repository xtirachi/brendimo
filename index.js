// Load the current date by default
document.getElementById('tarix').value = new Date().toISOString().split('T')[0];

let productList = [];

// Fetch product data from Google Sheets and remove blanks and duplicates
function loadProducts() {
    fetch('https://script.google.com/macros/s/AKfycbxM5rvin3HnEIkbS4CwtThj_LRgnEdVkI2U_9Q992xT8oj3JXIa-tU0FoxJrvWy9V4/exec?action=getProducts')
        .then(response => response.json())
        .then(data => {
            productList = [...new Set(data.products.filter(product => product.name.trim() !== ""))];  // Remove duplicates and blanks
            populateProductDropdown(productList);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Populate product dropdown with filtered list
function populateProductDropdown(products) {
    const productDropdown = document.getElementById('malAdi');
    productDropdown.innerHTML = '';  // Clear current options
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.text = product.name;
        productDropdown.appendChild(option);
    });
}

// Search functionality for products with debouncing
let searchTimeout;
document.getElementById('productSearch').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();

    if (searchTimeout) {
        clearTimeout(searchTimeout);  // Clear previous timeout
    }

    // Debounce search: wait 300ms after the last keystroke to perform search
    searchTimeout = setTimeout(() => {
        const filteredProducts = productList.filter(product => product.name.toLowerCase().includes(searchTerm));
        populateProductDropdown(filteredProducts);
    }, 300);
});

// When a product is selected, fetch the cost, sales price, and stock left
document.getElementById('malAdi').addEventListener('change', function () {
    const selectedProduct = this.value;
    fetch(`https://script.google.com/macros/s/AKfycbxM5rvin3HnEIkbS4CwtThj_LRgnEdVkI2U_9Q992xT8oj3JXIa-tU0FoxJrvWy9V4/exec?action=getProductDetails&productName=${encodeURIComponent(selectedProduct)}`)
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

    // Get the manual cost adjustment (if provided), otherwise use the default cost
    let xerc = formData.get('manualXerc') || formData.get('xerc');

    const salesData = {
        tarix: formData.get('tarix'),
        malAdi: formData.get('malAdi'),
        sehifeAdi: formData.get('sehifeAdi'),
        endirim: formData.get('endirim') || 0,
        xerc: xerc,
        satisQiymeti: formData.get('satisQiymeti'),
        anbarQaligi: formData.get('anbarQaligi')
    };

    fetch('https://script.google.com/macros/s/AKfycbxM5rvin3HnEIkbS4CwtThj_LRgnEdVkI2U_9Q992xT8oj3JXIa-tU0FoxJrvWy9V4/exec?action=addSaleAndUpdateStock', {
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

// Navigation function
function navigate(page) {
    window.location.href = page;
}

// Initialize products on page load
loadProducts();
