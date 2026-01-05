let map;
let provinceLayers = {};

async function fetchCrimeValue(province, crime, year) {
    let vector = VECTOR_MAP?.[province]?.[crime];

    if (!vector) {
        console.warn(`No vector for ${province} / ${crime}`);
        return null; // ⛔ STOP here
    }

    vector = vector.replace(/^v/, '');

    const res = await fetch(
        `http://localhost:3000/api/value?vector=${vector}&year=${year}`
    );

    const data = await res.json();
    return data?.value ?? null;
}

function onEachProvince(feature, layer) {
    const province = feature.properties.name;

    // ✅ Save reference
    provinceLayers[province] = layer;

    layer.on('click', async () => {
        await openProvincePopup(layer, province);
    });
}

async function openProvincePopup(layer, province) {
    const year = document.getElementById('yearSelect').value;
    const crime = document.getElementById('crimeSelect').value;

    const center = layer.getBounds().getCenter();

    if (!year || !crime) {
        layer.bindPopup(
            `<strong>${province}</strong><br>Select Year & Crime`
        ).openPopup(center);
        return;
    }

    try {
        const value = await fetchCrimeValue(province, crime, year);

        if (value === null) {
            layer.bindPopup(
                `<strong>${province}</strong><br>No data available`
            ).openPopup(center);
        } else {
            layer.bindPopup(`
                <strong>${province}</strong><br>
                ${crime} (${year}): <b>${value}</b>
            `).openPopup(center);
        }

    } catch {
        layer.bindPopup(
            `<strong>${province}</strong><br>Error loading data`
        ).openPopup(center);
    }
}

async function zoomToSelection() {
    const year = document.getElementById('yearSelect').value;
    const crime = document.getElementById('crimeSelect').value;
    const province = document.getElementById('provinceSelect').value;

    // Only act when ALL three are selected
    if (!year || !crime || !province) return;

    const layer = provinceLayers[province];
    if (!layer) {
        console.warn('Province layer not ready:', province);
        return;
    }

    // 🔥 Zoom into province
    map.fitBounds(layer.getBounds(), {
        padding: [40, 40],
        maxZoom: 6,
        animate: true
    });

    // 🔥 Open popup centered
    await openProvincePopup(layer, province);
}

function initMap() {
    map = L.map('map').setView([56, -96], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson')
        .then(res => res.json())
        .then(geo => {
            L.geoJSON(geo, {
                onEachFeature: onEachProvince
            }).addTo(map);
        })
        .catch(err => console.error('GeoJSON load failed:', err));
}

function populateFilters() {
    const years = [
        '2018', '2019', '2020',
        '2021', '2022', '2023', '2024'
    ];

    const crimes = [
        'Homicide',
        'Murder, first degree',
        'Murder, second degree',
        'Manslaughter',
        'Aggravated Sexual Assault',
        'Theft over $5k'
    ];

    const provinces = [
        'Ontario',
        'Quebec',
        'British Columbia',
        'Alberta',
        'Manitoba',
        'Saskatchewan',
        'Nova Scotia',
        'New Brunswick',
        'Newfoundland and Labrador',
        'Prince Edward Island',
        'Yukon Territory'
    ];

    fillSelect('yearSelect', years);
    fillSelect('crimeSelect', crimes);
    fillSelect('provinceSelect', provinces);
}

function fillSelect(id, values) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">Select</option>';

    values.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
    });
}

function init() {
    populateFilters(); // dropdowns FIRST
    initMap();         // map AFTER
}

document.addEventListener('DOMContentLoaded', init);
['yearSelect', 'crimeSelect', 'provinceSelect'].forEach(id => {
    document.getElementById(id).addEventListener('change', zoomToSelection);
});

