// Function to navigate between pages
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
}

// Google Apps Script URLs
const ADD_SALES_URL = 'https://script.google.com/macros/s/AKfycbx0rwKSv-8U74j-wwMxuwVHXI880iQzJP3YyOehoMHg0pM84dp4xQe6rhHfSAENk4o/exec?action=addSales'; // Replace with your script ID
const GET_PRODUCTS_URL = 'https://script.google.com/macros/s/AKfycbx0rwKSv-8U74j-wwMxuwVHXI880iQzJP3YyOehoMHg0pM84dp4xQe6rhHfSAENk4o/exec?action=getProducts'; // Replace with your script ID
const ADD_PRODUCT_URL = 'https://script.google.com/macros/s/AKfycbx0rwKSv-8U74j-wwMxuwVHXI880iQzJP3YyOehoMHg0pM84dp4xQe6rhHfSAENk4o/exec?action=addProduct'; // Replace with your script ID
const GET_SALES_URL = 'https://script.google.com/macros/s/AKfycbx0rwKSv-8U74j-wwMxuwVHXI880iQzJP3YyOehoMHg0pM84dp4xQe6rhHfSAENk4o/exec?action=getSales'; // Replace with your script ID

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
    })
    .catch(error => console.error('Error fetching products:', error));
}

// Handle daily sales form submission
document.getElementById('dailySalesForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new URLSearchParams(new FormData(this)); // URL encode form data

  fetch(ADD_SALES_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // URL-encoded form data
    }
  }).then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Satış uğurla əlavə edildi!');
      } else {
        alert('Satış əlavə edilərkən xəta baş verdi.');
      }
    })
    .catch(error => console.error('Error:', error));
});

// Handle new product form submission
document.getElementById('addProductForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new URLSearchParams(new FormData(this)); // URL encode form data
  
  // Debugging form data
  console.log('Submitting product form with data:', [...formData]);

  fetch(ADD_PRODUCT_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // URL-encoded form data
    }
  }).then(response => response.json())
    .then(data => {
      console.log('Server response:', data); // Log the server response for debugging
      
      if (data.status === 'success') {
        alert('Məhsul uğurla əlavə edildi!');
        loadProducts(); // Reload products
      } else {
        alert('Məhsul əlavə edilərkən xəta baş verdi: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error during product addition:', error);
    });
});
