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
        console.log("Sending product data:", productData);  // Log product data before sending

        const response = await fetch('https://script.google.com/macros/s/AKfycbyzDp8qIcZrl-9vObGfW46ArDV_xDhY6Z9uLTzKIjCE8ucjwC4UrpNqOvvIGhnaeG4/exec?action=addProduct', {
            method: 'POST',
            body: JSON.stringify(productData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log("Response from server:", result);  // Log the server response

        if (result.status === 'success') {
            alert('Məhsul uğurla əlavə edildi!');
            document.getElementById('productForm').reset();  // Reset the form after success
        } else {
            console.error('Error from server:', result.message);
            alert('Xəta baş verdi: ' + result.message);  // Display error message returned by the server
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Xəta baş verdi! Fetch error: ' + error.message);
    }
});
