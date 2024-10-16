document.addEventListener('DOMContentLoaded', function () {
    // Fetch the inventory data from Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzIwXUDI86ekFkUlbkhj5ZUCvLZ1WqDtXdHiubSXRcjbSIeneXy3Bku-qMuJs3vWYk/exec?action=getInventory')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('productList');
            const totalInventoryValue = document.getElementById('totalInventoryValue');
            let totalValue = 0;

            // Clear the list before populating
            productList.innerHTML = '';

            // Populate the product list
            data.inventory.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `${product.name} - Anbar Miqdarı: ${product.stock}`;

                // Change color to red if stock is less than 5
                if (product.stock < 5) {
                    li.style.color = 'red';
                }

                productList.appendChild(li);

                // Calculate total inventory value
                totalValue += product.stock * product.cost;
            });

            // Display total inventory value
            totalInventoryValue.innerHTML = totalValue.toFixed(2);  // Display the sum
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}
