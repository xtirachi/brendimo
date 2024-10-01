document.getElementById('summaryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Tarixləri seçin! (Please select the dates!)');
        return;
    }

    // Fetch the sales summary from Google Sheets via Google Apps Script
    fetch(`https://script.google.com/macros/s/AKfycbylGLwiFUTv1bkms2ghMJg3u-9AMh8hTAfinMmIJHfeGiO3Gnd8fcM5TZbb5WfwoVo/exec?action=getSalesSummary&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            // Populate the results
            document.getElementById('totalSalesCount').innerText = data.totalSalesCount;
            document.getElementById('totalSalesAmount').innerText = data.totalSalesAmount;
            document.getElementById('totalCost').innerText = data.totalCost;
            document.getElementById('totalProfit').innerText = data.totalProfit;

            const sourceSummary = document.getElementById('sourceSummary');
            sourceSummary.innerHTML = '';  // Clear previous data
            for (let source in data.salesBySource) {
                const sourceData = data.salesBySource[source];
                const sourceElement = document.createElement('p');
                sourceElement.innerHTML = `<strong>${source}:</strong> ${sourceData.count} satış, ${sourceData.amount} AZN`;
                sourceSummary.appendChild(sourceElement);
            }
        })
        .catch(error => {
            console.error('Error fetching summary:', error);
            alert('Xəta baş verdi. (An error occurred.)');
        });
});

// Navigation function
function navigate(page) {
    window.location.href = page;
}
