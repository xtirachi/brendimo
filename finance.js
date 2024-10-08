// Gündəlik maliyyə məlumatlarını gətirir
function fetchDailyData() {
  const selectedDate = document.getElementById('selectedDate').value;

  google.script.run.withSuccessHandler(function(data) {
    document.getElementById('leoBankBalance').textContent = data.balances.leoBank + ' AZN';
    document.getElementById('kapitalBankBalance').textContent = data.balances.kapitalBank + ' AZN';
    document.getElementById('investmentFundBalance').textContent = data.balances.investmentFund + ' AZN';
    document.getElementById('qutuBalance').textContent = data.balances.qutu + ' AZN';
    document.getElementById('bazarBalance').textContent = data.balances.bazar + ' AZN';
    document.getElementById('otherExpenses').textContent = data.otherExpenses + ' AZN';
    document.getElementById('cashInHand').textContent = data.cashInHand + ' AZN';
  }).getDailyData(selectedDate);
}

// Yeni əməliyyatı qeyd edir
function submitTransaction() {
  const formData = {
    transactionDate: document.getElementById('transactionDate').value,
    transactionType: document.getElementById('transactionType').value,
    transactionSource: document.getElementById('transactionSource').value,
    transactionAmount: document.getElementById('transactionAmount').value,
    transactionReason: document.getElementById('transactionReason').value
  };

  google.script.run.withSuccessHandler(function(response) {
    document.getElementById('statusMessage').textContent = response;
  }).logTransaction(formData);
}
