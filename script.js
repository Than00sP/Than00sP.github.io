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

            row.appendChild(dayCell);
            row.appendChild(resultCell);
            row.appendChild(timeCell);
            row.appendChild(dateCell);
            tableBody.appendChild(row);

            babyTableData.push({
                day: index + 1,
                amount: result,
                time: feedingTimes[i],
                date: formatDate(currentDate)
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

document.getElementById('saveButton').addEventListener('click', function() {
    // Save the table data (no image save required here)
    alert('Data has been saved.');
});

function updateBabyList() {
    const babyList = document.getElementById('babyList');
    babyList.innerHTML = '';

    for (const name in babyData) {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        listItem.addEventListener('click', function() {
            displayBabyData(name);
        });
        babyList.appendChild(listItem);
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

        row.appendChild(dayCell);
        row.appendChild(resultCell);
        row.appendChild(timeCell);
        row.appendChild(dateCell);
        tableBody.appendChild(row);
    });

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('tableSection').style.display = 'block';
}
