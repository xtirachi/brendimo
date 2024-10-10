const SHEET_ID = 'https://script.google.com/macros/s/AKfycbxN7UhLySV257OhHiq_WhZxu6qWB6Q9IG-ce5fFqmuDFzN1HxRVWD-2wLQzKx4GwQo/exec';  // Replace with the web app URL
const componentsDropdown = document.getElementById('components');
const selectedComponentsDiv = document.getElementById('selectedComponents');
const productSearch = document.getElementById('productSearch');
let selectedComponents = [];
let productList = [];  // To store the full list of products for searching

// Load products from Google Sheets into dropdown
window.onload = function () {
    fetchComponents();
};


function fetchComponents() {
    fetch(`${SHEET_ID}?action=getProducts`)
        .then(response => response.json())
        .then(data => {
            productList = data.products;  // Store the product list for search
            populateProductDropdown(productList);  // Populate the dropdown with the full list
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Populate dropdown with products
function populateProductDropdown(products) {
    componentsDropdown.innerHTML = '';  // Clear previous options
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.text = product.name;
        componentsDropdown.appendChild(option);
    });
}

// Add selected component to the list
document.getElementById('addComponent').addEventListener('click', function () {
    const selectedComponent = componentsDropdown.value;
    if (selectedComponent && !selectedComponents.includes(selectedComponent)) {
        selectedComponents.push(selectedComponent);
        updateSelectedComponents();
    }
});

function updateSelectedComponents() {
    selectedComponentsDiv.innerHTML = '';
    selectedComponents.forEach(component => {
        const componentElement = document.createElement('div');
        componentElement.textContent = component;
        selectedComponentsDiv.appendChild(componentElement);
    });
}

// Handle form submission using URLSearchParams
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const productData = new URLSearchParams({
        action: 'addProduct',
        productName: document.getElementById('productName').value,
        cost: document.getElementById('cost').value,
        salesPrice: document.getElementById('salesPrice').value,
        inventoryAmount: document.getElementById('inventoryAmount').value,
        components: selectedComponents.join(',')  // Send components as a comma-separated string
    });

    saveProduct(productData);
});

function saveProduct(productData) {
    fetch(SHEET_ID, {  // Replace GOOGLE_SCRIPT_URL with your Google Apps Script web app URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'  // Required for URLSearchParams
        },
        body: productData  // Using URLSearchParams here
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Məhsul uğurla əlavə edildi!');
            window.location.reload();  // Refresh the page after a successful addition
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error adding product: ' + error.message);
    });
}

// Search functionality for products with debouncing
let searchTimeout;
productSearch.addEventListener('input', function () {
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
