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
        // Check the productData structure before sending
        console.log("Sending product data:", productData);

        const response = await fetch('https://script.google.com/macros/s/AKfycbwVWYK8YY7zEqCD_7Ajm6ObALQXgJPirUR-XXG9Kt8FaNS9Er2igN82eSpv7Fjsxrc/exec?action=addProduct', {
            method: 'POST',
            body: JSON.stringify(productData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log("Response from server:", result);

        if (result.status === 'success') {
            alert('Məhsul uğurla əlavə edildi!');
            document.getElementById('productForm').reset();
        } else {
            console.error('Server returned an error:', result.message);
            alert('Xəta baş verdi: ' + result.message);  // Show the detailed server error
        }
    } catch (error) {
        console.error('Error in fetch request:', error);
        alert('Xəta baş verdi! Fetch error: ' + error.message);
    }
});
