// Function to navigate between pages
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
}

// Google Apps Script URLs
const ADD_SALES_URL = 'https://script.google.com/macros/s/AKfycbwOrTgKaDMMtagJTvmy85KuJBtIRrc4HcKnQ3Plf5D0LCGGrprw9BZj94WmIgV3nkE/exec?action=addSales'; // ADD YOUR SCRIPT ID
const GET_PRODUCTS_URL = 'https://script.google.com/macros/s/AKfycbwOrTgKaDMMtagJTvmy85KuJBtIRrc4HcKnQ3Plf5D0LCGGrprw9BZj94WmIgV3nkE/exec?action=getProducts'; // ADD YOUR SCRIPT ID
const ADD_PRODUCT_URL = 'https://script.google.com/macros/s/AKfycbwOrTgKaDMMtagJTvmy85KuJBtIRrc4HcKnQ3Plf5D0LCGGrprw9BZj94WmIgV3nkE/exec?action=addProduct'; // ADD YOUR SCRIPT ID
const GET_SALES_URL = 'https://script.google.com/macros/s/AKfycbwOrTgKaDMMtagJTvmy85KuJBtIRrc4HcKnQ3Plf5D0LCGGrprw9BZj94WmIgV3nkE/exec?action=getSales'; // ADD YOUR SCRIPT ID

// Load product names into dropdown dynamically
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});


// Fetch product names from Google Sheets
function loadProducts() {
  fetch(GET_PRODUCTS_URL)
    .then(response => response.json())
    .then(data => {
      const productDropdown = document.getElementById('malinAdi');
      data.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productDropdown.appendChild(option);
      });
    });
}

// Handle daily sales form submission
document.getElementById('dailySalesForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  
  fetch(ADD_SALES_URL, {
    method: 'POST',
    body: formData
  }).then(response => {
    if (response.ok) {
      alert('Satış uğurla əlavə edildi!');
    } else {
      alert('Satış əlavə edilərkən xəta baş verdi.');
    }
  });
});

// Handle new product form submission
document.getElementById('addProductForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new URLSearchParams(new FormData(this)); // URL encode form data

  fetch(ADD_PRODUCT_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // URL-encoded form data
    }
  }).then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Məhsul uğurla əlavə edildi!');
        loadProducts(); // Reload products
      } else {
        alert('Məhsul əlavə edilərkən xəta baş verdi: ' + data.message);
      }
    });
});

