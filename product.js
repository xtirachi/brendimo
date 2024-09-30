// Submit the new product data to Google Sheets
document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const productData = {
        malAdi: formData.get('malAdi'),
        xerc: formData.get('xerc'),
        satisQiymeti: formData.get('satisQiymeti'),
        anbarMiqdari: formData.get('anbarMiqdari')
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwsSdY5BztAzoO0z4Ex9lNPSu5IIxTZ1YNOeLwvuUYtR-sIFNd0CGdGzLRyh8iUYCM/exec?action=addProduct', {
            method: 'POST',
            body: JSON.stringify(productData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Məhsul uğurla əlavə edildi!');
            document.getElementById('productForm').reset();  // Reset the form
        } else {
            alert('Xəta baş verdi! Məhsul əlavə edilə bilmədi.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Xəta baş verdi!');
    }
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}
