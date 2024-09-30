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
        const response = await fetch('https://script.google.com/macros/s/AKfycbwhgQs5TUbxA_drzSOVZwR_MU11LGfCQV7ZGMG5cMwBwynvwnFq9bKs-M5E9sjd5w/exec?action=addProduct', {
            method: 'POST',
            body: JSON.stringify(productData),  // Ensure it's JSON formatted
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Məhsul uğurla əlavə edildi!');
            document.getElementById('productForm').reset();  // Reset the form
        } else {
            alert(`Xəta baş verdi! ${result.message}`);  // Show specific error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Xəta baş verdi!');
    }
});
