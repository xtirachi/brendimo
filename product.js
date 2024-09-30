// Submit the new product data
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const productData = {
        malAdi: formData.get('malAdi'),
        xerc: formData.get('xerc'),
        satisQiymeti: formData.get('satisQiymeti'),
        anbarMiqdari: formData.get('anbarMiqdari')
    };

    fetch('https://script.google.com/macros/s/AKfycbxjjH5hZYsgMAaMlAIiX_lXJyTEOs3XKc71YdRuZhFbutEWRY083_ugfNXP2o-9ECo/exec?action=addProduct', {
        method: 'POST',
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Məhsul uğurla əlavə edildi!');
        // Reset form
        document.getElementById('productForm').reset();
    });
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}
