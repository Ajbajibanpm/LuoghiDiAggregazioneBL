let map, marker, pickerMap, pickerMarker, tempCoords = null;

const locationData = {
    "Belluno": ["Antole", "Bolzano Bellunese", "Castion", "Cavessago", "Cet", "Chiesurazza", "Faverga", "Fiammoi", "Giamosa", "Giazzoi", "Levego", "Madeago", "Mier", "Nevegal", "Orzes", "Pedeserva", "Pra de Lante", "Rivamaor", "Sagrogna", "Sala", "Salce", "San Pietro in Campo", "Sopracroda", "Sois", "Sossai", "Tisoi", "Vezzano", "Vignole", "Visome"],
    "Feltre": ["Anzù", "Arson", "Canal di Limana", "Cart", "Fastro", "Foen", "Lasen", "Mugnai", "Nemeggio", "Pont", "Pren", "Tomo", "Umin", "Vellai", "Vignui", "Villabruna", "Villapaiera", "Zermen"],
    "Borgo Valbelluna": ["Mel", "Trichiana", "Lentiai", "Carve", "Cesana", "Col di Mel", "Confos", "Farra", "Marcador", "Morgan", "Nave", "Pellegai", "Ronchena", "Sant'Antonio Tortal", "Stabie", "Villa di Villa"],
    "Sedico": ["Bribano", "Libano", "Roe Alte", "Roe Basse", "Mas", "Peron", "Seghe di Villa", "Gresane"],
    "Alpago": ["Bastia", "Cornei", "Farra", "Garna", "Pieve", "Puos", "Sitran", "Tignes", "Torres", "Villa"],
    "Ponte nelle Alpi": ["Cadola", "Canevoi", "Casan", "Col di Cugnan", "Cornolade", "Cugnan", "Lastreghe", "Paiane", "Polpet", "Quantin", "Revelin", "Roncan", "Soccher"],
    "Cortina d'Ampezzo": ["Acquabona", "Alverà", "Campo di Sopra", "Chiave", "Col", "Grava", "Mortisa", "Pecol", "Socol", "Verocai", "Zuel"],
    "Agordo": ["Bries", "Brugnach", "Parech", "Prompicai", "Rif", "Toccol", "Valcozzena"],
    "Longarone": ["Castellavazzo", "Codissago", "Fortogna", "Igne", "Pirago", "Rivalta", "Roggia"],
    "Santa Giustina": ["Cergnai", "Formegan", "Meano", "Ignan", "Sartena"],
    "Limana": ["Canè", "Cesa", "Coi di Navasa", "Dussoi", "Polentes", "Valmorel", "Triches"],
    "Pieve di Cadore": ["Nebbiù", "Pozzale", "Sottocastello", "Tai di Cadore"],
    "Auronzo di Cadore": ["Misurina", "Reane", "San Marco", "Villapiccola", "Villagrande"],
    "Val di Zoldo": ["Forno", "Dont", "Fusine", "Mareson", "Pecol", "Pieve", "Coi"],
    "Cesiomaggiore": ["Alivie", "Busche", "Cesiola", "Col San Vito", "Cullagne", "Dorgnan", "Marsiai", "Menin", "Molinello", "Montagne", "Morzanch", "Nezze", "Pez", "Pullir", "Soranzen", "Toschian"],
    "Pedavena": ["Facen", "Murle", "Norcen", "Teven", "Travagola"],
    "Arsiè": ["Fastro", "Incino", "Mellame", "Rocca", "Rivai", "San Vito"],
    "Sospirolo": ["Gron", "Maras", "Mis", "Oregne", "Pascoli", "San Gottardo"],
    "Sovramonte": ["Aune", "Faller", "Molinello", "Moline", "Servo", "Sorriva", "Zorzoi"],
    "Quero Vas": ["Caorera", "Carpen", "Quero", "Santa Maria", "Schievenin", "Vas"]
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
