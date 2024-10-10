const SHEET_ID = 'https://script.google.com/macros/s/AKfycbyALWKS9kMrQeOvJbJqR00_u6ycmuL1vpVOA2adz3Ro5SUm9mVszTKKby7Y7dyVSV0/exec';  // Replace with the web app URL
const componentsDropdown = document.getElementById('components');
const selectedComponentsDiv = document.getElementById('selectedComponents');
let selectedComponents = [];

// Load products from Google Sheets into dropdown
window.onload = function () {
    fetchComponents();
};

function fetchComponents() {
    fetch(`${SHEET_ID}?action=getProducts`)
        .then(response => response.json())
        .then(data => {
            data.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.name;
                option.text = product.name;
                componentsDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
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

// Handle form submission
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const productData = {
        productName: document.getElementById('productName').value,
        cost: document.getElementById('cost').value,
        salesPrice: document.getElementById('salesPrice').value,
        inventoryAmount: document.getElementById('inventoryAmount').value,
        components: selectedComponents.join(',') // Send components as a comma-separated string
    };

    saveProduct(productData);
});

function saveProduct(productData) {
    fetch(`${SHEET_ID}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'addProduct', productData }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Məhsul uğurla əlavə edildi!');
            document.getElementById('productForm').reset();
            selectedComponents = [];
            updateSelectedComponents();
        } else {
            alert('Məhsul əlavə edilərkən xəta baş verdi.');
        }
    })
    .catch(error => console.error('Error saving product:', error));
}
