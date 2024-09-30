// Submit the new product data to Google Sheets
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const productData = {
        malAdi: formData.get('malAdi'),
        xerc: formData.get('xerc'),
        satisQiymeti: formData.get('satisQiymeti'),
        anbarMiqdari: formData.get('anbarMiqdari')
    };

    // Send product data to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbyVgBbD8KejFxWblQmBVqZR5IA15NoQgv5g707GjIgo0epORO8AxTYn2hvdK6zPA34/exec?action=addProduct', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Məhsul uğurla əlavə edildi!');
            document.getElementById('productForm').reset();  // Reset the form
        } else {
            alert('Xəta baş verdi! Məhsul əlavə edilə bilmədi.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Xəta baş verdi!');
    });
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}
