// Constants for Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNyQvjS0M3_x7vuYVjEgiWisxfPJKaslCmxFD_LIB5-tZGeoH8xxwgC2gFKjbswyAB/exec';

// DOM elements
const addProductForm = document.getElementById('addProductForm');
const updateProductForm = document.getElementById('updateProductForm');
const addProductTab = document.getElementById('addProductTab');
const updateProductTab = document.getElementById('updateProductTab');
const productSelect = document.getElementById('productSelect'); // For selecting product to update
const updateProductName = document.getElementById('updateProductName'); // For product name in update form
const updateCost = document.getElementById('updateCost'); // For cost in update form
const updateSalesPrice = document.getElementById('updateSalesPrice'); // For sales price in update form
const updateInventoryAmount = document.getElementById('updateInventoryAmount'); // For inventory amount in update form
const componentsDropdown = document.getElementById('components'); // For components dropdown
const selectedComponentsContainer = document.getElementById('selectedComponents'); // For displaying selected components

let selectedComponents = []; // To store selected components

// Toggle forms based on the selected tab
addProductTab.addEventListener('click', function () {
    addProductForm.classList.remove('hidden');
    updateProductForm.classList.add('hidden');
    addProductTab.classList.add('active-tab');
    updateProductTab.classList.remove('active-tab');
});

updateProductTab.addEventListener('click', function () {
    addProductForm.classList.add('hidden');
    updateProductForm.classList.remove('hidden');
    addProductTab.classList.remove('active-tab');
    updateProductTab.classList.add('active-tab');
});

// Fetch product details for updating
function fetchProductDetails(productName) {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'getProductDetails');
    url.searchParams.append('productName', productName);

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateFormForUpdate(data.product); // Populate the form for updating
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Error fetching product details: ' + error.message);
        });
}

// Populate the form with product details for updating
function populateFormForUpdate(product) {
    // Check if product details exist before updating the fields
    if (product) {
        updateProductName.value = product.productName;
        updateCost.value = product.cost;
        updateSalesPrice.value = product.salesPrice;
        updateInventoryAmount.value = product.inventoryAmount;

        // Handle components part
        const components = product.components ? product.components.split(',') : [];
        selectedComponents.length = 0; // Clear the existing components
        selectedComponents.push(...components);
        updateSelectedComponentsUI(); // Update the UI to display the selected components
    } else {
        alert("Məhsul tapılmadı!");
    }
}

// Update the UI to display selected components
function updateSelectedComponentsUI() {
    selectedComponentsContainer.innerHTML = ''; // Clear existing components

    selectedComponents.forEach((component, index) => {
        const componentElement = document.createElement('div');
        componentElement.classList.add('component-item');
        componentElement.innerHTML = `${component} <button type="button" onclick="removeComponent(${index})">Sil</button>`;
        selectedComponentsContainer.appendChild(componentElement);
    });
}

// Remove a component from the selected list
function removeComponent(index) {
    selectedComponents.splice(index, 1); // Remove the component by index
    updateSelectedComponentsUI(); // Refresh the UI
}

// Fetch products and populate the product dropdown for editing
function loadEditProductOptions(searchTerm = '') {
    fetch(GOOGLE_SCRIPT_URL + '?action=getProducts&searchTerm=' + encodeURIComponent(searchTerm))
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateProductDropdown(data.products); // Populate the product dropdown for editing
            } else {
                alert('Xəta: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Məhsullar alınarkən xəta baş verdi: ' + error.message);
        });
}

// Populate the product dropdown for editing products
function populateProductDropdown(products) {
    productSelect.innerHTML = ''; // Clear the dropdown

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

// Event listener for when a product is selected from the dropdown (for editing)
productSelect.addEventListener('change', function () {
    const selectedProduct = this.value; // Get the selected product
    if (selectedProduct) {
        fetchProductDetails(selectedProduct); // Fetch and populate the form with product details
    }
});

// Load products when the page loads
window.onload = function () {
    loadEditProductOptions(); // Load all products initially when the page loads
};
