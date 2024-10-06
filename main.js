// Three.js solar system orrery setup (as explained in previous responses)
function addOrrery() {
    // Initialization, camera, renderer, controls code here...
}

// Fetch comet data from NASA's API
async function fetchNASAData() {
    const response = await fetch('https://data.nasa.gov/resource/b67r-rgxc.json');
    const data = await response.json();
    populateCometTable(data);
}

function populateCometTable(comets) {
    const cometList = document.getElementById('comet-list');
    comets.forEach(comet => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comet.name}</td>
            <td>${comet.object_number}</td>
            <td>${comet.distance_from_earth}</td>
            <td>${comet.orbital_period}</td>
        `;
        cometList.appendChild(row);
    });
}

addOrrery();  // Add the solar system orrery
fetchNASAData();  // Fetch and populate comet data
