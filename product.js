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

const productSearchAdd = document.getElementById('productSearch'); // Search input for adding components in Add form
const componentsDropdownAdd = document.getElementById('components'); // Components dropdown in Add form
const selectedComponentsAdd = document.getElementById('selectedComponentsAdd'); // Selected components in Add form

const productSearchUpdate = document.getElementById('productSearch'); // Search input for adding components in Update form
const componentsDropdownUpdate = document.getElementById('components'); // Components dropdown in Update form
const selectedComponentsUpdate = document.getElementById('selectedComponentsUpdate'); // Selected components in Update form

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

// Search functionality for adding components in both Add and Update forms
function searchComponents(searchTerm, formType = 'add') {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'searchComponents');
    url.searchParams.append('searchTerm', searchTerm);

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateComponentsDropdown(data.components, formType); // Populate dropdown with search results
            } else {
                alert('Xəta: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Məhsullar axtarılarkən xəta baş verdi: ' + error.message);
        });
}

// Populate the dropdown with search results
function populateComponentsDropdown(components, formType = 'add') {
    let componentsDropdown = formType === 'add' ? componentsDropdownAdd : componentsDropdownUpdate;
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

// Add selected component (product) to the list of components
document.getElementById('addComponent').addEventListener('click', function () {
    const selectedComponent = componentsDropdownAdd.value.trim();  // Get selected product from the dropdown

    if (selectedComponent && !selectedComponents.includes(selectedComponent)) {
        selectedComponents.push(selectedComponent);  // Add the product to the list of selected components
        updateSelectedComponentsUI('add');  // Update the UI to display the selected components
    } else {
        alert('Zəhmət olmasa etibarlı bir məhsul seçin.');
    }
});

// Add selected component in the Update form
document.getElementById('addComponent').addEventListener('click', function () {
    const selectedComponent = componentsDropdownUpdate.value.trim();  // Get selected product from the dropdown

    if (selectedComponent && !selectedComponents.includes(selectedComponent)) {
        selectedComponents.push(selectedComponent);  // Add the product to the list of selected components
        updateSelectedComponentsUI('update');  // Update the UI to display the selected components
    } else {
        alert('Zəhmət olmasa etibarlı bir məhsul seçin.');
    }
});

// Update the UI to display selected components
function updateSelectedComponentsUI(formType = 'add') {
    let selectedComponentsContainer = formType === 'add' ? selectedComponentsAdd : selectedComponentsUpdate;
    selectedComponentsContainer.innerHTML = ''; // Clear existing components

    selectedComponents.forEach((component, index) => {
        const componentElement = document.createElement('div');
        componentElement.classList.add('component-item');
        componentElement.innerHTML = `${component} <button type="button" onclick="removeComponent(${index}, '${formType}')">Sil</button>`;
        selectedComponentsContainer.appendChild(componentElement);
    });
}

// Remove a component from the selected list
function removeComponent(index, formType = 'add') {
    selectedComponents.splice(index, 1); // Remove the component by index
    updateSelectedComponentsUI(formType); // Refresh the UI
}

// Event listeners for product search (for both add and update forms)
productSearchAdd.addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term
    searchComponents(searchTerm, 'add');  // Fetch and filter components for Add form
});

productSearchUpdate.addEventListener('input', function () {
    const searchTerm = this.value.trim();  // Get the search term
    searchComponents(searchTerm, 'update');  // Fetch and filter components for Update form
});

// Load products when the page loads
window.onload = function () {
    // Load existing products or components if needed
};

