let map, marker, pickerMap, pickerMarker, tempCoords = null;

const locationData = {
    "Agordo": ["Bries", "Brugnach", "Parech", "Prompicai", "Rif", "Toccol", "Valcozzena"],
    "Alpago": ["Bastia", "Cornei", "Farra", "Garna", "Pieve", "Puos", "Sitran", "Tignes", "Torres", "Villa"],
    "Arsiè": ["Fastro", "Incino", "Mellame", "Rocca", "Rivai", "San Vito"],
    "Auronzo di Cadore": ["Misurina", "Reane", "San Marco", "Villapiccola", "Villagrande"],
    "Belluno": ["Antole", "Bolzano Bellunese", "Castion", "Cavessago", "Cet", "Chiesurazza", "Faverga", "Fiammoi", "Giamosa", "Giazzoi", "Levego", "Madeago", "Mier", "Nevegal", "Orzes", "Pedeserva", "Pra de Lante", "Rivamaor", "Sagrogna", "Sala", "Salce", "San Pietro in Campo", "Sopracroda", "Sois", "Sossai", "Tisoi", "Vezzano", "Vignole", "Visome"],
    "Borgo Valbelluna": ["Mel", "Trichiana", "Lentiai", "Carve", "Cesana", "Col di Mel", "Confos", "Farra", "Marcador", "Morgan", "Nave", "Pellegai", "Ronchena", "Sant'Antonio Tortal", "Stabie", "Villa di Villa"],
    "Cesiomaggiore": ["Alivie", "Busche", "Cesiola", "Col San Vito", "Cullagne", "Dorgnan", "Marsiai", "Menin", "Molinello", "Montagne", "Morzanch", "Nezze", "Pez", "Pullir", "Soranzen", "Toschian"],
    "Cortina d'Ampezzo": ["Acquabona", "Alverà", "Campo di Sopra", "Chiave", "Col", "Grava", "Mortisa", "Pecol", "Socol", "Verocai", "Zuel"],
    "Feltre": ["Anzù", "Arson", "Canal di Limana", "Cart", "Fastro", "Foen", "Lasen", "Mugnai", "Nemeggio", "Pont", "Pren", "Tomo", "Umin", "Vellai", "Vignui", "Villabruna", "Villapaiera", "Zermen"],
    "Limana": ["Canè", "Cesa", "Coi di Navasa", "Dussoi", "Polentes", "Valmorel", "Triches"],
    "Longarone": ["Castellavazzo", "Codissago", "Fortogna", "Igne", "Pirago", "Rivalta", "Roggia"],
    "Pedavena": ["Facen", "Murle", "Norcen", "Teven", "Travagola"],
    "Pieve di Cadore": ["Nebbiù", "Pozzale", "Sottocastello", "Tai di Cadore"],
    "Ponte nelle Alpi": ["Cadola", "Canevoi", "Casan", "Col di Cugnan", "Cornolade", "Cugnan", "Lastreghe", "Paiane", "Polpet", "Quantin", "Revelin", "Roncan", "Soccher"],
    "Quero Vas": ["Caorera", "Carpen", "Quero", "Santa Maria", "Schievenin", "Vas"],
    "Santa Giustina": ["Cergnai", "Formegan", "Meano", "Ignan", "Sartena"],
    "Sedico": ["Bribano", "Libano", "Roe Alte", "Roe Basse", "Mas", "Peron", "Seghe di Villa", "Gresane"],
    "Sospirolo": ["Gron", "Maras", "Mis", "Oregne", "Pascoli", "San Gottardo"],
    "Sovramonte": ["Aune", "Faller", "Molinello", "Moline", "Servo", "Sorriva", "Zorzoi"],
    "Val di Zoldo": ["Forno", "Dont", "Fusine", "Mareson", "Pecol", "Pieve", "Coi"]
};

const categoryData = {
    "pubblici": ["Aree verdi e Parchi", "Piazze e Spazi pedonali", "Sport all'aperto", "Sosta informale"],
    "aggregazione": ["Hub creativi e Co-working", "Biblioteche e Aule studio", "Spazi Associativi e Religiosi", "Centri Giovani Istituzionali"],
    "commerciali": ["Locali di Ristorazione", "Centri Commerciali", "Divertimento e Spettacolo", "Impianti Sportivi Privati"],
    "transito": ["Nodi di Trasporto", "Aree di Risulta e Parcheggi", "Luoghi Dismessi"]
};

// --- LOGICA DATI PERSONALI ---

function savePersonalData() {
    const n = document.getElementById('user-name').value;
    const e = document.getElementById('user-email').value;
    const d = document.getElementById('user-dob').value;

    if (!n || !e || !d) {
        return alert("Nome, Email e Data di Nascita sono obbligatori.");
    }

    const userData = { nome: n, email: e, nascita: d };
    localStorage.setItem('user_data', JSON.stringify(userData));
    showForm(n);
}

function showForm(nome) {
    document.getElementById('personal-section').classList.add('hidden');
    document.getElementById('place-form').classList.remove('hidden');
    document.getElementById('user-greeting').innerText = `Ciao ${nome}!`;
}

// --- LOGICA FORM ---

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

function toggleManagementName() {
    const val = document.getElementById('management').value;
    const nameInput = document.getElementById('management-name');
    nameInput.style.display = (val && val !== 'non_so') ? 'block' : 'none';
}

function addSocialField() {
    const container = document.getElementById('social-container');
    const rows = container.getElementsByClassName('social-row');
    if (rows.length < 5) {
        const newRow = document.createElement('div');
        newRow.className = 'social-row';
        newRow.style.marginTop = '8px';
        newRow.innerHTML = `<input type="url" class="social-link" placeholder="https://...">`;
        container.appendChild(newRow);
    }
    if (rows.length === 5) document.getElementById('add-social').style.display = 'none';
}

// --- MAPPA E PICKER ---

async function openMapPicker() {
    document.getElementById('map-picker-modal').style.display = 'flex';
    document.getElementById('map-picker-modal').classList.remove('hidden');
    if (!pickerMap) {
        pickerMap = L.map('picker-map').setView([46.14, 12.21], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(pickerMap);
        pickerMap.on('click', (e) => updatePickerMarker([e.latlng.lat, e.latlng.lng]));
    }
    setTimeout(() => pickerMap.invalidateSize(), 300);
}

function updatePickerMarker(latlng) {
    tempCoords = latlng;
    if (pickerMarker) pickerMarker.setLatLng(latlng);
    else pickerMarker = L.marker(latlng, {draggable: true}).addTo(pickerMap);
}

function confirmPicker() {
    if (tempCoords) {
        document.getElementById('manual-coords').value = JSON.stringify(tempCoords);
        document.getElementById('address').value = "Posizione impostata da mappa";
        closeMapPicker();
    }
}

function closeMapPicker() { 
    document.getElementById('map-picker-modal').classList.add('hidden');
    document.getElementById('map-picker-modal').style.display = 'none';
}

// --- INVIO FINALE ---

async function submitForm() {
    const form = document.getElementById('place-form');

    // Recupero ID per validazione manuale rapida
    const fields = {
        name: document.getElementById('place-name').value,
        city: document.getElementById('main-loc').value,
        sub: document.getElementById('sub-loc').value,
        addr: document.getElementById('address').value,
        macro: document.getElementById('macro-type').value,
        subt: document.getElementById('sub-type').value,
        mgmt: document.getElementById('management').value
    };

    // Controllo obbligatorietà
    if (!fields.name || !fields.city || !fields.sub || !fields.addr || !fields.macro || !fields.subt || !fields.mgmt) {
        alert("Compila tutti i campi obbligatori contrassegnati con *");
        return;
    }

    // Raccolta dati completa
    const finalData = {
        user: JSON.parse(localStorage.getItem('user_data')),
        place: {
            nome: fields.name,
            descrizione: document.getElementById('place-desc').value,
            comune: fields.city,
            localita: fields.sub === 'altro' ? document.getElementById('other-loc').value : fields.sub,
            indirizzo: fields.addr,
            categoria: fields.macro,
            sottocategoria: fields.subt === 'altro' ? document.getElementById('other-subtype').value : fields.subt,
            gestore_tipo: fields.mgmt === 'altro' ? document.getElementById('other-mgmt').value : fields.mgmt,
            gestore_nome: document.getElementById('management-name').value,
            social: Array.from(document.querySelectorAll('.social-link')).map(i => i.value).filter(v => v),
            coords: document.getElementById('manual-coords').value
        }
    };

    console.log("Dati inviati:", finalData);

    // Cambio Schermata
    document.getElementById('place-form').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');

    // Mappa Finale
    if (!map) {
        map = L.map('map').setView([46.14, 12.21], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    let latlng = [46.14, 12.21];
    if (finalData.place.coords) {
        latlng = JSON.parse(finalData.place.coords);
    } else {
        try {
            const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fields.addr + "," + fields.city)}`);
            const d = await r.json();
            if (d.length > 0) latlng = [d[0].lat, d[0].lon];
        } catch (e) {}
    }

    map.setView(latlng, 16);
    if (marker) marker.remove();
    marker = L.marker(latlng).addTo(map).bindPopup(`<b>${fields.name}</b>`).openPopup();
    setTimeout(() => map.invalidateSize(), 300);
}

function resetUser() {
    localStorage.removeItem('user_data');
    location.reload();
}

window.onload = () => {
    const sel = document.getElementById('main-loc');
    if (sel) {
        sel.innerHTML = '<option value="" disabled selected>Scegli Comune...</option>';
        Object.keys(locationData).sort().forEach(l => sel.innerHTML += `<option value="${l}">${l}</option>`);
    }
    const saved = localStorage.getItem('user_data');
    if (saved) {
        const d = JSON.parse(saved);
        document.getElementById('user-name').value = d.nome;
        document.getElementById('user-email').value = d.email;
        document.getElementById('user-dob').value = d.nascita;
        showForm(d.nome);
    }
};
