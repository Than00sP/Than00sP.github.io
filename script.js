let babyData = JSON.parse(localStorage.getItem('babyData')) || {}; // Load data from localStorage or initialize as empty

document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const babyname = document.getElementById('babyname').value;
    const weight = parseFloat(document.getElementById('decimalInput').value);
    const typeBirth = document.getElementById('typeBirth').value;
    const birthDateTime = new Date(document.getElementById('birthDateTime').value);
    const firstMilkTime = document.getElementById('firstMilkTime').value;

    const multipliers = typeBirth === 'Preterm' ? [60, 80, 100, 120, 150] : [65, 65, 80, 100, 120, 150, 170];
    const tableBody = document.getElementById('resultsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function getFeedingTimes(startTime) {
        const times = [];
        let currentTime = new Date(`1970-01-01T${startTime}:00`);
        for (let i = 0; i < 8; i++) {
            times.push(`${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`);
            currentTime.setHours(currentTime.getHours() + 3);
        }
        return times;
    }

    const feedingTimes = getFeedingTimes(firstMilkTime);
    let currentDate = new Date(birthDateTime);

    let babyTableData = [];

    multipliers.forEach((x, index) => {
        const result = (weight * x / 8).toFixed(2);
        for (let i = 0; i < feedingTimes.length; i++) {
            const row = document.createElement('tr');
            const dayCell = document.createElement('td');
            dayCell.textContent = index + 1;
            const resultCell = document.createElement('td');
            resultCell.textContent = result;
            const timeCell = document.createElement('td');
            timeCell.textContent = feedingTimes[i];
            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(currentDate);
            const ifbfCell = document.createElement('td'); // Blank column
            const milkTimeCell = document.createElement('td'); // Blank column
            const signatureCell = document.createElement('td'); // Blank column

            row.appendChild(dayCell);
            row.appendChild(resultCell);
            row.appendChild(timeCell);
            row.appendChild(dateCell);
            row.appendChild(ifbfCell);
            row.appendChild(milkTimeCell);
            row.appendChild(signatureCell);
            tableBody.appendChild(row);

            babyTableData.push({
                day: index + 1,
                amount: result,
                time: feedingTimes[i],
                date: formatDate(currentDate),
                ifbf: '',
                milkTime: '',
                signature: ''
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    });

    document.getElementById('babyNameDisplay').textContent = babyname;
    document.getElementById('birthDateTimeDisplay').textContent = formatDate(birthDateTime) + ' ' + birthDateTime.toTimeString().slice(0, 5);
    document.getElementById('typeBirthDisplay').textContent = typeBirth;
    document.getElementById('decimalInputDisplay').textContent = weight;

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('tableSection').style.display = 'block';

    babyData[babyname] = {
        birthDateTime: birthDateTime.toISOString(),
        typeBirth,
        weight,
        tableData: babyTableData
    };
    localStorage.setItem('babyData', JSON.stringify(babyData));
});

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('tableSection').style.display = 'none';
});

document.getElementById('saveButton').addEventListener('click', function() {
    // Save table as image
    html2canvas(document.getElementById('resultsTable')).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'table.png';
        link.click();
    });

    // Print the table
    window.print();
});
