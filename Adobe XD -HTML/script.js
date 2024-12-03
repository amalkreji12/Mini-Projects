// Authorization and Fetch
const username = 'coalition';
const password = 'skills-test';
const encodedAuth = btoa(`${username}:${password}`);

// Fetch Data
fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
    headers: {
        'Authorization': `Basic ${encodedAuth}`
    }
})
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        patientsList(data);
        populateUI(data);
    })
    .catch(error => console.error('Error fetching data:', error));


// Populate UI
function populateUI(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('No patient data found');
        return;
    }

    // Find Jessica Taylor in the data array
    const jessica = data.find(patient => patient.name === 'Jessica Taylor');
    //console.log('jessica :',jessica);

    if (!jessica) {
        console.error('Jessica Taylor not found in the patient data');
        return;
    }

    // Render the patient's data
    renderVitals(jessica);
    renderDiagnosisHistory(jessica.diagnosis_history);
    renderDiagnosticList(jessica.diagnostic_list);
    renderLabResults(jessica.lab_results);
    renderProfile(jessica);
}


// Render Vitals
function renderVitals(jessica) {
    const diagnosisHistory = jessica.diagnosis_history;
    const respiratoryRate = diagnosisHistory[0].respiratory_rate.value;
    const temperatureRate = diagnosisHistory[0].temperature.value;
    const heartRate = diagnosisHistory[0].heart_rate.value;
    //console.log(diagnosisHistory[0]);

    document.getElementById('respiratory-rate').textContent = `${respiratoryRate} bpm`;
    document.getElementById('temperature').textContent = `${temperatureRate}°F`;
    document.getElementById('heart-rate').textContent = `${heartRate} bpm`;

    document.getElementById('respiratory-rate-text').textContent = diagnosisHistory[0].respiratory_rate.levels;
    document.getElementById('temperature-rate-text').textContent = diagnosisHistory[0].temperature.levels;
    document.getElementById('heart-rate-text').textContent = diagnosisHistory[0].heart_rate.levels;
}

// Render Blood Pressure Chart
function renderDiagnosisHistory(history) {
    console.log(history);

    // Filter the history data to include only the desired months and years
    const filteredHistory = history.filter(item => {
        const month = item.month;
        const year = item.year;
        return (
            (year === 2023 && ["October", "November", "December"].includes(month)) ||
            (year === 2024 && ["January", "February", "March"].includes(month))
        );
    });

    // Check if filteredHistory is empty
    if (filteredHistory.length === 0) {
        console.error('No data available for the specified months and years');
        return;
    }

    const ctx = document.getElementById('bloodPressureChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredHistory.map(item => item.month + ' ' + item.year), // Format as 'Month Year'
            datasets: [
                {
                    label: 'Systolic',
                    data: filteredHistory.map(item => item.blood_pressure.systolic.value), // Extract systolic values
                    borderColor: '#FF6384',
                    tension: 0.4,
                },
                {
                    label: 'Diastolic',
                    data: filteredHistory.map(item => item.blood_pressure.diastolic.value), // Extract diastolic values
                    borderColor: '#36A2EB',
                    tension: 0.4,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: false, // Prevents the y-axis from starting at zero for better scale
                }
            }
        }
    });
}


// Render Diagnostic List
function renderDiagnosticList(list) {
    //console.log('list :',list);
    const tableBody = document.getElementById('diagnostic-table');
    list.forEach(item => {
        const row = `<tr>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.status}</td>
    </tr>`;
        tableBody.innerHTML += row;
    });
}

// Render Lab Results
function renderLabResults(results) {
    //console.log('results :',results);
    const labList = document.getElementById('lab-list');
    results.forEach(result => {
        const listItem = `<li class="list-group-item">
      <span>${result}</span>
      <a href="${result.link}" download>Download</a>
    </li>`;
        labList.innerHTML += listItem;
    });
}


//Render Patients List
function patientsList(data) {
    //console.log('patient list:',data);
    const patientsList = document.getElementById('patients-list');
    data.forEach(patient => {
        const listItem =
            `<li class="d-flex align-items-center mb-3">
        <img src="${patient.profile_picture}" alt=${patient.name} class="rounded-circle me-3" style="width:45px">
        <div class="patient-info">
            <h6 class="mb-1">${patient.name}</h6>
            <p class="mb-0">${patient.gender},${patient.age}</p>
        </div>
        </li>`;
        patientsList.innerHTML += listItem;
    })
}

//Render Profile Section

function renderProfile(data){
    console.log('Profile :',data);
    const profileSection = document.getElementById('profile-info');
    const profileImage = document.getElementById('profile-image');
    const image = 
    `<img src="${data.profile_picture}" alt="Profile Photo" class="img-fluid rounded-circle"
                        style="width: 150px; height: 150px;">`
    const profileItems = 
        `<p><strong>Name:</strong> ${data.name}</p>
        <p><strong>DOB:</strong> ${data.date_of_birth}</p>
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Contact:</strong> ${data.phone_number}</p>
        <p><strong>Emergency Contact:</strong> ${data.emergency_contact}</p>
        <p><strong>Provider:</strong> ${data.insurance_type}</p>` ;
        profileSection.innerHTML += profileItems;
        profileImage.innerHTML += image;
}