let map, marker, pickerMap, pickerMarker, tempCoords = null;

const locationData = {
    "Belluno": ["Antole", "Castion", "Cavessago", "Nevegal", "Salce", "Tisoi"],
    "Feltre": ["Anzù", "Foen", "Mugnai", "Villabruna"],
    "Borgo Valbelluna": ["Mel", "Trichiana", "Lentiai"],
    "Sedico": ["Mas", "Bribano", "Roe Alte"]
};

const categoryData = {
    "pubblici": ["Aree verdi e Parchi", "Piazze e Spazi pedonali", "Sport all'aperto", "Sosta informale"],
    "aggregazione": ["Hub creativi e Co-working", "Biblioteche e Aule studio", "Spazi Associativi e Religiosi", "Centri Giovani Istituzionali"],
    "commerciali": ["Locali di Ristorazione", "Centri Commerciali", "Divertimento e Spettacolo", "Impianti Sportivi Privati"],
    "transito": ["Nodi di Trasporto", "Aree di Risulta e Parcheggi", "Luoghi Dismessi"]
};

function savePersonalData() {
    const n = document.getElementById('user-name').value;
    if (!n) return alert("Nome obbligatorio");
    localStorage.setItem('user_data', JSON.stringify({nome: n}));
    showForm(n);
}

function showForm(n) {
    document.getElementById('personal-section').classList.add('hidden');
    document.getElementById('place-form').classList.remove('hidden');
    document.getElementById('user-greeting').innerText = `Ciao ${n}!`;
}

function populateSubLocs() {
    const city = document.getElementById('main-loc').value;
    const subSel = document.getElementById('sub-loc');
    subSel.innerHTML = '<option value="" disabled selected>Scegli...</option>';
    if (locationData[city]) {
        locationData[city].forEach(s => subSel.innerHTML += `<option value="${s}">${s}</option>`);
        subSel.innerHTML += '<option value="altro">Altro...</option>';
        subSel.disabled = false;
        document.getElementById('address-section').classList.remove('hidden');
    }
}

function updateSubTypes() {
    const macro = document.getElementById('macro-type').value;
    const subSel = document.getElementById('sub-type');
    const container = document.getElementById('sub-type-container');
    subSel.innerHTML = '<option value="" disabled selected>Scegli dettaglio...</option>';
    if (categoryData[macro]) {
        categoryData[macro].forEach(t => subSel.innerHTML += `<option value="${t}">${t}</option>`);
        subSel.innerHTML += '<option value="altro">Altro...</option>';
        container.classList.remove('hidden');
    }
}

function toggleOther(select, inputId) {
    const target = document.getElementById(inputId);
    if(target) target.style.display = (select.value === "altro") ? "block" : "none";
}

async function openMapPicker() {
    document.getElementById('map-picker-modal').classList.remove('hidden');
    if (!pickerMap) {
        pickerMap = L.map('picker-map').setView([46.14, 12.21], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(pickerMap);
        pickerMap.on('click', (e) => updatePickerMarker([e.latlng.lat, e.latlng.lng]));
    }
    const city = document.getElementById('main-loc').value;
    if (city) {
        try {
            const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', Belluno')}`);
            const d = await r.json();
            if (d[0]) {
                const pos = [d[0].lat, d[0].lon];
                pickerMap.setView(pos, 14);
                updatePickerMarker(pos);
            }
        } catch (e) {}
    }
    setTimeout(() => pickerMap.invalidateSize(), 300);
}

function updatePickerMarker(latlng) {
    tempCoords = latlng;
    if (pickerMarker) pickerMarker.setLatLng(latlng);
    else {
        pickerMarker = L.marker(latlng, {draggable: true}).addTo(pickerMap);
        pickerMarker.on('dragend', (e) => {
            const p = e.target.getLatLng();
            tempCoords = [p.lat, p.lng];
        });
    }
}

function confirmPicker() {
    if (tempCoords) {
        document.getElementById('manual-coords').value = JSON.stringify(tempCoords);
        document.getElementById('address').value = "Posizione impostata da mappa";
        closeMapPicker();
    }
}

function closeMapPicker() { document.getElementById('map-picker-modal').classList.add('hidden'); }

async function submitForm() {
    document.getElementById('place-form').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
    if (!map) {
        map = L.map('map').setView([46.14, 12.21], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }
    let latlng = document.getElementById('manual-coords').value ? 
                 JSON.parse(document.getElementById('manual-coords').value) : [46.14, 12.21];
    map.setView(latlng, 16);
    if (marker) marker.remove();
    marker = L.marker(latlng, {draggable: false}).addTo(map);
    setTimeout(() => map.invalidateSize(), 300);
}

window.onload = () => {
    const sel = document.getElementById('main-loc');
    if (sel) {
        sel.innerHTML = '<option value="" disabled selected>Scegli Comune...</option>';
        Object.keys(locationData).sort().forEach(l => sel.innerHTML += `<option value="${l}">${l}</option>`);
    }
    const s = localStorage.getItem('user_data');
    if (s) showForm(JSON.parse(s).nome);
};