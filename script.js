document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const input = parseFloat(document.getElementById('decimalInput').value);
    const multipliers = [65, 65, 80, 100, 120, 150, 170];
    const tableBody = document.getElementById('resultsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    multipliers.forEach((x, index) => {
        const result = (input * x / 8).toFixed(2);
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        indexCell.textContent = index + 1;
        const resultCell = document.createElement('td');
        resultCell.textContent = result;
        row.appendChild(indexCell);
        row.appendChild(resultCell);
        tableBody.appendChild(row);
    });
});

document.getElementById('saveButton').addEventListener('click', function() {
    html2canvas(document.getElementById('resultsTable'), {
        onrendered: function(canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'table.png';
            link.click();
        }
    });
});
