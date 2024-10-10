// Constants for Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFEDO29rTQhWnbjP066jSNjHaq30efZlQnEZPcWlOAnqDBsZt--BGbYHWeZUeQQ0Y6/exec';

// DOM elements
const productForm = document.getElementById('productForm');
const productSelect = document.getElementById('productSelect');
const componentsDropdown = document.getElementById('components');
const selectedComponentsContainer = document.getElementById('selectedComponents');
const productSearch = document.getElementById('productSearch');
const actionAdd = document.getElementById('actionAdd');
const actionUpdate = document.getElementById('actionUpdate');
const updateProductContainer = document.getElementById('updateProductContainer');

// Initialize flag for tracking add or update
let isUpdatingProduct = false;
const selectedComponents = [];  // Track the selected components for the product

// Fetch and populate the dropdown with existing products for updating
function loadProductOptions() {
    fetchProducts('').then(products => {
        productSelect.innerHTML = '<option value="">Məhsul seçin</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.productName;
            option.text = product.productName;
            productSelect.appendChild(option);
        });
    }).catch(error => {
        console.error('Error loading product options:', error);
        alert('Məhsullar yüklənərkən xəta baş verdi.');
    });
}

// Toggle between Add/Update modes
document.querySelectorAll('input[name="productAction"]').forEach(action => {
    action.addEventListener('change', function () {
        if (this.value === 'update') {
            updateProductContainer.style.display = 'block';
            isUpdatingProduct = true;
            loadProductOptions();
        } else {
            updateProductContainer.style.display = 'none';
            isUpdatingProduct = false;
        }
    });
});

// Populate the form when a product is selected for updating
productSelect.addEventListener('change', function () {
    const selectedProduct = this.value;
    if (selectedProduct) {
        fetchProductDetails(selectedProduct);
    } else {
        alert('Zəhmət olmasa bir məhsul seçin.');
    }
});

// Form submission event listener for adding/updating product
productForm.addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent form from submitting the default way

    const productName = document.getElementById('productName').value;

    // Validate that all required fields are filled in
    if (!productName || !document.getElementById('cost').value || !document.getElementById('salesPrice').value || !document.getElementById('inventoryAmount').value) {
        alert('Zəhmət olmasa bütün sahələri doldurun!');
        return;
    }

    // Create product data for submission
    const productData = new URLSearchParams({
        action: isUpdatingProduct ? 'updateProduct' : 'addProduct',
        productName: productName,
        cost: document.getElementById('cost').value,
        salesPrice: document.getElementById('salesPrice').value,
        inventoryAmount: document.getElementById('inventoryAmount').value,
        components: selectedComponents.join(',')  // Join selected components into a comma-separated string
    });

    handleProductData(productData, isUpdatingProduct ? 'updateProduct' : 'addProduct');
});

// Handle product submission (add or update)
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

// Fetch product list from the backend
function fetchProducts(searchTerm) {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'getProducts');
    if (searchTerm) {
        url.searchParams.append('searchTerm', searchTerm);
    }

    return fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.products;
            } else {
                alert('Error: ' + data.message);
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            alert('Error fetching products: ' + error.message);
            return [];
        });
}

// Fetch details for a specific product by name
function fetchProductDetails(productName) {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'getProductDetails');
    url.searchParams.append('productName', productName);

    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateFormForUpdate(data.product);
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
    document.getElementById('productName').value = product.productName;
    document.getElementById('cost').value = product.cost;
    document.getElementById('salesPrice').value = product.salesPrice;
    document.getElementById('inventoryAmount').value = product.inventoryAmount;

    // Handle components
    selectedComponents.length = 0;
    if (product.components) {
        selectedComponents.push(...product.components.split(','));
    }
    updateSelectedComponentsUI();
}

// Add component to the selected list
document.getElementById('addComponent').addEventListener('click', function () {
    const selectedComponent = componentsDropdown.value;
    if (selectedComponent && !selectedComponents.includes(selectedComponent)) {
        selectedComponents.push(selectedComponent);
        updateSelectedComponentsUI();
    } else {
        alert('Zəhmət olmasa etibarlı bir komponent seçin.');
    }
});

// Update the UI to show the selected components
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
