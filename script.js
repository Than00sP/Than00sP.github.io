let babyData = {}; // Object to store baby data

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

    // Function to format date to dd mm yyyy
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    // Function to get the feeding times
    function getFeedingTimes(startTime) {
        const times = [];
        let currentTime = new Date(`1970-01-01T${startTime}:00`); // Starting time of the first milk
        for (let i = 0; i < 8; i++) {
            times.push(`${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`);
            currentTime.setHours(currentTime.getHours() + 3); // Increment time by 3 hours
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
            const statusCell = document.createElement('td');
            statusCell.textContent = ''; // Blank cell for Status (IF/BF)
            const feedTimeCell = document.createElement('td');
            feedTimeCell.textContent = ''; // Blank cell for เวลาที่ให้นม
            const signCell = document.createElement('td');
            signCell.textContent = ''; // Blank cell for ลงชื่อ

            row.appendChild(dayCell);
            row.appendChild(resultCell);
            row.appendChild(timeCell);
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            row.appendChild(feedTimeCell);
            row.appendChild(signCell);
            tableBody.appendChild(row);

            babyTableData.push({
                day: index + 1,
                amount: result,
                time: feedingTimes[i],
                date: formatDate(currentDate),
                status: '', // Default empty value
                feedTime: '', // Default empty value
                sign: '' // Default empty value
            });

            // Update date if the next time passes 24:00
            let nextTime = feedingTimes[(i + 1) % feedingTimes.length];
            if (nextTime === "24:00" || nextTime === "00:00") {
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    });

    // Save data to babyData object
    babyData[babyname] = babyTableData;

    // Update baby list
    updateBabyList();

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('tableSection').style.display = 'block';
});

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('tableSection').style.display = 'none';
});

document.getElementById('submitButton').addEventListener('click', function() {
    const dataToSubmit = [];
    const tableRows = document.querySelectorAll('#resultsTable tbody tr');
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const data = {
            day: cells[0].textContent,
            amount: cells[1].textContent,
            time: cells[2].textContent,
            date: cells[3].textContent,
            status: cells[4].textContent,
            feedTime: cells[5].textContent,
            sign: cells[6].textContent
        };
        dataToSubmit.push(data);
    });

    const payload = {
        babyname: document.getElementById('babyname').value,
        birthDateTime: document.getElementById('birthDateTime').value,
        firstMilkTime: document.getElementById('firstMilkTime').value,
        typeBirth: document.getElementById('typeBirth').value,
        decimalInput: document.getElementById('decimalInput').value,
        data: dataToSubmit
    };

    fetch('https://script.google.com/macros/s/AKfycbwxrr9gY3hHl86SuG0uv8nQa0NJHnmqFYqzCzrqM0w4wWDuE-B--j9r9iwch5FHZK6o/exec', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => alert('Data submitted successfully'))
    .catch(error => console.error('Error!', error.message));
});

function updateBabyList() {
    const list = document.getElementById('babyList');
    list.innerHTML = '';
    for (const name in babyData) {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        listItem.addEventListener('click', () => displayBabyData(name));
        list.appendChild(listItem);
    }
}

function displayBabyData(name) {
    const tableBody = document.getElementById('resultsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    const babyTableData = babyData[name];
    babyTableData.forEach(data => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = data.day;
        const resultCell = document.createElement('td');
        resultCell.textContent = data.amount;
        const timeCell = document.createElement('td');
        timeCell.textContent = data.time;
        const dateCell = document.createElement('td');
        dateCell.textContent = data.date;
        const statusCell = document.createElement('td');
        statusCell.textContent = data.status;
        const feedTimeCell = document.createElement('td');
        feedTimeCell.textContent = data.feedTime;
        const signCell = document.createElement('td');
        signCell.textContent = data.sign;

        row.appendChild(dayCell);
        row.appendChild(resultCell);
        row.appendChild(timeCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        row.appendChild(feedTimeCell);
        row.appendChild(signCell);
        tableBody.appendChild(row);
    });

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('tableSection').style.display = 'block';
}
