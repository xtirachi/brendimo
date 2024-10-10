const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLtjXkIdUGF9EkoA89x2SUs9sE-S9kw-2UAFlWek_mSvCFels7Me9wfNY8GAft1UEN/exec';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');
    const statusMessage = document.getElementById('statusMessage');

    // Populate the components dropdown (fetch products for selection)
    fetch(`${APPSCRIPT_URL}?action=getProducts`)
        .then(response => response.json())
        .then(data => {
            const componentsSelect = document.getElementById('components');
            data.forEach(product => {
                const option = document.createElement('option');
                option.value = product.name;
                option.text = product.name;
                componentsSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching product list:', error));

    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const components = Array.from(document.getElementById('components').selectedOptions)
                                .map(option => option.value)
                                .join(',');

        const productData = {
            action: 'addOrUpdateProduct',
            productName: formData.get('productName'),
            cost: formData.get('cost'),
            salePrice: formData.get('salePrice'),
            inventoryAmount: formData.get('inventoryAmount'),
            components: components
        };

        fetch(APPSCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(productData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            statusMessage.textContent = data.message;
            form.reset();
        })
        .catch(error => {
            console.error('Error adding/updating product:', error);
            statusMessage.textContent = 'Məhsul əlavə edilərkən xəta baş verdi!';
        });
    });
});
