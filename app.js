document.addEventListener("DOMContentLoaded", function() {
  // Set default date to today for sales form
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('sale-date').value = today;

  // Fetch products from Google Sheets for the dropdown
  fetchProducts();

  // Add event listener for the sales form
  document.getElementById('sales-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addSale();
  });

  // Add event listener for the product form
  document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addProduct();
  });

  // Add event listener for filtering sales
  document.getElementById('filter-sales').addEventListener('click', function() {
    fetchSales();
  });
});

function fetchProducts() {
  // Fetch product data from Google Sheets (replace with your Google Apps Script web app URL)
  const url = 'https://script.google.com/macros/s/AKfycbxX38ylETC_S96b9VfqtwtFHFIV27suk9qIN3-3KgBO0An9a5CDVEY3y7crZ_ac5w8/exec?action=fetchProducts';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const productDropdown = document.getElementById('product-dropdown');
      productDropdown.innerHTML = ''; // Clear current options
      data.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productDropdown.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching products:', error));
}

function addSale() {
  // Collect form data and send it to Google Sheets
  const saleData = {
    date: document.getElementById('sale-date').value,
    product: document.getElementById('product-dropdown').value,
    source: document.getElementById('source-dropdown').value,
    discount: document.getElementById('discount').value || 0
  };

  const url = 'https://script.google.com/macros/s/AKfycbxX38ylETC_S96b9VfqtwtFHFIV27suk9qIN3-3KgBO0An9a5CDVEY3y7crZ_ac5w8/exec?action=addSale';
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(saleData)
  })
  .then(response => response.json())
  .then(result => {
    alert('Sale added successfully!');
    document.getElementById('sales-form').reset();
  })
  .catch(error => console.error('Error adding sale:', error));
}

function addProduct() {
  // Collect product data and send it to Google Sheets
  const productData = {
    name: document.getElementById('product-name').value,
    cost: document.getElementById('cost').value,
    salesPrice: document.getElementById('sales-price').value,
    stock: document.getElementById('stock').value
  };

  const url = 'https://script.google.com/macros/s/AKfycbxX38ylETC_S96b9VfqtwtFHFIV27suk9qIN3-3KgBO0An9a5CDVEY3y7crZ_ac5w8/exec?action=addProduct';
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(productData)
  })
  .then(response => response.json())
  .then(result => {
    alert('Product added successfully!');
    fetchProducts(); // Update the product dropdown with the new product
    document.getElementById('product-form').reset();
  })
  .catch(error => console.error('Error adding product:', error));
}

function fetchSales() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  const url = `https://script.google.com/macros/s/AKfycbxX38ylETC_S96b9VfqtwtFHFIV27suk9qIN3-3KgBO0An9a5CDVEY3y7crZ_ac5w8/exec?action=fetchSales&start=${startDate}&end=${endDate}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector('#sales-table tbody');
      tbody.innerHTML = ''; // Clear current rows
      data.sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${sale.date}</td>
          <td>${sale.product}</td>
          <td>${sale.cost}</td>
          <td>${sale.salesPrice}</td>
          <td>${sale.source}</td>
          <td>${sale.discount}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching sales:', error));
}
