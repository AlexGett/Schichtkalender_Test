// --- AUTOMATISIERUNG DER FEIERTAGSBERECHNUNG ---

// Hilfsfunktion, um ein Datum als YYYY-MM-DD zu formatieren
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Osterberechnung mit dem Gauss-Algorithmus (Computus)
function calculateEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    // Gibt ein Datumsobjekt für den Ostersonntag zurück
    return new Date(year, month - 1, day);
}

// Zentralisierte Feiertagsnamen zur Wiederverwendung
const holidayNames = {
    neujahr: { de: 'Neujahr', en: 'New Year\'s Day', ru: 'Новый год', tr: 'Yılbaşı', sq: 'Viti i Ri', ar: 'رأس السنة', hr: 'Nova godina', sk: 'Nový rok' },
    heiligeDreiKoenige: { de: 'Heilige Drei Könige', en: 'Epiphany', ru: 'Богоявление', tr: 'Epifani', sq: 'Uji i Bekuar', ar: 'عيد الغطاس', hr: 'Sveta Tri kralja', sk: 'Zjavenie Pána' },
    karfreitag: { de: 'Karfreitag', en: 'Good Friday', ru: 'Страстная пятница', tr: 'Kutsal Cuma', sq: 'E Premtja e Madhe', ar: 'الجمعة العظيمة', hr: 'Veliki petak', sk: 'Veľký piatok' },
    ostersonntag: { de: 'Ostersonntag', en: 'Easter Sunday', ru: 'Пасха', tr: 'Paskalya Pazarı', sq: 'E Diela e Pashkëve', ar: 'أحد الفصح', hr: 'Uskrsna nedeľa', sk: 'Veľkonočná nedeľa' },
    ostermontag: { de: 'Ostermontag', en: 'Easter Monday', ru: 'Пасхальный понедельник', tr: 'Paskalya Pazartesi', sq: 'E Hëna e Pashkëve', ar: 'اثنين الفصح', hr: 'Uskrsni ponedjeljak', sk: 'Veľkonočný pondelok' },
    tagDerArbeit: { de: 'Tag der Arbeit', en: 'Labour Day', ru: 'День труда', tr: 'İşçi Bayramı', sq: 'Dita e Punës', ar: 'عيد العمال', hr: 'Praznik rada', sk: 'Sviatok práce' },
    christiHimmelfahrt: { de: 'Christi Himmelfahrt', en: 'Ascension Day', ru: 'Вознесение Господне', tr: 'İsa\'nın Göğe Yükselişi', sq: 'Dita e Ngritjes së Krishtit', ar: 'عيد الصعود', hr: 'Uzašašće', sk: 'Nanebovstúpenie Pána' },
    pfingstsonntag: { de: 'Pfingstsonntag', en: 'Pentecost Sunday', ru: 'Пятидесятница', tr: 'Pentekost Pazarı', sq: 'E Diela e Rrëshajëve', ar: 'أحد العنصرة', hr: 'Duhovi', sk: 'Turíce' },
    pfingstmontag: { de: 'Pfingstmontag', en: 'Pentecost Monday', ru: 'Понедельник Пятидесятницы', tr: 'Pentekost Pazartesi', sq: 'E Hëna e Pashkëve', ar: 'اثنين العنصرة', hr: 'Duhovski ponedjeljak', sk: 'Turíčny pondelok' },
    fronleichnam: { de: 'Fronleichnam', en: 'Corpus Christi', ru: 'Празdник Тела и Крови Христовых', tr: 'Katolik Yortusu', sq: 'Corpus Christi', ar: 'عيد القربان', hr: 'Tijelovo', sk: 'Božie Telo' },
    mariaeHimmelfahrt: { de: 'Mariä Himmelfahrt', en: 'Assumption Day', ru: 'Успение Пресвятой Богородицы', tr: 'Meryem\'in Göğe Kabulü', sq: 'Fjetja e Shën Mërisë', ar: 'عيد انتقال العذراء', hr: 'Velika Gospa', sk: 'Nanebovzatie Panny Márie' },
    tagDerDeutschenEinheit: { de: 'Tag der Deutschen Einheit', en: 'German Unity Day', ru: 'День герmanского единства', tr: 'Alman Birliği Günü', sq: 'Dita e Bashkimit Gjerman', ar: 'يوم الوحدة الألمانية', hr: 'Dan njemačkog jedinstwa', sk: 'Deň nemeckej jednoty' },
    allerheiligen: { de: 'Allerheiligen', en: 'All Saints\' Day', ru: 'День всех святых', tr: 'Azizler Günü', sq: 'Dita e të Gjithë Shenjtorëve', ar: 'عيد جميع القديسين', hr: 'Svi Sveti', sk: 'Sviatok Všetkých svätých' },
    heiligabend: { de: 'Heiligabend', en: 'Christmas Eve', ru: 'Сочельник', tr: 'Noel Arifesi', sq: 'Nata e Krishtlindjes', ar: 'ليلة عيد الميلاد', hr: 'Badnjak', sk: 'Štedrý deň' },
    weihnachtstag1: { de: '1. Weihnachtstag', en: 'Christmas Day', ru: 'Рождество', tr: 'Noel', sq: 'Dita e Parë e Krishtlindjes', ar: 'عيد الميلاد الأول', hr: 'Božić', sk: 'Prvý sviatok vianočný' },
    weihnachtstag2: { de: '2. Weihnachtstag', en: 'St. Stephen\'s Day', ru: 'Второй день Рождества', tr: 'Noel\'in Икиии Günü', sq: 'Dita e Dytë e Krishtlindjes', ar: 'عيد الميلاد الثاني', hr: 'Sveti Stjepan', sk: 'Druhý sviatok vianočný' },
    silvester: { de: 'Silvester', en: 'New Year\'s Eve', ru: 'Новый год', tr: 'Yılbaşı Gecesi', sq: 'Nata e Vitit të Ri', ar: 'ليلة رأس السنة', hr: 'Stara godina', sk: 'Silvester' }
};

// Generiert alle Feiertage für ein bestimmtes Jahr
function getHolidaysForYear(year) {
    const easterSunday = calculateEaster(year);
    const holidays = [];

    const addHoliday = (date, names) => {
        holidays.push({ date: formatDate(date), names });
    };

    // Feiertage mit festem Datum
    addHoliday(new Date(year, 0, 1), holidayNames.neujahr);
    addHoliday(new Date(year, 0, 6), holidayNames.heiligeDreiKoenige);
    addHoliday(new Date(year, 4, 1), holidayNames.tagDerArbeit);
    addHoliday(new Date(year, 7, 15), holidayNames.mariaeHimmelfahrt);
    addHoliday(new Date(year, 9, 3), holidayNames.tagDerDeutschenEinheit);
    addHoliday(new Date(year, 10, 1), holidayNames.allerheiligen);
    addHoliday(new Date(year, 11, 24), holidayNames.heiligabend);
    addHoliday(new Date(year, 11, 25), holidayNames.weihnachtstag1);
    addHoliday(new Date(year, 11, 26), holidayNames.weihnachtstag2);
    addHoliday(new Date(year, 11, 31), holidayNames.silvester);

    // Feiertage, die vom Osterdatum abhängen
    const addEasterRelativeHoliday = (offset, names) => {
        const date = new Date(easterSunday);
        date.setDate(date.getDate() + offset);
        addHoliday(date, names);
    };

    addEasterRelativeHoliday(-2, holidayNames.karfreitag);       // Karfreitag
    addEasterRelativeHoliday(0, holidayNames.ostersonntag);      // Ostersonntag
    addEasterRelativeHoliday(1, holidayNames.ostermontag);       // Ostermontag
    addEasterRelativeHoliday(39, holidayNames.christiHimmelfahrt); // Christi Himmelfahrt
    addEasterRelativeHoliday(49, holidayNames.pfingstsonntag);   // Pfingstsonntag
    addEasterRelativeHoliday(50, holidayNames.pfingstmontag);    // Pfingstmontag
    addEasterRelativeHoliday(60, holidayNames.fronleichnam);     // Fronleichnam

    return holidays;
}

// Funktion zur Berechnung des Buß- und Bettags
function getBußUndBettag(year) {
    // Der Buß- und Bettag ist der Mittwoch vor dem 23. November
    let date = new Date(year, 10, 22); // 22. November
    while (date.getDay() !== 3) { // 3 steht für Mittwoch
        date.setDate(date.getDate() - 1);
    }
    return `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

let currentCalendarYear = parseInt(localStorage.getItem('currentCalendarYear')) || new Date().getFullYear();
let notesData = JSON.parse(localStorage.getItem('calendarNotes')) || {};
let vacationData = JSON.parse(localStorage.getItem('calendarVacations')) || {};

// Stellt sicher, dass die Notiz für den Buß- und Bettag für das aktuelle Jahr existiert.
function ensureBussUndBettagNote(year) {
    const bussUndBettagDate = getBußUndBettag(year);
    if (!notesData[bussUndBettagDate]) {
        notesData[bussUndBettagDate] = 'Buß- und Bettag';
    }
}

// NEUE KONSTANTEN FÜR GITHUB-DATEN
const GITHUB_USERNAME = 'alexgett'; // Passe dies an deinen GitHub-Benutzernamen an
const GITHUB_REPO_NAME = 'Schichtkalender-pwa'; // Passe dies an den Namen deines GitHub-Repositorys an
const INFO_FOLDER_PATH = 'info_data'; // Der neue Ordner für deine PDFs und Bilder

// Symbolisches Passwort für das Schichtsystem
const SHIFT_SYSTEM_PASSWORD = ""; // Passwortprüfung ist jetzt deaktiviert

// --- BENUTZERDEFINIERTES SCHICHTSYSTEM ---
// Schichttypen und ihre CSS-Klassen
const SHIFT_TYPES = {
    'F': 'fruehschicht',
    'N': 'nachtschicht',
    'S': 'spaetschicht',
    'Frei': 'freischicht',
    'Früh': 'fruehschicht', // Alternative Bezeichnungen für bessere UX
    'Nacht': 'nachtschicht',
    'Spät': 'spaetschicht'
};

// Laden des benutzerdefinierten Schichtsystems aus dem localStorage
let customShiftSystem = JSON.parse(localStorage.getItem('customShiftSystem')) || {
    sequence: [],
    referenceStartDate: null,
    referenceShiftType: null
};

// Standard-Schichtsystem, falls kein benutzerdefiniertes gesetzt ist
// (Dies ist ein Beispiel für ein 3-Schicht-System, falls der Benutzer noch nichts eingegeben hat)
const defaultShiftSystem = {
    sequence: ['fruehschicht', 'fruehschicht', 'fruehschicht', 'fruehschicht', 'fruehschicht', 'freischicht', 'freischicht', 'nachtschicht', 'nachtschicht', 'nachtschicht', 'nachtschicht', 'nachtschicht', 'freischicht', 'freischicht', 'spaetschicht', 'spaetschicht', 'spaetschicht', 'spaetschicht', 'spaetschicht', 'freischicht', 'freischicht'],
    // WICHTIG: Passe dieses Datum an einen bekannten Startpunkt an, z.B. einen Montag, an dem die erste Schicht des Zyklus war
    referenceStartDate: '2030-01-07', // Beispiel: Ein Montag
    referenceShiftType: 'nachtschicht' // Beispiel: Die Schicht, die am 2025-01-06 beginnt
};

// Überprüfen, ob ein benutzerdefiniertes System gültig ist, sonst Standard verwenden
function getActiveShiftSystem() {
    if (customShiftSystem.sequence.length > 0 && customShiftSystem.referenceStartDate && customShiftSystem.referenceShiftType) {
        // Validierung der benutzerdefinierten Schichtsequenz
        const validSequence = customShiftSystem.sequence.every(shift => Object.values(SHIFT_TYPES).includes(shift));
        const validReferenceType = Object.values(SHIFT_TYPES).includes(customShiftSystem.referenceShiftType);

        if (validSequence && validReferenceType) {
            return {
                sequence: customShiftSystem.sequence,
                referenceStartDate: new Date(customShiftSystem.referenceStartDate + 'T12:00:00Z'), // Wichtig: UTC für konsistente Datumsberechnung
                referenceShiftType: customShiftSystem.referenceShiftType
            };
        }
    }
    // Fallback zum Standard, wenn kein gültiges benutzerdefiniertes System vorhanden ist
    return {
        sequence: defaultShiftSystem.sequence,
        referenceStartDate: new Date(defaultShiftSystem.referenceStartDate + 'T12:00:00Z'),
        referenceShiftType: defaultShiftSystem.referenceShiftType
    };
}
// --- ENDE ANPASSUNG FÜR INDIVIDUELLES SCHICHTSYSTEM ---


function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}


function generateCalendar(year) {
    currentCalendarYear = year;
    localStorage.setItem('currentCalendarYear', year);
    document.getElementById('currentYearDisplay').textContent = year; // Aktualisiere die Jahresanzeige
    const monthGrid = document.querySelector('.month-grid');
    monthGrid.innerHTML = '';
    
    // Stelle sicher, dass die Buß- und Bettag-Notiz für das angezeigte Jahr vorhanden ist
    ensureBussUndBettagNote(year);

    // --- ANPASSUNG FÜR INDIVIDUELLES SCHICHTSYSTEM ---
    const activeSystem = getActiveShiftSystem();
    const shiftSequence = activeSystem.sequence;
    const referenceShiftStartDate = activeSystem.referenceStartDate;
    const referenceShiftType = activeSystem.referenceShiftType;

    // Finde den Index des Referenz-Schichttyps in der Sequenz
    const referenceShiftStartIndex = shiftSequence.indexOf(referenceShiftType);
    if (referenceShiftStartIndex === -1) {
        console.error(`Referenz-Schichttyp "${referenceShiftType}" nicht in der benutzerdefinierten Sequenz gefunden.`);
        // Fallback zur Standardsequenz, wenn der Referenztyp nicht in der benutzerdefinierten Sequenz ist
        // Dies sollte durch bessere Validierung bei der Eingabe verhindert werden.
    }
    // --- ENDE ANPASSUNG FÜR INDIVIDUELLES SCHICHTSYSTEM ---

    const orderedDayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const orderedDayIndices = [1, 2, 3, 4, 5, 6, 0];

    // Heutiges Datum für die Markierung einmalig abrufen (Performance-Optimierung)
    const todayDate = new Date();

    const CELL_WIDTH = 42;
    const CELL_HEIGHT = 42;
    const CELL_GAP = 4;

    const DAY_LABEL_WIDTH = 55;

    const MAX_COLUMNS_FOR_DATES = 6;
    const MAX_DATE_COLUMNS_WIDTH = (MAX_COLUMNS_FOR_DATES * CELL_WIDTH) + ((MAX_COLUMNS_FOR_DATES - 1) * CELL_GAP);

    const MONTH_CARD_WIDTH = DAY_LABEL_WIDTH + MAX_DATE_COLUMNS_WIDTH + (20 * 2);

    document.documentElement.style.setProperty('--cell-width', `${CELL_WIDTH}px`);
    document.documentElement.style.setProperty('--cell-height', `${CELL_HEIGHT}px`);
    document.documentElement.style.setProperty('--cell-height-kw', `${CELL_HEIGHT * 0.8}px`);
    document.documentElement.style.setProperty('--cell-gap', `${CELL_GAP}px`);
    document.documentElement.style.setProperty('--day-label-width', `${DAY_LABEL_WIDTH}px`);
    document.documentElement.style.setProperty('--month-card-width', `${MONTH_CARD_WIDTH}px`);
    document.documentElement.style.setProperty('--month-grid-gap', `30px`);

    const yearHolidays = getHolidaysForYear(year);

    for (let month = 0; month < 12; month++) {
        const monthCard = document.createElement('div');
        monthCard.classList.add('month-card');

        monthCard.innerHTML = `<div class="month-title">${new Date(year, month, 1).toLocaleString('de-DE', { month: 'long' }).toUpperCase()}</div>`;

        const weeksData = [];
        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayRelativePosition = (firstDayOfMonth.getDay() === 0) ? 6 : firstDayOfMonth.getDay() - 1;

        let currentWeek = [];

        for (let i = 0; i < firstDayRelativePosition; i++) {
            currentWeek.push({ day: '', classes: 'empty-cell', weekNumber: null });
        }

        for (let day = 1; day <= daysInMonth(year, month); day++) {
            const currentDate = new Date(year, month, day, 12, 0, 0); // 12 Uhr mittags, um DST-Probleme zu minimieren
            const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

            const currentFormattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const holiday = yearHolidays.find(h => h.date === currentFormattedDate);
            const isVacation = vacationData[currentFormattedDate];

            let classes = [];
            let holidayNames = {};

            // Überprüfen, ob es der heutige Tag ist
            if (year === todayDate.getFullYear() && month === todayDate.getMonth() && day === todayDate.getDate()) {
                classes.push('heute');
            }

            if (isVacation) {
                classes.push('urlaub');
            } else if (holiday) {
                classes.push('feiertag');
                holidayNames = holiday.names;
            } else {
                // --- ANPASSUNG FÜR INDIVIDUELLES SCHICHTSYSTEM FÜR ALLE TAGE ---
                const oneDay = 1000 * 60 * 60 * 24;
                const diffDays = Math.round((currentDate.getTime() - referenceShiftStartDate.getTime()) / oneDay);

                let shiftIndex = (referenceShiftStartIndex + diffDays) % shiftSequence.length;
                if (shiftIndex < 0) {
                    shiftIndex += shiftSequence.length;
                }
                const assignedShiftClass = shiftSequence[shiftIndex];

                if (assignedShiftClass === 'freischicht') {
                    // Wenn es ein Freischicht-Tag ist, prüfe, ob es ein Wochenende ist
                    if (dayOfWeek === 6) { // Samstag
                        classes.push('samstag');
                    } else if (dayOfWeek === 0) { // Sonntag
                        classes.push('sonntag');
                    } else {
                        // Wenn Freischicht und kein Wochenende, dann die Freischicht-Farbe
                        classes.push(assignedShiftClass);
                    }
                } else {
                    // Wenn es ein Arbeitstag ist (keine Freischicht), verwende immer die Schichtfarbe
                    classes.push(assignedShiftClass);
                }
                // --- ENDE ANPASSUNG FÜR INDIVIDUELLES SCHICHTSYSTEM FÜR ALLE TAGE ---
            }

            const weekNumber = getWeekNumber(currentDate);

            currentWeek.push({ day: day, classes: classes.join(' '), originalDayOfWeek: dayOfWeek, weekNumber: weekNumber, holidayNames: holidayNames, fullDate: currentFormattedDate });
        }

        // Fill up the last week if it's not full
        if (currentWeek.length % 7 !== 0) {
            while (currentWeek.length % 7 !== 0) {
                currentWeek.push({ day: '', classes: 'empty-cell', weekNumber: null, holidayNames: {}, fullDate: null });
            }
        }

        for (let i = 0; i < currentWeek.length; i += 7) {
            weeksData.push(currentWeek.slice(i, i + 7));
        }

        const weekNumbersContainer = document.createElement('div');
        weekNumbersContainer.classList.add('week-numbers-container');

        const kwLabelColumn = document.createElement('div');
        kwLabelColumn.classList.add('kw-label-column');
        kwLabelColumn.textContent = 'KW';
        weekNumbersContainer.appendChild(kwLabelColumn);

        const kwNumbersGrid = document.createElement('div');
        kwNumbersGrid.classList.add('kw-numbers-grid');

        const kwsInMonth = new Set();
        weeksData.forEach(week => {
            week.forEach(day => {
                if (day.weekNumber !== null) {
                    kwsInMonth.add(day.weekNumber);
                }
            });
        });

        let actualKWsInMonth = Array.from(kwsInMonth);

        actualKWsInMonth.sort((a, b) => {
            const isAHigh = a > 50;
            const isBHigh = b > 50;

            if (a === 1 && isBHigh) {
                return 1;
            }
            if (b === 1 && isAHigh) {
                return -1;
            }
            return a - b;
        });

        for (let col = 0; col < MAX_COLUMNS_FOR_DATES; col++) {
            const kwCell = document.createElement('div');
            kwCell.classList.add('kw-cell');
            if (actualKWsInMonth[col] !== undefined) {
                kwCell.textContent = actualKWsInMonth[col];
            } else {
                kwCell.classList.add('empty-kw');
            }
            kwNumbersGrid.appendChild(kwCell);
        }

        weekNumbersContainer.appendChild(kwNumbersGrid);
        monthCard.appendChild(weekNumbersContainer);

        const dayGridContainer = document.createElement('div');
        dayGridContainer.classList.add('day-grid-container');

        const dayLabelColumn = document.createElement('div');
        dayLabelColumn.classList.add('day-label-column');
        dayLabelColumn.style.width = `var(--day-label-width)`;
        orderedDayNames.forEach(name => {
            const label = document.createElement('div');
            label.classList.add('day-label');
            if (name === 'So') {
                label.classList.add('sunday');
            }
            label.textContent = name;
            dayLabelColumn.appendChild(label);
        });
        dayGridContainer.appendChild(dayLabelColumn);

        const dateColumnsContainer = document.createElement('div');
        dateColumnsContainer.classList.add('date-columns-container');
        dateColumnsContainer.style.width = `${MAX_DATE_COLUMNS_WIDTH}px`;

        weeksData.forEach(week => {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('day-column');

            orderedDayIndices.forEach(dayIndex => {
                const cellData = week.find(data => data.originalDayOfWeek === dayIndex);
                const dateCell = document.createElement('div');
                if (cellData && cellData.fullDate) {
                    dateCell.className = `date-cell ${cellData.classes}`;
                    dateCell.dataset.fullDate = cellData.fullDate;
                    dateCell.innerHTML = `<div class="day-number">${cellData.day}</div><div class="note-indicator"></div>`;

                    // Notiz direkt beim Generieren des Kalenders setzen
                    const noteText = notesData[cellData.fullDate];
                    if (noteText) {
                        dateCell.querySelector('.note-indicator').textContent = noteText;
                    }

                    if (Object.keys(cellData.holidayNames).length > 0) {
                        dateCell.dataset.holidayNames = JSON.stringify(cellData.holidayNames);
                    }
                } else {
                    dateCell.classList.add('date-cell', 'empty-cell');
                }
                columnDiv.appendChild(dateCell);
            });
            dateColumnsContainer.appendChild(columnDiv);
        });

        dayGridContainer.appendChild(dateColumnsContainer);
        monthCard.appendChild(dayGridContainer);
        monthGrid.appendChild(monthCard);
    }

    document.querySelectorAll('.date-cell').forEach(cell => {
        if (!cell.classList.contains('empty-cell')) {
            cell.addEventListener('click', function(event) {
                const holidayNamesJson = this.dataset.holidayNames;
                if (this.classList.contains('feiertag') && holidayNamesJson && (event.target === this || event.target.classList.contains('day-number'))) {
                    const holidayNames = JSON.parse(holidayNamesJson);
                    const holidayTranslationsDiv = document.getElementById('holidayTranslations');
                    holidayTranslationsDiv.innerHTML = '';

                    for (const langCode in holidayNames) {
                        const p = document.createElement('p');
                        p.textContent = `${langCode.toUpperCase()}: ${holidayNames[langCode]}`;
                        holidayTranslationsDiv.appendChild(p);
                    }
                    document.getElementById('holidayDialogOverlay').classList.add('active');
                } else {
                    openNoteDialog(this);
                }
            });
        }
    });
}

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Initialisierung bei DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Lade die gespeicherten Einstellungen für das benutzerdefinierte Schichtsystem
    const storedShiftSystem = localStorage.getItem('customShiftSystem');
    if (storedShiftSystem) {
        try {
            const parsedSystem = JSON.parse(storedShiftSystem);
            document.getElementById('customShiftSequence').value = parsedSystem.sequence_input || '';
            document.getElementById('customShiftStartDate').value = parsedSystem.referenceStartDate_input || '';
            document.getElementById('customShiftStartType').value = parsedSystem.referenceShiftType_input || '';
        } catch (e) {
            console.error('Fehler beim Parsen des gespeicherten Schichtsystems:', e);
            // Optional: Daten zurücksetzen, wenn sie ungültig sind
            localStorage.removeItem('customShiftSystem');
        }
    }

    // Event Listener für Speichern des benutzerdefinierten Schichtsystems
    const saveButton = document.getElementById('saveCustomShiftSystem');
    if (saveButton) { // Sicherstellen, dass das Element existiert
        saveButton.addEventListener('click', saveCustomShiftSystem);
    }
    
    // Event Listener für die Preset-Buttons (Standard, Gruppe A, Gruppe B)
    const btnStandard = document.getElementById('setStandardShiftSystem');
    if (btnStandard) {
        btnStandard.addEventListener('click', () => setShiftGroup('Standard'));
    }

    const btnGroupA = document.getElementById('setGroupAShiftSystem');
    if (btnGroupA) {
        btnGroupA.addEventListener('click', () => setShiftGroup('A'));
    }

    const btnGroupB = document.getElementById('setGroupBShiftSystem');
    if (btnGroupB) {
        btnGroupB.addEventListener('click', () => setShiftGroup('B'));
    }

    // NEUE FUNKTIONALITÄT FÜR DAS ÖFFNEN/SCHLIESSEN DES SCHICHTSYSTEM-BEREICHS MIT PASSWORT
    const openCustomShiftSystemButton = document.getElementById('openCustomShiftSystemSettings');
    const customShiftSystemSection = document.getElementById('customShiftSystemSection');

    if (openCustomShiftSystemButton && customShiftSystemSection) {
        openCustomShiftSystemButton.addEventListener('click', () => {
            if (customShiftSystemSection.style.display === 'none') {
                // Passworteingabe und -prüfung wurden entfernt
                customShiftSystemSection.style.display = 'block';
                openCustomShiftSystemButton.textContent = 'Eigenes Schichtsystem schließen';
            } else {
                customShiftSystemSection.style.display = 'none';
                openCustomShiftSystemButton.textContent = 'Eigenes Schichtsystem festlegen';
            }
        });
    }

    // Event Listener für Backup und Restore
    const backupButton = document.getElementById('backupSettingsButton');
    const restoreButton = document.getElementById('restoreSettingsButton');

    if (backupButton) {
        backupButton.addEventListener('click', backupSettings);
    }
    if (restoreButton) {
        restoreButton.addEventListener('click', restoreSettings);
    }


    generateCalendar(currentCalendarYear); // Initialer Kalenderaufbau

    registerServiceWorker(); // Service Worker mit Update-Funktion registrieren
});

// --- FUNKTIONEN FÜR BENUTZERDEFINIERTES SCHICHTSYSTEM ---
function saveCustomShiftSystem() {
    const sequenceInput = document.getElementById('customShiftSequence').value.trim();
    const startDateInput = document.getElementById('customShiftStartDate').value; //YYYY-MM-DD
    const startTypeInput = document.getElementById('customShiftStartType').value.trim();

    // Eingaben validieren
    if (!sequenceInput || !startDateInput || !startTypeInput) {
        alert('Bitte fülle alle Felder für das Schichtsystem aus.');
        return;
    }

    const sequenceArrayRaw = sequenceInput.split(',').map(s => s.trim().toLowerCase());
    const sequenceArray = sequenceArrayRaw.map(s => {
        if (s === 'f' || s === 'früh') return 'fruehschicht';
        if (s === 'n' || s === 'nacht') return 'nachtschicht';
        if (s === 's' || s === 'spät') return 'spaetschicht';
        if (s === 'frei') return 'freischicht';
        return null; // Ungültiger Typ
    }).filter(s => s !== null); // Entferne ungültige Einträge

    if (sequenceArray.length === 0 || sequenceArray.length !== sequenceArrayRaw.length) {
        alert('Ungültige Schichtsequenz. Bitte verwende F, N, S, Frei oder die vollen Bezeichnungen und trenne mit Kommas.');
        return;
    }

    let parsedStartType = null;
    const lowerStartType = startTypeInput.toLowerCase();
    if (lowerStartType === 'f' || lowerStartType === 'früh') parsedStartType = 'fruehschicht';
    else if (lowerStartType === 'n' || lowerStartType === 'nacht') parsedStartType = 'nachtschicht';
    else if (lowerStartType === 's' || lowerStartType === 'spät') parsedStartType = 'spaetschicht';
    else if (lowerStartType === 'frei') parsedStartType = 'freischicht';

    if (!parsedStartType) {
        alert('Ungültiger Startschicht-Typ. Bitte verwende Früh, Nacht, Spät oder Frei.');
        return;
    }

    if (!sequenceArray.includes(parsedStartType)) {
        alert(`Der Startschicht-Typ "${startTypeInput}" ist nicht in deiner definierten Sequenz enthalten.`);
        return;
    }

    // Speichere die Eingabewerte, um sie beim Laden wieder anzuzeigen
    customShiftSystem = {
        sequence: sequenceArray,
        referenceStartDate: startDateInput,
        referenceShiftType: parsedStartType,
        sequence_input: sequenceInput, // Speichere die Roh-Eingabe
        referenceStartDate_input: startDateInput, // Speichere die Roh-Eingabe
        referenceShiftType_input: startTypeInput // Speichere die Roh-Eingabe
    };

    localStorage.setItem('customShiftSystem', JSON.stringify(customShiftSystem));
    alert('Dein Schichtsystem wurde gespeichert und der Kalender wird aktualisiert.');
    generateCalendar(currentCalendarYear); // Kalender neu generieren
    document.getElementById('settingsDialogOverlay').classList.remove('active'); // Dialog schließen
}

// Funktion zum Einstellen der Gruppen A und B
function setShiftGroup(group) {
    let sequenceInput = "";
    let startDate = "";
    let startType = "";
    let startTypeInput = "";
    
    if (group === 'A') {
        sequenceInput = "N,N,N,N,N,Frei,Frei,S,S,S,S,S,S,Frei,F,F,F,F,F,Frei,Frei,N,N,N,N,N,Frei,Frei,S,S,S,S,S,Frei,Frei,F,F,F,F,F,F,N";
        startDate = "2030-01-07";
        startType = "nachtschicht";
        startTypeInput = "Nacht";
    } else if (group === 'B') {
        sequenceInput = "N,N,N,N,N,Frei,Frei,S,S,S,S,S,S,Frei,F,F,F,F,F,Frei,Frei,N,N,N,N,N,Frei,Frei,S,S,S,S,S,Frei,Frei,F,F,F,F,F,F,N";
        startDate = "2030-01-28";
        startType = "nachtschicht";
        startTypeInput = "Nacht";
    } else if (group === 'Standard') {
        sequenceInput = "N,N,N,N,N,Frei,Frei,S,S,S,S,S,Frei,Frei,F,F,F,F,F,Frei,Frei";
        startDate = "2030-01-07";
        startType = "nachtschicht";
        startTypeInput = "Nacht";
    } else {
        return;
    }

    // Sequenz parsen
    const sequenceArrayRaw = sequenceInput.split(',').map(s => s.trim());
    const sequenceArray = sequenceArrayRaw.map(s => {
        const lower = s.toLowerCase();
        if (lower === 'f' || lower === 'früh') return 'fruehschicht';
        if (lower === 'n' || lower === 'nacht') return 'nachtschicht';
        if (lower === 's' || lower === 'spät') return 'spaetschicht';
        if (lower === 'frei') return 'freischicht';
        return 'freischicht'; // Fallback
    });

    const newCustomShiftSystem = {
        sequence: sequenceArray,
        referenceStartDate: startDate,
        referenceShiftType: startType,
        sequence_input: sequenceInput,
        referenceStartDate_input: startDate,
        referenceShiftType_input: startTypeInput
    };

    localStorage.setItem('customShiftSystem', JSON.stringify(newCustomShiftSystem));
    customShiftSystem = newCustomShiftSystem;

    // Update UI inputs
    document.getElementById('customShiftSequence').value = sequenceInput;
    document.getElementById('customShiftStartDate').value = startDate;
    document.getElementById('customShiftStartType').value = startTypeInput;

    alert(`Schichtsystem für Gruppe ${group} wurde eingestellt.`);
    generateCalendar(currentCalendarYear);
    document.getElementById('settingsDialogOverlay').classList.remove('active');
}
// --- ENDE FUNKTIONEN FÜR BENUTZERDEFINIERTES SCHICHTSYSTEM ---


const todayButton = document.getElementById('todayButton');
if (todayButton) {
    todayButton.addEventListener('click', () => {
        const today = new Date();
        const currentYear = today.getFullYear();

        if (currentYear !== currentCalendarYear) {
            generateCalendar(currentYear);
        }

        const todayMonth = today.getMonth();
        const monthCards = document.querySelectorAll('.month-card');
        if (monthCards[todayMonth]) {
            monthCards[todayMonth].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

function setupDialog(openBtnId, dialogOverlayId, closeBtnId) {
    const openBtn = openBtnId ? document.getElementById(openBtnId) : null;
    const dialogOverlay = document.getElementById(dialogOverlayId);
    const closeBtn = document.getElementById(closeBtnId);

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            dialogOverlay.classList.add('active');
            // Wenn der Info-Dialog geöffnet wird, Dateien laden
            if (dialogOverlayId === 'shiftInfoDialogOverlay') {
                loadInfoFiles();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            dialogOverlay.classList.remove('active');
        });
    }

    if (dialogOverlay) {
        dialogOverlay.addEventListener('click', (event) => {
            if (event.target === dialogOverlay) {
                dialogOverlay.classList.remove('active');
            }
        });
    }
}

setupDialog('openPhoneDialog', 'phoneDialogOverlay', 'closePhoneDialog');
setupDialog(null, 'holidayDialogOverlay', 'closeHolidayDialog');
setupDialog('openShiftInfoDialog', 'shiftInfoDialogOverlay', 'closeShiftInfoDialog');
setupDialog('openSettingsDialog', 'settingsDialogOverlay', 'closeSettingsDialog');


const settingsDialogOverlay = document.getElementById('settingsDialogOverlay');
const toggleAnimationsCheckbox = document.getElementById('toggleAnimations');
const borderColorPicker = document.getElementById('borderColorPicker');
const calendarContainer = document.getElementById('calendarContainer');
const toggleDarkModeCheckbox = document.getElementById('toggleDarkMode');
const toggleAutoDarkModeCheckbox = document.getElementById('toggleAutoDarkMode');

const savedAnimationState = localStorage.getItem('animationsDisabled');
if (savedAnimationState === 'true') {
    toggleAnimationsCheckbox.checked = true;
    calendarContainer.classList.add('no-animation');
} else {
    toggleAnimationsCheckbox.checked = false;
    calendarContainer.classList.remove('no-animation');
}

const savedBorderColor = localStorage.getItem('calendarBorderColor');
if (savedBorderColor) {
    borderColorPicker.value = savedBorderColor;
    document.documentElement.style.setProperty('--calendar-border-color', savedBorderColor);
} else {
    borderColorPicker.value = '#0161FD';
    document.documentElement.style.setProperty('--calendar-border-color', '#0161FD');
}

function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function updateDarkModeState() {
    const autoModeEnabled = localStorage.getItem('autoDarkModeEnabled') === 'true';
    const manualDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';

    toggleAutoDarkModeCheckbox.checked = autoModeEnabled;
    toggleDarkModeCheckbox.checked = manualDarkModeEnabled;
    toggleDarkModeCheckbox.disabled = autoModeEnabled;

    if (autoModeEnabled) {
        applyDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
        applyDarkMode(manualDarkModeEnabled);
    }
}

if (localStorage.getItem('autoDarkModeEnabled') === null) {
    localStorage.setItem('autoDarkModeEnabled', 'true');
}

updateDarkModeState();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('autoDarkModeEnabled') === 'true') {
        updateDarkModeState();
    }
});

toggleAnimationsCheckbox.addEventListener('change', () => {
    if (toggleAnimationsCheckbox.checked) {
        calendarContainer.classList.add('no-animation');
        localStorage.setItem('animationsDisabled', 'true');
    } else {
        calendarContainer.classList.remove('no-animation');
        localStorage.setItem('animationsDisabled', 'false');
    }
});

borderColorPicker.addEventListener('input', () => {
    const newColor = borderColorPicker.value;
    document.documentElement.style.setProperty('--calendar-border-color', newColor);
    localStorage.setItem('calendarBorderColor', newColor);
});

toggleAutoDarkModeCheckbox.addEventListener('change', () => {
    localStorage.setItem('autoDarkModeEnabled', toggleAutoDarkModeCheckbox.checked);
    updateDarkModeState();
});

toggleDarkModeCheckbox.addEventListener('change', () => {
    localStorage.setItem('darkModeEnabled', toggleDarkModeCheckbox.checked);
    updateDarkModeState();
});

const currentYearDisplay = document.getElementById('currentYearDisplay');
const yearInputDialogOverlay = document.getElementById('yearInputDialogOverlay');
const closeYearInputDialogBtn = document.getElementById('closeYearInputDialog');
const yearInput = document.getElementById('yearInput');
const setYearButton = document.getElementById('setYearButton');
const decreaseYearButton = document.getElementById('decreaseYear');
let increaseYearButton = document.getElementById('increaseYear');

currentYearDisplay.addEventListener('click', () => {
    yearInput.value = currentCalendarYear;
    yearInputDialogOverlay.classList.add('active');
});

closeYearInputDialogBtn.addEventListener('click', () => {
    yearInputDialogOverlay.classList.remove('active');
});

yearInputDialogOverlay.addEventListener('click', (event) => {
    if (event.target === yearInputDialogOverlay) {
        yearInputDialogOverlay.classList.remove('active');
    }
});

decreaseYearButton.addEventListener('click', () => {
    yearInput.value = parseInt(yearInput.value, 10) - 1;
});

increaseYearButton.addEventListener('click', () => {
    yearInput.value = parseInt(yearInput.value, 10) + 1;
});

setYearButton.addEventListener('click', () => {
    const newYear = parseInt(yearInput.value, 10);
    if (!isNaN(newYear) && newYear >= 1900 && newYear <= 2100) {
        generateCalendar(newYear);
        yearInputDialogOverlay.classList.remove('active');
    } else {
        alert('Bitte geben Sie ein gültiges Jahr zwischen 1900 und 2100 ein.');
    }
});

const noteDialogOverlay = document.getElementById('noteDialogOverlay');
const closeNoteDialogBtn = document.getElementById('closeNoteDialog');
const noteDialogTitle = document.getElementById('noteDialogTitle');
const noteInput = document.getElementById('noteInput');
const saveNoteButton = document.getElementById('saveNoteButton');
const deleteNoteButton = document.getElementById('deleteNoteButton');
const toggleVacationButton = document.getElementById('toggleVacationButton');

let currentDayCell = null;

function openNoteDialog(cell) {
    currentDayCell = cell;
    const fullDate = cell.dataset.fullDate;
    const dateParts = fullDate.split('-');
    const day = dateParts[2];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const year = dateParts[0];
    const monthName = new Date(year, monthIndex, 1).toLocaleString('de-DE', { month: 'long' });

    noteDialogTitle.textContent = `Notiz für den ${day}. ${monthName} ${year}`;
    noteInput.value = notesData[fullDate] || '';

    // Update vacation button text
    if (vacationData[fullDate]) {
        toggleVacationButton.textContent = 'Urlaub entfernen';
    } else {
        toggleVacationButton.textContent = 'Als Urlaub markieren';
    }

    noteDialogOverlay.classList.add('active');
}

closeNoteDialogBtn.addEventListener('click', () => {
    noteDialogOverlay.classList.remove('active');
});

noteDialogOverlay.addEventListener('click', (event) => {
    if (event.target === noteDialogOverlay) {
        noteDialogOverlay.classList.remove('active');
    }
});

saveNoteButton.addEventListener('click', () => {
    if (currentDayCell) {
        const fullDate = currentDayCell.dataset.fullDate;
        const note = noteInput.value.trim();

        if (note) {
            notesData[fullDate] = note;
            currentDayCell.querySelector('.note-indicator').textContent = note;
        } else {
            // Wenn die Notiz leer ist und es sich nicht um eine automatische Notiz handelt, lösche sie.
            // Ansonsten setze den Text auf den Standard ("Buß- und Bettag").
            if (notesData[fullDate] === 'Buß- und Bettag') {
                // Notiz des Buß- und Bettags kann nicht gelöscht werden, nur übertost werden
                // oder wenn sie leer ist, wieder auf den Standardwert zurückgesetzt werden.
                if (note === '') {
                    currentDayCell.querySelector('.note-indicator').textContent = 'Buß- und Bettag';
                } else {
                    currentDayCell.querySelector('.note-indicator').textContent = note;
                }
            } else {
                delete notesData[fullDate];
                currentDayCell.querySelector('.note-indicator').textContent = '';
            }
        }
        localStorage.setItem('calendarNotes', JSON.stringify(notesData));
        noteDialogOverlay.classList.remove('active');
    }
});

deleteNoteButton.addEventListener('click', () => {
    if (currentDayCell) {
        const fullDate = currentDayCell.dataset.fullDate;
        // Verhindere das Löschen der automatischen Buß- und Bettag Notiz
        if (notesData[fullDate] === 'Buß- und Bettag') {
            alert('Diese Notiz wird automatisch gesetzt und kann nicht direkt gelöscht werden. Du kannst sie aber überschreiben.');
            return;
        }
        delete notesData[fullDate];
        localStorage.setItem('calendarNotes', JSON.stringify(notesData));
        currentDayCell.querySelector('.note-indicator').textContent = '';
        noteInput.value = '';
        noteDialogOverlay.classList.remove('active');
    }
});

toggleVacationButton.addEventListener('click', () => {
    if (currentDayCell) {
        const fullDate = currentDayCell.dataset.fullDate;
        if (vacationData[fullDate]) {
            delete vacationData[fullDate];
        } else {
            vacationData[fullDate] = true;
        }
        localStorage.setItem('calendarVacations', JSON.stringify(vacationData));
        noteDialogOverlay.classList.remove('active');
        generateCalendar(currentCalendarYear); // Re-render to apply changes and ensure consistency
    }
});

// NEUE FUNKTIONEN FÜR DIE ANZEIGE VON INFODATEIEN
async function fetchInfoFiles() {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/contents/${INFO_FOLDER_PATH}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Der Ordner "${INFO_FOLDER_PATH}" wurde nicht gefunden. Bitte stelle sicher, dass er existiert und Dateien enthält.`);
                return [];
            }
            throw new Error(`GitHub API Fehler: ${response.statusText}`);
        }
        const data = await response.json();
        // Filtert nur Dateien und ignoriert Unterordner
        return data.filter(item => item.type === 'file');
    } catch (error) {
        console.error('Fehler beim Abrufen der Info-Dateien:', error);
        return [];
    }
}

async function loadInfoFiles() {
    const infoFilesList = document.getElementById('infoFilesList');
    infoFilesList.innerHTML = '<p class="loading-message">Lade Informationen...</p>'; // Ladeanzeige

    const files = await fetchInfoFiles();

    infoFilesList.innerHTML = ''; // Lösche die Ladeanzeige

    if (files.length === 0) {
        infoFilesList.innerHTML = '<p>Keine weiteren Informationen verfügbar.</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('info-files-ul');

    files.forEach(file => {
        const li = document.createElement('li');
        const fileLink = document.createElement('a');
        fileLink.href = file.download_url; // Direkter Link zur Datei
        fileLink.textContent = file.name;
        fileLink.target = '_blank'; // Öffnet Link in neuem Tab

        const fileIcon = document.createElement('i');
        const fileNameLower = file.name.toLowerCase();

        if (fileNameLower.endsWith('.pdf')) {
            fileIcon.classList.add('fas', 'fa-file-pdf');
            fileIcon.style.color = 'red';
        } else if (fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg') || fileNameLower.endsWith('.png') || fileNameLower.endsWith('.gif')) {
            fileIcon.classList.add('fas', 'fa-image');
            fileIcon.style.color = 'blue';
        } else {
            fileIcon.classList.add('fas', 'fa-file'); // Standard-Symbol für andere Dateitypen
        }
        fileIcon.classList.add('file-list-icon');
        
        li.appendChild(fileIcon);
        li.appendChild(fileLink);
        ul.appendChild(li);
    });
    infoFilesList.appendChild(ul);
}


// --- BACKUP UND RESTORE FUNKTIONEN ---

// Funktion zum Erstellen eines Backups der Einstellungen
function backupSettings() {
    // Sammle alle relevanten Daten aus dem localStorage
    const settingsToBackup = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Schließe keine sensiblen Daten oder große, irrelevante Caches aus,
        // hier nehmen wir alles, was wir gesetzt haben.
        if (key.startsWith('currentCalendarYear') || 
            key.startsWith('calendarNotes') ||
            key.startsWith('customShiftSystem') ||
            key.startsWith('animationsDisabled') ||
            key.startsWith('calendarBorderColor') ||
            key.startsWith('darkModeEnabled') ||
            key.startsWith('autoDarkModeEnabled') ||
            key.startsWith('calendarVacations')) {
            settingsToBackup[key] = localStorage.getItem(key);
        }
    }

    // Erstelle einen JSON-String
    const backupData = JSON.stringify(settingsToBackup, null, 2);

    // Erstelle ein Blob und einen Download-Link
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schichtkalender_backup_${new Date().toISOString().slice(0, 10)}.json`; // Dateiname mit Datum
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Gib den URL-Speicher frei
    alert('Backup erfolgreich erstellt! Datei wurde heruntergeladen.');
}

// Funktion zum Laden eines Backups der Einstellungen
function restoreSettings() {
    if (!confirm('Möchtest du wirklich ein Backup laden? Dies überschreibt alle aktuellen Kalendereinstellungen und Notizen!')) {
        return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // Akzeptiere nur JSON-Dateien

    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const loadedData = JSON.parse(event.target.result);

                // Lösche nur die relevanten alten Daten, nicht das gesamte localStorage
                ['currentCalendarYear', 'calendarNotes', 'customShiftSystem', 
                 'animationsDisabled', 'calendarBorderColor', 'darkModeEnabled', 'autoDarkModeEnabled', 'calendarVacations']
                 .forEach(key => localStorage.removeItem(key));

                // Lade die neuen Daten
                for (const key in loadedData) {
                    if (loadedData.hasOwnProperty(key)) {
                        localStorage.setItem(key, loadedData[key]);
                    }
                }

                // Aktualisiere globale Variablen und UI
                currentCalendarYear = parseInt(localStorage.getItem('currentCalendarYear')) || new Date().getFullYear();
                notesData = JSON.parse(localStorage.getItem('calendarNotes')) || {};
                vacationData = JSON.parse(localStorage.getItem('calendarVacations')) || {};
                customShiftSystem = JSON.parse(localStorage.getItem('customShiftSystem')) || { sequence: [], referenceStartDate: null, referenceShiftType: null };
                
                // Aktualisiere die UI-Elemente im Settings-Dialog sofort
                document.getElementById('toggleAnimations').checked = (localStorage.getItem('animationsDisabled') === 'true');
                document.getElementById('borderColorPicker').value = localStorage.getItem('calendarBorderColor') || '#0161FD';
                document.getElementById('toggleDarkMode').checked = (localStorage.getItem('darkModeEnabled') === 'true');
                document.getElementById('toggleAutoDarkMode').checked = (localStorage.getItem('autoDarkModeEnabled') === 'true');

                const parsedSystem = JSON.parse(localStorage.getItem('customShiftSystem'));
                document.getElementById('customShiftSequence').value = parsedSystem.sequence_input || '';
                document.getElementById('customShiftStartDate').value = parsedSystem.referenceStartDate_input || '';
                document.getElementById('customShiftStartType').value = parsedSystem.referenceShiftType_input || '';

                updateDarkModeState(); // Stelle sicher, dass der Dark Mode korrekt angewendet wird
                
                generateCalendar(currentCalendarYear); // Kalender neu rendern
                alert('Backup erfolgreich geladen! Der Kalender wurde aktualisiert.');
                document.getElementById('settingsDialogOverlay').classList.remove('active'); // Dialog schließen
            } catch (error) {
                console.error('Fehler beim Laden des Backups:', error);
                alert('Fehler beim Laden des Backups. Bitte stelle sicher, dass es eine gültige JSON-Datei ist.');
            }
        };
        reader.readAsText(file);
    };
    input.click(); // Öffne den Dateiauswahldialog
}

// --- SERVICE WORKER REGISTRIERUNG & UPDATE-LOGIK ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('Service Worker registriert mit Scope:', registration.scope);

                    registration.addEventListener('updatefound', () => {
                        // Eine neue Version des Service Workers wurde gefunden und wird installiert.
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            // Der Status des neuen Workers hat sich geändert.
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Der neue Worker ist installiert und wartet darauf, die Kontrolle zu übernehmen.
                                // Wir zeigen dem Benutzer jetzt die Benachrichtigung an.
                                const updateBanner = document.getElementById('update-banner');
                                if (updateBanner) updateBanner.style.display = 'flex';
                            }
                        });
                    });

                    const reloadButton = document.querySelector("#reload-button");
                    if (reloadButton) {
                        reloadButton.addEventListener('click', () => {
                            // Sende eine Nachricht an den wartenden Service Worker, damit er die Kontrolle übernimmt.
                            // Wir greifen direkt auf den 'waiting' worker der Registrierung zu.
                            if (registration.waiting) {
                                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                            }
                        });
                    }

                    // Lade die Seite neu, sobald der neue Service Worker die Kontrolle übernommen hat.
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        window.location.reload();
                    });
                })
                .catch(error => {
                    console.error('Service Worker Registrierung fehlgeschlagen:', error);
                });
        });
    }
}

// ===== PROFILVERWALTUNG =====
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: '',
    personalNummer: '',
    signature: null
};

const profileNameInput = document.getElementById('profileName');
const profilePersonalNrInput = document.getElementById('profilePersonalNummer');
const signatureCanvas = document.getElementById('signatureCanvas');
const clearSignatureButton = document.getElementById('clearSignatureButton');
const resetSignatureButton = document.getElementById('resetSignatureButton');
const saveProfileButton = document.getElementById('saveProfileButton');

let signatureCtx = null;
let isDrawing = false;

// Canvas für Unterschrift initialisieren
if (signatureCanvas) {
    signatureCtx = signatureCanvas.getContext('2d');
    signatureCtx.lineCap = 'round';
    signatureCtx.lineJoin = 'round';
    signatureCtx.lineWidth = 2;
    signatureCtx.strokeStyle = '#000';
    
    // Hintergrund weiß
    signatureCtx.fillStyle = '#fff';
    signatureCtx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    
    // Touch und Maus Events
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDrawing);
    signatureCanvas.addEventListener('mouseout', stopDrawing);
    
    // Touch Events
    signatureCanvas.addEventListener('touchstart', handleTouch);
    signatureCanvas.addEventListener('touchmove', handleTouch);
    signatureCanvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    signatureCtx.beginPath();
    signatureCtx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    signatureCtx.lineTo(x, y);
    signatureCtx.stroke();
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(
        e.type === 'touchstart' ? 'mousedown' : 'mousemove',
        {
            clientX: touch.clientX,
            clientY: touch.clientY
        }
    );
    signatureCanvas.dispatchEvent(mouseEvent);
}

function stopDrawing() {
    isDrawing = false;
    signatureCtx.closePath();
}

if (clearSignatureButton) {
    clearSignatureButton.addEventListener('click', () => {
        signatureCtx.fillStyle = '#fff';
        signatureCtx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    });
}

if (resetSignatureButton) {
    resetSignatureButton.addEventListener('click', () => {
        if (userProfile.signature) {
            signatureCtx.fillStyle = '#fff';
            signatureCtx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            userProfile.signature = null;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            alert('Unterschrift wurde zurückgesetzt!');
        }
    });
}

// Laden des gespeicherten Profils
function loadProfile() {
    if (profileNameInput) {
        profileNameInput.value = userProfile.name || '';
        profilePersonalNrInput.value = userProfile.personalNummer || '';
        if (userProfile.signature && signatureCtx) {
            const img = new Image();
            img.onload = () => {
                signatureCtx.drawImage(img, 0, 0);
            };
            img.src = userProfile.signature;
        }
    }
}

// Profil speichern
if (saveProfileButton) {
    saveProfileButton.addEventListener('click', () => {
        userProfile.name = profileNameInput.value.trim();
        userProfile.personalNummer = profilePersonalNrInput.value.trim();
        
        // Speichere die Unterschrift vom Canvas
        if (signatureCanvas) {
            userProfile.signature = signatureCanvas.toDataURL('image/png');
        }
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        alert('Profil erfolgreich gespeichert!');
    });
}

// ===== URLAUBSANTRAG-FUNKTIONALITÄT =====
const urlaubsantragButton = document.getElementById('urlaubsantragButton');
const urlaubsantragDialogOverlay = document.getElementById('urlaubsantragDialogOverlay');
const closeUrlaubsantragDialog = document.getElementById('closeUrlaubsantragDialog');
const generatePdfButton = document.getElementById('generatePdfButton');
const sendUrlaubsantragButton = document.getElementById('sendUrlaubsantragButton');

let urlaubsantragStartDate = null;

if (urlaubsantragButton) {
    urlaubsantragButton.addEventListener('click', () => {
        if (!currentDayCell) return;
        
        urlaubsantragStartDate = currentDayCell.dataset.fullDate;
        const dateInput = document.getElementById('urlaubsantrag_date_from');
        const nameInput = document.getElementById('urlaubsantrag_name');
        const personalnrInput = document.getElementById('urlaubsantrag_personalnummer');
        const signaturePreviewDiv = document.getElementById('urlaubsantrag_signature_preview');
        
        // Profildaten eintragen
        nameInput.value = userProfile.name || '';
        personalnrInput.value = userProfile.personalNummer || '';
        dateInput.value = urlaubsantragStartDate;
        document.getElementById('urlaubsantrag_date_to').value = '';
        document.getElementById('urlaubsantrag_grund').value = '';
        
        // Unterschrift anzeigen
        signaturePreviewDiv.innerHTML = '';
        if (userProfile.signature) {
            signaturePreviewDiv.innerHTML = `<img src="${userProfile.signature}" style="max-width: 250px; max-height: 100px; border: 2px solid #ddd; border-radius: 4px; padding: 5px; display: block;">`;
        } else {
            signaturePreviewDiv.innerHTML = '<p style="color: #999; text-align: center;">Keine Unterschrift vorhanden. Bitte in den Einstellungen zeichnen.</p>';
        }
        
        urlaubsantragDialogOverlay.classList.add('active');
        noteDialogOverlay.classList.remove('active');
    });
}

if (closeUrlaubsantragDialog) {
    closeUrlaubsantragDialog.addEventListener('click', () => {
        urlaubsantragDialogOverlay.classList.remove('active');
    });
    
    urlaubsantragDialogOverlay.addEventListener('click', (event) => {
        if (event.target === urlaubsantragDialogOverlay) {
            urlaubsantragDialogOverlay.classList.remove('active');
        }
    });
}

// PDF generieren
if (generatePdfButton) {
    generatePdfButton.addEventListener('click', () => {
        console.log('PDF-Button geklickt');
        try {
            generateUrlaubsantragPDF();
        } catch (error) {
            console.error('Fehler beim PDF-Generieren:', error);
            alert('Fehler beim Generieren der PDF: ' + error.message);
        }
    });
}

function generateUrlaubsantragPDF() {
    try {
        console.log('Starte PDF-Generierung...');
        
        const name = document.getElementById('urlaubsantrag_name').value;
        const personalnr = document.getElementById('urlaubsantrag_personalnummer').value;
        const dateFrom = document.getElementById('urlaubsantrag_date_from').value;
        const dateTo = document.getElementById('urlaubsantrag_date_to').value;
        const grund = document.getElementById('urlaubsantrag_grund').value;
        
        console.log('Name:', name, 'Von:', dateFrom, 'Bis:', dateTo);
        
        if (!dateTo) {
            alert('Bitte geben Sie ein Enddatum ein!');
            return;
        }
        
        // Hole alle Feiertage für das Jahr
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        const year = fromDate.getFullYear();
        const yearHolidays = getHolidaysForYear(year);
        
        // Konvertiere Feiertage in ein Set für schnelle Suche
        const holidayDates = new Set(yearHolidays.map(h => h.date));
        
        // Berechne nur die Arbeitstage (nicht die Freischichten laut Schichtmodell und keine Feiertage)
        let workingDays = 0;
        
        console.log('Berechne Arbeitstage von', fromDate, 'bis', toDate);
        
        for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
            const dateStr = formatDate(d);
            const shiftClass = getShiftForDate(dateStr);
            const isHoliday = holidayDates.has(dateStr);
            
            console.log(dateStr, '- Schicht:', shiftClass, ', Feiertag:', isHoliday);
            
            // Zähle nur Arbeitstage (nicht freischicht und keine Feiertage)
            if (shiftClass !== 'freischicht' && !isHoliday) {
                workingDays++;
            }
        }
        
        console.log('Gesamt Arbeitstage:', workingDays);
        
        // Logo als Data-URL
        const logoImg = document.querySelector('.logo');
        let logoDataUrl = '';
        if (logoImg && logoImg.src) {
            // Versuche das Logo zu laden und zu konvertieren
            const canvas = document.createElement('canvas');
            canvas.width = logoImg.naturalWidth || 150;
            canvas.height = logoImg.naturalHeight || 100;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(logoImg, 0, 0);
            logoDataUrl = canvas.toDataURL('image/png');
            console.log('Logo geladen');
        } else {
            console.log('Logo nicht gefunden');
        }
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 950px; margin: 0 auto; background-color: white; color: #000; position: relative;">
                
                <!-- Logo oben rechts -->
                ${logoDataUrl ? `<div style="position: absolute; top: 20px; right: 20px;">
                    <img src="${logoDataUrl}" style="max-width: 100px; max-height: 60px; object-fit: contain;">
                </div>` : ''}
                
                <div style="text-align: center; margin-bottom: 15px;">
                    <h2 style="margin: 0; font-size: 18px; font-weight: bold;">Urlaubsantrag / Abwesenheitsmeldung</h2>
                </div>
                
                <!-- Header-Zeile mit Name, Pers-Nr, Abteilung -->
                <div style="display: flex; gap: 30px; margin-bottom: 15px; font-size: 12px;">
                    <div style="flex: 1;">
                        <span style="font-weight: bold;">Name:</span>
                        <div style="border-bottom: 1px solid #000; height: 20px; padding-top: 2px;">${name}</div>
                    </div>
                    <div style="flex: 0.8;">
                        <span style="font-weight: bold;">Pers-Nr:</span>
                        <div style="border-bottom: 1px solid #000; height: 20px; padding-top: 2px;">${personalnr}</div>
                    </div>
                    <div style="flex: 1;">
                        <span style="font-weight: bold;">Kst./Abtlg:</span>
                        <div style="border-bottom: 1px solid #000; height: 20px; padding-top: 2px;"></div>
                    </div>
                </div>
                
                <!-- Urlaubszeile 1 -->
                <div style="border: 1px solid #000; margin-bottom: 3px; padding: 5px; font-size: 11px;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <label style="font-weight: bold; min-width: 80px;">Urlaub 1:</label>
                        <div style="display: flex; gap: 15px; flex: 1;">
                            <div style="flex: 0.6;">
                                <span>vom</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;">${formatGermanDate(dateFrom)}</div>
                            </div>
                            <div style="flex: 0.6;">
                                <span>bis</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;">${formatGermanDate(dateTo)}</div>
                            </div>
                            <div style="flex: 0.4;">
                                <span>Tage</span>
                                <div style="border-bottom: 1px solid #000; height: 18px; text-align: center;">${workingDays}</div>
                            </div>
                            <div style="flex: 0.8;">
                                <span>von bis Uhr</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.5;">
                                <span>Rest:</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Urlaubszeilen 2 & 3 (leer für weitere Urlaubsblöcke) -->
                <div style="border: 1px solid #000; margin-bottom: 3px; padding: 5px; font-size: 11px; min-height: 50px;">
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <label style="font-weight: bold; min-width: 80px;">Urlaub 2:</label>
                        <div style="display: flex; gap: 15px; flex: 1;">
                            <div style="flex: 0.6;">
                                <span>vom</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.6;">
                                <span>bis</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.4;">
                                <span>Tage</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.8;">
                                <span>von bis Uhr</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.5;">
                                <span>Rest:</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="border: 1px solid #000; margin-bottom: 10px; padding: 5px; font-size: 11px; min-height: 50px;">
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <label style="font-weight: bold; min-width: 80px;">Urlaub 3:</label>
                        <div style="display: flex; gap: 15px; flex: 1;">
                            <div style="flex: 0.6;">
                                <span>vom</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.6;">
                                <span>bis</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.4;">
                                <span>Tage</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.8;">
                                <span>von bis Uhr</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                            <div style="flex: 0.5;">
                                <span>Rest:</span>
                                <div style="border-bottom: 1px solid #000; height: 18px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Krankheit-Zeile -->
                <div style="border: 1px solid #000; margin-bottom: 10px; padding: 5px; font-size: 11px;">
                    <div style="margin-bottom: 8px;">
                        <span style="font-weight: bold;">7. Krank (41)</span>
                        <span style="margin-left: 30px; font-weight: bold;">Datum:</span>
                        <span style="border-bottom: 1px solid #000; display: inline-block; width: 150px; text-align: center;"></span>
                        <span style="margin-left: 20px;">abgemeldet um</span>
                        <span style="border-bottom: 1px solid #000; display: inline-block; width: 80px; text-align: center;"></span>
                        <span>Uhr. Schicht:</span>
                    </div>
                    <div>
                        <span style="font-weight: bold;">voraussichtliche Dauer:</span>
                        <span style="border-bottom: 1px solid #000; display: inline-block; width: 300px;"></span>
                    </div>
                </div>
                
                <!-- Grund/Bemerkung -->
                <div style="border: 1px solid #000; margin-bottom: 15px; padding: 8px; font-size: 11px; min-height: 70px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">Grund / Bemerkung zu 5., 6.:</div>
                    <div style="margin-bottom: 5px; padding: 3px; border-bottom: 1px solid #000; min-height: 60px; word-wrap: break-word; white-space: pre-wrap;">
${grund}
                    </div>
                    <div style="font-size: 10px; color: #666; margin-top: 5px;">(bei Umzug bitte Adresse, Tel. angeben)</div>
                    <div style="margin-top: 8px;">
                        <span style="font-weight: bold;">Arztbesuch am:</span>
                        <span>von</span>
                        <span style="border-bottom: 1px solid #000; display: inline-block; width: 60px; text-align: center;"></span>
                        <span>bis</span>
                        <span style="border-bottom: 1px solid #000; display: inline-block; width: 60px; text-align: center;"></span>
                        <span>Uhr</span>
                    </div>
                    <div style="margin-top: 15px; text-align: center; min-height: 40px; border-bottom: 1px solid #000;">
                        <span style="font-weight: bold; font-size: 10px;">Unterschrift / Stempel Arzt</span>
                    </div>
                </div>
                
                <!-- Unterschriften-Zeile -->
                <div style="margin-top: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border: none;">
                            <td style="width: 50%; padding: 10px; text-align: center; border: none;">
                                <div style="min-height: 60px; border-bottom: 2px solid #000; margin-bottom: 5px; display: flex; align-items: flex-end; justify-content: center;">
                                    ${userProfile.signature ? `<img src="${userProfile.signature}" style="max-width: 100%; max-height: 50px; object-fit: contain;">` : ''}
                                </div>
                                <div style="font-weight: bold; font-size: 11px;">Antragsteller/in: Unterschrift</div>
                            </td>
                            <td style="width: 50%; padding: 10px; text-align: center; border: none;">
                                <div style="min-height: 60px; border-bottom: 2px solid #000; margin-bottom: 5px;"></div>
                                <div style="font-weight: bold; font-size: 11px;">Vorgesetzter/in: Unterschrift</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; text-align: center; border: none; font-size: 10px;">
                                <span style="font-weight: bold;">Datum:</span>
                                <span>${new Date().toLocaleDateString('de-DE')}</span>
                            </td>
                            <td style="padding: 5px; text-align: center; border: none; font-size: 10px;">
                                <span style="font-weight: bold;">Datum:</span>
                                <span style="border-bottom: 1px solid #000; display: inline-block; width: 120px;"></span>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- Footer -->
                <div style="margin-top: 15px; font-size: 9px; text-align: center; color: #666;">
                    <p style="margin: 5px 0;">Generiert: ${new Date().toLocaleDateString('de-DE')} ${new Date().toLocaleTimeString('de-DE')}</p>
                </div>
            </div>
        `;
        
        console.log('HTML Content erstellt');
        
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        
        const opt = {
            margin: [8, 8, 8, 8],
            filename: `Urlaubsantrag_${name}_${formatGermanDate(dateFrom)}-${formatGermanDate(dateTo)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };
        
        console.log('Starte html2pdf...');
        
        if (typeof html2pdf === 'undefined') {
            throw new Error('html2pdf ist nicht geladen. Bitte überprüfen Sie die Bibliothek.');
        }
        
        html2pdf().set(opt).from(element).save().then(() => {
            console.log('PDF erfolgreich generiert');
            alert('PDF wurde generiert und gespeichert!');
        }).catch((error) => {
            console.error('PDF-Generierungsfehler:', error);
            alert('Fehler beim PDF-Generieren: ' + error.message);
        });
        
    } catch (error) {
        console.error('Fehler in generateUrlaubsantragPDF:', error);
        alert('Fehler beim Generieren der PDF: ' + error.message);
    }
}

// Hilfsfunktion: Abrufen der Schicht für ein bestimmtes Datum
function getShiftForDate(dateStr) {
    try {
        const activeShiftSystem = getActiveShiftSystem();
        const shiftSequence = activeShiftSystem.sequence;
        const referenceStartDate = activeShiftSystem.referenceStartDate;
        const referenceShiftType = activeShiftSystem.referenceShiftType;
        
        // Finde den Start-Index basierend auf dem Referenz-Shift-Type
        const referenceShiftIndex = shiftSequence.indexOf(referenceShiftType);
        if (referenceShiftIndex === -1) {
            console.error('Referenz-Schifttyp nicht in Sequenz gefunden:', referenceShiftType);
            return 'fruehschicht'; // Fallback
        }
        
        const targetDate = new Date(dateStr + 'T12:00:00Z');
        const oneDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.round((targetDate.getTime() - referenceStartDate.getTime()) / oneDay);
        
        let shiftIndex = (referenceShiftIndex + diffDays) % shiftSequence.length;
        if (shiftIndex < 0) {
            shiftIndex += shiftSequence.length;
        }
        
        return shiftSequence[shiftIndex];
    } catch (error) {
        console.error('Fehler in getShiftForDate:', error);
        return 'fruehschicht'; // Fallback bei Fehler
    }
}

function formatGermanDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// PDF versenden (E-Mail-Link)
if (sendUrlaubsantragButton) {
    sendUrlaubsantragButton.addEventListener('click', () => {
        const name = document.getElementById('urlaubsantrag_name').value;
        const personalnr = document.getElementById('urlaubsantrag_personalnummer').value;
        const dateFrom = document.getElementById('urlaubsantrag_date_from').value;
        const dateTo = document.getElementById('urlaubsantrag_date_to').value;
        const grund = document.getElementById('urlaubsantrag_grund').value;
        
        if (!dateTo) {
            alert('Bitte geben Sie ein Enddatum ein!');
            return;
        }
        
        const subject = encodeURIComponent(`Urlaubsantrag - ${name}`);
        const body = encodeURIComponent(
            `Urlaubsantrag\n\nName: ${name}\nPersonalnummer: ${personalnr}\n\nUrlaubszeitraum:\nVon: ${formatGermanDate(dateFrom)}\nBis: ${formatGermanDate(dateTo)}\n\nGrund: ${grund}\n\nBitte beachten Sie das angehängte PDF mit der Unterschrift.`
        );
        
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        
        alert('E-Mail-Programm wird geöffnet. Bitte fügen Sie die PDF-Datei manuell an.');
    });
}

// Profil beim Laden der Seite laden
console.log('Profil-Verwaltung und Urlaubsantrag initialisiert');
loadProfile();
