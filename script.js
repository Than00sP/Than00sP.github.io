document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const weight = parseFloat(document.getElementById('babyweight').value);
    const typeBirth = document.getElementById('typeBirth').value;

    const multipliers = typeBirth === 'Preterm' ? [60, 80, 100, 120, 150] : [65, 65, 80, 100, 120, 150, 170];
    const tableBody = document.getElementById('resultsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    multipliers.forEach((x, index) => {
        const dose = (weight * x / 8).toFixed(3);
        const dailyTotal = (dose * 8).toFixed(3);

        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = index + 1;
        const doseCell = document.createElement('td');
        doseCell.textContent = dose;
        const dailyTotalCell = document.createElement('td');
        dailyTotalCell.textContent = dailyTotal;

        row.appendChild(dayCell);
        row.appendChild(doseCell);
        row.appendChild(dailyTotalCell);
        tableBody.appendChild(row);
    });

    document.getElementById('babyweightDisplay').textContent = weight;
    document.getElementById('typeBirthDisplay').textContent = typeBirth;

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('tableSection').style.display = 'block';
});

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('tableSection').style.display = 'none';
});

document.getElementById('saveButton').addEventListener('click', function() {
    // Save table as image
    html2canvas(document.getElementById('tableSection')).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'table.png';
        link.click();
    });

    // Print the table
    window.print();
});
