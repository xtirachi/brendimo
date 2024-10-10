// Constants for Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNyQvjS0M3_x7vuYVjEgiWisxfPJKaslCmxFD_LIB5-tZGeoH8xxwgC2gFKjbswyAB/exec';

// DOM elements
const productForm = document.getElementById('productForm');
const productSelect = document.getElementById('productSelect');
const componentsDropdown = document.getElementById('components');
const selectedComponentsContainer = document.getElementById('selectedComponents');
const productSearch = document.getElementById('productSearch');
const editProductSearch = document.getElementById('editProductSearch');
let originalProductName = '';  // Store the original product name

// Initialize flag for tracking add or update
let isUpdatingProduct = false;
const selectedComponents = [];  // Track the selected components for the product

/**
 * Fetch products for both the Komponentlər dropdown and the product selection dropdown.
 * The searchTerm is optional and used for filtering products based on user input.
 */
function loadProducts(searchTerm = '') {
    fetch(GOOGLE_SCRIPT_URL + '?action=getProducts&searchTerm=' + encodeURIComponent(searchTerm))
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Populate both the Komponentlər dropdown and the product select dropdown
                populateComponentsDropdown(data.products);
                populateProductDropdown(data.products);
            } else {
                alert('Xəta: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Məhsullar alınarkən xəta baş verdi: ' + error.message);
        });
}

// Populate the Komponentlər dropdown
function populateComponentsDropdown(products) {
    const componentsDropdown = document.getElementById('productName');
    componentsDropdown.innerHTML = '';  // Clear the dropdown

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.productName;
        option.text = product.productName;
        componentsDropdown.appendChild(option);
    });

    if (products.length === 0) {
        const option = document.createElement('option');
        option.text = 'Məhsul tapılmadı';
        componentsDropdown.appendChild(option);
    }
}

// Populate the product dropdown for editing
function populateProductDropdown(products) {
    const componentsDropdown = document.getElementById('productName');
    productSelect.innerHTML = '';  // Clear the dropdown

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.productName;
        option.text = product.productName;
        productSelect.appendChild(option);
    });

    if (products.length === 0) {
        const option = document.createElement('option');
        option.text = 'Məhsul tapılmadı';
        productSelect.appendChild(option);
    }
}

// Add selected component to the list of components
document.getElementById('addComponent').addEventListener('click', function () {
    const selectedComponent = componentsDropdown.value.trim();  // Get selected product from the Komponentlər dropdown

    if (selectedComponent && !selectedComponents.includes(selectedComponent)) {
        selectedComponents.push(selectedComponent);  // Add the product to the list of selected components
        updateSelectedComponentsUI();  // Update the UI to display the selected components
    } else {
        alert('Zəhmət olmasa etibarlı bir məhsul seçin.');
    }
});

// Update the UI to display selected components
function updateSelectedComponentsUI() {
    selectedComponentsContainer.innerHTML = '';  // Clear existing components

    selectedComponents.forEach((component, index) => {
        const componentElement = document.createElement('div');
        componentElement.classList.add('component-item');
        componentElement.innerHTML = `${component} <button type="button" onclick="removeComponent(${index})">Sil</button>`;
        selectedComponentsContainer.appendChild(componentElement);
    });
}

// Remove a component from the selected list
function removeComponent(index) {
    selectedComponents.splice(index, 1);  // Remove the component by index
    updateSelectedComponentsUI();  // Refresh the UI
}

// Handle form submission for adding/updating product
productForm.addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent form from submitting the default way

    const productName = document.getElementById('productName').value.trim();  // Ensure no extra spaces

    if (!productName || !document.getElementById('cost').value || !document.getElementById('salesPrice').value || !document.getElementById('inventoryAmount').value) {
        alert('Zəhmət olmasa bütün sahələri doldurun!');
        return;
    }

    const productData = new URLSearchParams({
        action: isUpdatingProduct ? 'updateProduct' : 'addProduct',
        productName: productName,  // Send the clean product name
        cost: document.getElementById('cost').value,
        salesPrice: document.getElementById('salesPrice').value,
        inventoryAmount: document.getElementById('inventoryAmount').value,
        components: selectedComponents.join(',')  // Send the selected components as a comma-separated string
    });

    handleProductData(productData, isUpdatingProduct ? 'updateProduct' : 'addProduct');
});

// Function to handle product data submission (adding or updating)
function handleProductData(productData, action) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: productData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Məhsul uğurla ${action === 'addProduct' ? 'əlavə edildi' : 'yeniləndi'}!`);
            window.location.reload();  // Optionally refresh the page after success
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert(`Məhsul ${action === 'addProduct' ? 'əlavə edilərkən' : 'yenilənərkən'} xəta baş verdi: ` + error.message);
    });
}

// Fetch products and populate the product dropdown for editing
function loadEditProductOptions(searchTerm = '') {
    loadProducts(searchTerm);  // Reuse the function to load and filter products for both dropdowns
}

// Event listener for the product search input (Komponentlər)
productSearch.addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term
    loadProducts(searchTerm);  // Fetch and filter products based on the search term
});

// Event listener for the product search input (editing products)
editProductSearch.addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term
    loadEditProductOptions(searchTerm);  // Fetch and filter products based on the search term
});

// Event listener for when a product is selected from the dropdown (for editing)
productSelect.addEventListener('change', function () {
    const selectedProduct = this.value;  // Get the selected product

    if (selectedProduct) {
        fetchProductDetails(selectedProduct);  // Fetch and populate the form with product details
    }
});

// Fetch details for a specific product by name (used for editing)
function fetchProductDetails(productName) {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'getProductDetails');
    url.searchParams.append('productName', productName);

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateFormForUpdate(data.product);  // Populate the form for updating
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Error fetching product details: ' + error.message);
        });
}

// Populate the form with product details for editing
function populateFormForUpdate(product) {
    document.getElementById('productName').value = product.productName;
    document.getElementById('cost').value = product.cost;
    document.getElementById('salesPrice').value = product.salesPrice;
    document.getElementById('inventoryAmount').value = product.inventoryAmount;

    // Handle components
    const components = product.components ? product.components.split(',') : [];
    selectedComponents.length = 0;
    selectedComponents.push(...components);
    updateSelectedComponentsUI();
}

// Load products when the page loads
window.onload = loadProducts;  // Load all products initially when the page loads
