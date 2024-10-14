window.onload = function() {
  // Set default dates to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').value = today;
  document.getElementById('endDate').value = today;

  // Fetch today's sales data by default
  fetchSales();
};

// Fetch sales data based on selected dates
function fetchSales() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
  const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbyu9KAUM7eqODtyNEfwYK7Zm9H0h7cl16RXTSEdwz_AqVqI0b9SirdfrAt_Vo3L7cyV/exec?action=fetchSales&startDate=' + startDate + '&endDate=' + endDate;

  // Fetch sales data for the selected date range
  fetch(googleAppsScriptUrl)
    .then(response => response.json())
    .then(data => {
      displaySalesData(data);
      displayTotalPurchases(data.totalPurchases);  // Display the total purchases
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Display sales data in the table
function displaySalesData(data) {
  const tableBody = document.getElementById('purchaseBody');
  tableBody.innerHTML = '';  // Clear existing rows

  // Loop through the fetched sales data
  for (const [product, details] of Object.entries(data)) {
    // Skip totalPurchases key
    if (product === 'totalPurchases') continue;

    // Create a new row for each product (main or component)
    const row = document.createElement('tr');

    // Product Name Cell
    const productNameCell = document.createElement('td');
    productNameCell.textContent = product;
    row.appendChild(productNameCell);

    // Quantity Cell
    const quantityCell = document.createElement('td');
    quantityCell.textContent = details.qty;
    row.appendChild(quantityCell);

    // Product Type (Main Product or Component)
    const productTypeCell = document.createElement('td');
    productTypeCell.textContent = details.type === 'dəst' ? 'Main Product' : 'Component';
    row.appendChild(productTypeCell);

    // Customer Name Cell
    const customerCell = document.createElement('td');
    customerCell.textContent = details.customer;  // Add customer name
    row.appendChild(customerCell);

    // Notes Cell
    const notesCell = document.createElement('td');
    notesCell.textContent = details.notes;  // Add notes
    row.appendChild(notesCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
}

// Display total purchases at the bottom of the page (for components and non-`dəst` products)
function displayTotalPurchases(totalPurchases) {
  const totalList = document.getElementById('totalPurchasesList');
  totalList.innerHTML = '';  // Clear existing list

  // Populate the total purchase list
  for (const [product, qty] of Object.entries(totalPurchases)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${product}: ${qty} ədəd`;
    totalList.appendChild(listItem);
  }
}
