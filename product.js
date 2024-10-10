// Constants for the Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqRNnO9hQ3JmnNYMUSaqloJXIXsW08e52RwJhloLcTcL3op7ZNk6oWZTub9pt4EXmn/exec';  // Replace with your actual Google Apps Script URL
const productForm = document.getElementById('productForm');
const selectedComponents = [];
const componentsDropdown = document.getElementById('components');
const selectedComponentsContainer = document.getElementById('selectedComponents');
const productSearch = document.getElementById('productSearch');
let isUpdatingProduct = false;  // Track whether we are adding or updating a product

// Event listener for form submission
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const productName = document.getElementById('productName').value;

    if (!productName || !document.getElementById('cost').value || !document.getElementById('salesPrice').value || !document.getElementById('inventoryAmount').value) {
        alert('Zəhmət olmasa bütün sahələri doldurun!');
        return;
    }

    // Determine if we are updating or adding a product
    if (isUpdatingProduct) {
        const productData = new URLSearchParams({
            action: 'updateProduct',
            productName: productName,
            cost: document.getElementById('cost').value,
            salesPrice: document.getElementById('salesPrice').value,
            inventoryAmount: document.getElementById('inventoryAmount').value,
            components: selectedComponents.join(',')  // Send components as a comma-separated string
        });
        updateProduct(productData);
    } else {
        const productData = new URLSearchParams({
            action: 'addProduct',
            productName: productName,
            cost: document.getElementById('cost').value,
            salesPrice: document.getElementById('salesPrice').value,
            inventoryAmount: document.getElementById('inventoryAmount').value,
            components: selectedComponents.join(',')  // Send components as a comma-separated string
        });
        saveProduct(productData);
    }
});

// Save the product data (adding a new product) and handle the response
function saveProduct(productData) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: productData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Məhsul uğurla əlavə edildi!');
            window.location.reload();  // Refresh the page after a successful addition
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Məhsul əlavə edilərkən xəta baş verdi: ' + error.message);
    });
}

// Update the product data (existing product update) and handle the response
function updateProduct(productData) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: productData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Məhsul uğurla yeniləndi!');
            window.location.reload();  // Refresh the page after a successful update
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Məhsul yenilənərkən xəta baş verdi: ' + error.message);
    });
}

// Fetch products for search functionality
productSearch.addEventListener('input', function () {
    const searchTerm = productSearch.value.toLowerCase();

    // Call the Google Apps Script to get filtered products
    fetchProducts(searchTerm);
});

// Function to fetch products from the backend
function fetchProducts(searchTerm) {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'getProducts');
    if (searchTerm) {
        url.searchParams.append('searchTerm', searchTerm);
    }

    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateComponentsDropdown(data.products);  // Update dropdown with filtered products
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error fetching products: ' + error.message);
    });
}

// Function to update the components dropdown with products
function updateComponentsDropdown(products) {
    componentsDropdown.innerHTML = '';  // Clear the dropdown

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.productName;
        option.text = product.productName;
        componentsDropdown.appendChild(option);
    });
}

// Add component button click handler
document.getElementById('addComponent').addEventListener('click', function() {
    const selectedComponent = componentsDropdown.value;
    
    if (selectedComponent && !selectedComponents.includes(selectedComponent)) {
        selectedComponents.push(selectedComponent);
        updateSelectedComponentsUI();
    } else {
        alert('Zəhmət olmasa etibarlı bir komponent seçin.');
    }
});

// Update the UI to display selected components
function updateSelectedComponentsUI() {
    selectedComponentsContainer.innerHTML = '';  // Clear the container

    selectedComponents.forEach((component, index) => {
        const componentElement = document.createElement('div');
        componentElement.classList.add('component-item');
        componentElement.innerHTML = `
            ${component} 
            <button type="button" onclick="removeComponent(${index})">Sil</button>
        `;
        selectedComponentsContainer.appendChild(componentElement);
    });
}

// Remove a component from the selected list
function removeComponent(index) {
    selectedComponents.splice(index, 1);  // Remove the selected component by index
    updateSelectedComponentsUI();  // Refresh the UI
}

// Fetch details for a specific product by name
function fetchProductDetails(productName) {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'getProductDetails');
    url.searchParams.append('productName', productName);

    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateFormForUpdate(data.product);  // Populate the form with the fetched details for update
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error fetching product details: ' + error.message);
    });
}

// Populate the form with existing product details to update it
function populateFormForUpdate(product) {
    document.getElementById('productName').value = product.productName;
    document.getElementById('cost').value = product.cost;
    document.getElementById('salesPrice').value = product.salesPrice;
    document.getElementById('inventoryAmount').value = product.inventoryAmount;
    
    selectedComponents.length = 0;  // Clear current components
    selectedComponents.push(...product.components.split(','));  // Add components from the product
    updateSelectedComponentsUI();  // Update the UI with the components

    isUpdatingProduct = true;  // Set flag to update product
}
