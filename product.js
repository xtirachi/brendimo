// Constants for Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzmkAtQLnCBGB8bawMpQQU7qt_myeAd7XEJtRh58sEaMGkfNPliSTC0YzG5kKTlCFAz/exec';


// Variables for selected components
let selectedComponentsAdd = [];  // To store selected components in Add form
let selectedComponentsUpdate = [];  // To store selected components in Update form

// Tab switching logic for showing and hiding forms
document.getElementById('addProductTab').addEventListener('click', function () {
    // Hide the update form and show the add form
    document.getElementById('updateProductForm').classList.add('hidden');
    document.getElementById('addProductForm').classList.remove('hidden');

    // Update active tab class
    this.classList.add('active-tab');
    document.getElementById('updateProductTab').classList.remove('active-tab');
});

document.getElementById('updateProductTab').addEventListener('click', function () {
    // Hide the add form and show the update form
    document.getElementById('addProductForm').classList.add('hidden');
    document.getElementById('updateProductForm').classList.remove('hidden');

    // Update active tab class
    this.classList.add('active-tab');
    document.getElementById('addProductTab').classList.remove('active-tab');
});

// Event listeners for product search in the Add form
document.getElementById('productSearchAdd').addEventListener('input', function () {
    const searchTerm = this.value.trim();
    if (searchTerm) {
        searchComponents(searchTerm, 'add');
    }
});

// Event listeners for product search in the Update form
document.getElementById('productSearchUpdate').addEventListener('input', function () {
    const searchTerm = this.value.trim();
    if (searchTerm) {
        searchComponents(searchTerm, 'update');
    }
});

// Function to search for components (common for both forms)
function searchComponents(searchTerm, formType = 'add') {
    const url = new URL(GOOGLE_SCRIPT_URL);  // Construct the URL with the base URL
    url.searchParams.append('action', 'searchComponents');  // Add the 'action' parameter
    url.searchParams.append('searchTerm', searchTerm);  // Add the 'searchTerm' parameter

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Debugging step to log the fetched data

            if (data.success) {
                populateComponentsDropdown(data.components, formType);  // Populate dropdown with search results
            } else {
                alert('Xəta: ' + data.message);  // Display backend error message
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Məhsullar axtarılarkən xəta baş verdi: ' + error.message);
        });
}

// Populate the dropdown with search results for both Add and Update forms
function populateComponentsDropdown(components, formType = 'add') {
    let componentsDropdown = formType === 'add' ? document.getElementById('componentsAdd') : document.getElementById('componentsUpdate');
    componentsDropdown.innerHTML = '';  // Clear previous dropdown options

    components.forEach(component => {
        const option = document.createElement('option');
        option.value = component.productName;
        option.text = component.productName;
        componentsDropdown.appendChild(option);
    });

    if (components.length === 0) {
        const option = document.createElement('option');
        option.text = 'Məhsul tapılmadı';
        componentsDropdown.appendChild(option);
    }
}

// Add selected component to the list for Add form
document.getElementById('addComponentAdd').addEventListener('click', function () {
    const selectedComponent = document.getElementById('componentsAdd').value.trim();
    if (selectedComponent && !selectedComponentsAdd.includes(selectedComponent)) {
        selectedComponentsAdd.push(selectedComponent);  // Add the product to the list of selected components
        updateSelectedComponentsUI('add');  // Update the UI for Add form
    } else {
        alert('Zəhmət olmasa etibarlı bir məhsul seçin.');
    }
});

// Add selected component to the list for Update form
document.getElementById('addComponentUpdate').addEventListener('click', function () {
    const selectedComponent = document.getElementById('componentsUpdate').value.trim();
    if (selectedComponent && !selectedComponentsUpdate.includes(selectedComponent)) {
        selectedComponentsUpdate.push(selectedComponent);  // Add the product to the list of selected components
        updateSelectedComponentsUI('update');  // Update the UI for Update form
    } else {
        alert('Zəhmət olmasa etibarlı bir məhsul seçin.');
    }
});

// Update the UI to display selected components for both Add and Update forms
function updateSelectedComponentsUI(formType = 'add') {
    let selectedComponentsContainer = formType === 'add' ? document.getElementById('selectedComponentsAdd') : document.getElementById('selectedComponentsUpdate');
    let selectedComponents = formType === 'add' ? selectedComponentsAdd : selectedComponentsUpdate;

    selectedComponentsContainer.innerHTML = ''; // Clear existing components

    selectedComponents.forEach((component, index) => {
        const componentElement = document.createElement('div');
        componentElement.classList.add('component-item');
        componentElement.innerHTML = `${component} <button type="button" onclick="removeComponent(${index}, '${formType}')">Sil</button>`;
        selectedComponentsContainer.appendChild(componentElement);
    });
}

// Remove a component from the selected list in either Add or Update form
function removeComponent(index, formType = 'add') {
    let selectedComponents = formType === 'add' ? selectedComponentsAdd : selectedComponentsUpdate;
    selectedComponents.splice(index, 1);  // Remove the component by index
    updateSelectedComponentsUI(formType);  // Refresh the UI
}

// Handle Add Product form submission
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent the default form submission

    // Collect form data
    const productName = document.getElementById('productName').value.trim();
    const cost = document.getElementById('cost').value.trim();
    const salesPrice = document.getElementById('salesPrice').value.trim();
    const inventoryAmount = document.getElementById('inventoryAmount').value.trim();
    const components = selectedComponentsAdd;  // Get selected components for the product

    // Basic validation to ensure all required fields are filled
    if (!productName || !cost || !salesPrice || !inventoryAmount) {
        alert('Zəhmət olmasa bütün sahələri doldurun.');
        return;
    }

    // Create a data object to send to the backend
    const productData = {
        action: 'addProduct',
        productName: productName,
        cost: cost,
        salesPrice: salesPrice,
        inventoryAmount: inventoryAmount,
        components: components
    };

    // Send data to the backend to add the product
    sendProductData(productData, 'Məhsul uğurla əlavə edildi!');
});

// Function to send product data (add or update) to the backend
function sendProductData(productData, successMessage) {
    const url = new URL(GOOGLE_SCRIPT_URL);  // Create the URL

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(successMessage);
            window.location.reload();  // Optionally reload the page after success
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Xəta baş verdi: ' + error.message);
    });
}

// Event listener for product search in the 'Məhsulu Yenilə' section
document.getElementById('editProductSearch').addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term from the input field
    searchForProducts(searchTerm);  // Call the function to search products
});

// Function to search for products in the 'Məhsulu Yenilə' part
function searchForProducts(searchTerm) {
    const url = new URL(GOOGLE_SCRIPT_URL);  // Construct the URL
    url.searchParams.append('action', 'getProducts');
    url.searchParams.append('searchTerm', searchTerm);

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateProductSelectDropdown(data.products);  // Populate dropdown with search results
            } else {
                alert('Xəta: ' + data.message);  // Display error message if the backend fails
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Məhsullar axtarılarkən xəta baş verdi: ' + error.message);
        });
}

// Populate the product dropdown in the 'Məhsulu Yenilə' section
function populateProductSelectDropdown(products) {
    const productSelect = document.getElementById('productSelect');  // Dropdown element
    productSelect.innerHTML = '';  // Clear previous dropdown options

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
