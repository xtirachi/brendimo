// Constants for the Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUAS8YQg4pElwPBRBWlQh6KpPV6LnkJ5abuCoUiIYtnCophmQzPHBSiDsU-vz3dlGX/exec';  // Replace with your actual Google Apps Script URL
const productForm = document.getElementById('productForm');
const selectedComponents = [];
const componentsDropdown = document.getElementById('components');
const selectedComponentsContainer = document.getElementById('selectedComponents');
const productSearch = document.getElementById('productSearch');

// Event listener for form submission
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic form validation
    if (!document.getElementById('productName').value || !document.getElementById('cost').value || !document.getElementById('salesPrice').value || !document.getElementById('inventoryAmount').value) {
        alert('Zəhmət olmasa bütün sahələri doldurun!');
        return;
    }

    // Prepare the form data using URLSearchParams
    const productData = new URLSearchParams({
        action: 'addProduct',
        productName: document.getElementById('productName').value,
        cost: document.getElementById('cost').value,
        salesPrice: document.getElementById('salesPrice').value,
        inventoryAmount: document.getElementById('inventoryAmount').value,
        components: selectedComponents.join(',')  // Send components as a comma-separated string
    });

    // Call saveProduct to send the data to the backend
    saveProduct(productData);
});

// Save the product data using fetch and handle the response
function saveProduct(productData) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'  // Required for URLSearchParams
        },
        body: productData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Məhsul uğurla əlavə edildi və ya yeniləndi!');
            window.location.reload();  // Refresh the page after a successful addition or update
        } else {
            alert('Xəta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Məhsul əlavə edərkən/saxlayarkən xəta baş verdi: ' + error.message);
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
