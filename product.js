// Constants for Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzPSBkZzNVJayNpHzzvrTqFo9Hetkq5EuuySGisQNAJlWntwPb2_Gs8AK3DpAEMFGyF/exec';

// Variables for selected components
let selectedComponentsAdd = [];  // To store selected components in Add form
let selectedComponentsUpdate = [];  // To store selected components in Update form

// DOM elements
const addProductForm = document.getElementById('addProductForm');
const updateProductForm = document.getElementById('updateProductForm');
const addProductTab = document.getElementById('addProductTab');
const updateProductTab = document.getElementById('updateProductTab');

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

// Search functionality for adding components in both Add and Update forms
function searchComponents(searchTerm, formType = 'add') {
    const url = new URL(GOOGLE_SCRIPT_URL);  // Replace GOOGLE_SCRIPT_URL with your actual Apps Script URL
    url.searchParams.append('action', 'searchComponents'); // Add the 'action' parameter
    url.searchParams.append('searchTerm', searchTerm);     // Add the 'searchTerm' parameter

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateComponentsDropdown(data.components, formType); // Populate dropdown with search results
            } else {
                alert('Xəta: ' + data.message); // Display backend error
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Məhsullar axtarılarkən xəta baş verdi: ' + error.message);
        });
}

// Populate the dropdown with search results for both forms
function populateComponentsDropdown(components, formType = 'add') {
    let componentsDropdown = formType === 'add' ? document.getElementById('componentsAdd') : document.getElementById('componentsUpdate');
    componentsDropdown.innerHTML = ''; // Clear previous dropdown options

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

// Add selected component (product) to the list of components for Add form
document.getElementById('addComponentAdd').addEventListener('click', function () {
    const selectedComponent = document.getElementById('componentsAdd').value.trim();  // Get selected product from the Add form dropdown

    if (selectedComponent && !selectedComponentsAdd.includes(selectedComponent)) {
        selectedComponentsAdd.push(selectedComponent);  // Add the product to the list of selected components
        updateSelectedComponentsUI('add');  // Update the UI for Add form
    } else {
        alert('Zəhmət olmasa etibarlı bir məhsul seçin.');
    }
});

// Add selected component (product) to the list of components for Update form
document.getElementById('addComponentUpdate').addEventListener('click', function () {
    const selectedComponent = document.getElementById('componentsUpdate').value.trim();  // Get selected product from the Update form dropdown

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
    selectedComponents.splice(index, 1); // Remove the component by index
    updateSelectedComponentsUI(formType); // Refresh the UI
}

// Event listeners for product search (for both add and update forms)
document.getElementById('productSearchAdd').addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term
    searchComponents(searchTerm, 'add');  // Fetch and filter components for Add form
});

document.getElementById('productSearchUpdate').addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term
    searchComponents(searchTerm, 'update');  // Fetch and filter components for Update form
});

// Event listener for product search in the 'Məhsulu Yenilə' section
document.getElementById('editProductSearch').addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term from the input field
    searchForProducts(searchTerm);  // Call the function to search products
});

// Function to search for products in the 'Məhsulu Yenilə' part
function searchForProducts(searchTerm) {
    const url = new URL(GOOGLE_SCRIPT_URL);  // Replace with your actual Apps Script URL
    url.searchParams.append('action', 'getProducts');  // Call the getProducts action
    url.searchParams.append('searchTerm', searchTerm);  // Pass the search term

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
    const productSelect = document.getElementById('productSelect'); // Dropdown element
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
