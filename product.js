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

    fetch('https://script.google.com/macros/s/AKfycbyd3LN0TAor3EDORWdloZhgbl1V5FFqWNpMibqY_kNRHWfulqK8yhzjg1XpjVDM1Q/exec?action=addProduct', {
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
