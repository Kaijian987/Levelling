
// ------------------ RESTORE ON LOAD ------------------
window.onload = function () {
    let storedData = localStorage.getItem("fieldbookData");
    if (storedData) {
        let tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
        let data = JSON.parse(storedData);

        data.forEach(rowData => {
            let newRow = tableBody.insertRow();
            rowData.forEach(cellData => {
                let newCell = newRow.insertCell();
                newCell.innerText = cellData;
            });
        });

        // Restore entryCount & lastRL
        if (tableBody.rows.length > 0) {
            let lastRowNo = parseInt(tableBody.rows[tableBody.rows.length - 1].cells[0].innerText);
            entryCount = isNaN(lastRowNo) ? 0 : lastRowNo;
            lastRL = parseFloat(tableBody.rows[tableBody.rows.length - 1].cells[4].innerText);
        }
    }
};

function saveTableToStorage() {
    let tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    let data = [];

    for (let row of tableBody.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.innerText);
        }
        data.push(rowData);
    }

    localStorage.setItem("fieldbookData", JSON.stringify(data));
}

// ------------------ GLOBAL VARS ------------------
document.getElementById("station").addEventListener("change", function () {
    addFirstRow();
});



let startstations = {
    "route1": 59.413,
    "route2": 59.413,
    "route3": 75.555,
    "route4": 71.601,
    "route5": 73.654
};


let reducedList = {
    "route1": [59.413, 60.095, 61.408, 62.264, 62.7, 63.501, 64.184, 64.384, 65.245, 66.478, 67.576, 69.204, 70.943, 72.423, 73.349, 74.98, 76.05, 75.551, 76.288, 75.619, 74.378, 73.416, 73.49, 75.104, 76.024, 76.66, 76.279, 75.554, 74.643, 73.654],
    "route2": [59.413, 60.095, 61.412, 60.041, 59.741, 59.481, 58.9, 58.395, 58.064, 59.021, 60.481, 61.223, 61.513, 61.857, 62.129, 62.425, 62.86, 63.311, 64.6, 65.982, 67.826, 68.916, 70.354, 73.612, 77.682, 81.691, 85.702, 89.784, 92.39, 90.88, 86.96, 82.873, 79.805, 77.402, 74.46],
    "route3":
        [
            75.555, 76.054, 74.985, 73.354, 72.429, 70.949, 69.211, 67.581,
            66.483, 65.243, 64.374, 64.183, 63.502, 62.701, 62.267, 61.415,
            60.040, 59.737, 59.478, 58.897, 58.395, 58.060, 59.016, 60.477,
            61.219, 61.509, 61.854, 62.127, 62.423, 62.857, 63.308, 64.598,
            65.984, 65.254, 64.938
        ],

    "route4":
        [
            71.601, 68.809, 68.129, 69.537, 69.677, 68.427, 66.852, 66.069,
            67.107, 68.392, 69.326, 70.751, 71.901, 72.631, 72.800, 72.550,
            72.439, 72.993, 74.151, 75.141, 76.128, 76.950, 76.891, 76.800,
            76.319, 75.907, 75.735, 75.401, 75.867, 76.692, 77.691, 78.370,
            78.392, 77.521, 77.060, 74.986, 74.408, 74.460
        ],
    "route5":
        [
            73.654, 74.147, 75.135, 76.123, 76.948, 76.888, 76.796, 76.316,
            75.903, 75.732, 75.399, 75.869, 76.692, 77.692, 78.372, 78.396,
            77.523, 77.062, 74.986, 74.408, 74.458, 77.790, 79.804, 82.873,
            86.957, 90.875, 92.385, 89.778, 85.697, 81.687, 77.680, 73.611,
            70.354, 68.916, 67.826, 65.980, 65.249, 64.938
        ]

};

let reducedName = {
    "route1": ["TBM 1A", "CP01", "CP02", "CP57", "CP56", "CP55", "CP54", "CP53", "CP52",
        "CP51", "CP50", "CP49", "CP48", "CP47", "CP46", "CP45", "CP44", "TBM02",
        "CP43", "CP42", "CP41", "CP40", "CP39", "CP38", "CP37", "CP36", "CP35",
        "CP34", "CP33", "TBM04 (73.654)"],
    "route2": ["TBM 1A", "CP01", "CP02", "CP03", "CP04", "CP05", "CP06", "CP07", "CP08",
        "CP09", "CP10", "CP11", "CP12", "CP13", "CP14", "CP14A", "CP15", "CP16",
        "CP17", "CP18", "CP19", "CP20", "CP21", "CP22", "CP23", "CP24", "CP25",
        "CP26", "CP27", "CP28", "CP29", "CP30", "CP31", "CP32", "TBM 5 (74.460)"],
    "route3": ["TBM 2", "CP44", "CP45", "CP46", "CP47", "CP48", "CP49", "CP50", "CP51",
        "CP52", "CP53", "CP54", "CP55", "CP56", "CP57", "CP02", "CP03", "CP04",
        "CP05", "CP06", "CP07", "CP08", "CP09", "CP10", "CP11", "CP12", "CP13",
        "CP14", "CP14A", "CP15", "CP16", "CP17", "CP18", "CP94", "TBM 6 (64.938)"],
    "route4": ["TBM03", "CP58", "CP59", "CP60", "CP61", "CP62", "CP63", "CP64", "CP65",
        "CP66", "CP67", "CP68", "CP69", "CP70", "CP71", "CP72", "CP73", "CP74",
        "CP75", "CP76", "CP77", "CP78", "CP79", "CP80", "CP81", "CP82", "CP83",
        "CP84", "CP85", "CP86", "CP87", "CP88", "CP89", "CP90", "CP91", "CP92",
        "CP93", "TBM 5 (74.460)"],
    "route5": [
        "TBM 4", "CP75", "CP76", "CP77", "CP78", "CP79", "CP80", "CP81", "CP82", "CP83",
        "CP84", "CP85", "CP86", "CP87", "CP88", "CP89", "CP90", "CP91", "CP92", "CP93",
        "TBM 5 (74.460)", "CP32A", "CP31", "CP30", "CP29", "CP28", "CP27", "CP26", "CP25",
        "CP24", "CP23", "CP22", "CP21", "CP20", "CP19", "CP18", "CP94", "TBM 6 (64.938)"
    ]
};

let entryCount = 0;
let previewData = null;
let selectedRoute = reducedList["route1"];
let selectedName = reducedName["route1"];
let lastRL = 0;
let undoStack = [];
let redoStack = [];

// ------------------ HELPERS ------------------
function updateStationLabels() {
    const len = document.getElementById("fieldbookTable").querySelector("tbody").rows.length;
    document.getElementById("BSText").innerText = selectedName[len - 1] || "-";
    document.getElementById("FSText").innerText = selectedName[len] || "-";
}

// ------------------ PREDICT FS ------------------
function PredictForesight() {
    let tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    let backsightReading = parseFloat(document.getElementById("backsightInput").value);
    let foresightNumber = tableBody.rows.length;

    if (isNaN(backsightReading) || foresightNumber === 0) return;

    let estimatedFS = backsightReading - selectedRoute[foresightNumber] + selectedRoute[foresightNumber - 1];
    document.getElementById("foresightInput").placeholder = estimatedFS.toFixed(3);
}

// ------------------ PREVIEW RESULT ------------------
function calculateResult() {
    let tableBody = document.getElementById("fieldbookTable").querySelector("tbody");

    if (tableBody.rows.length === 0) {
        document.getElementById("CurrentResult").innerText = "⚠️ Please select a route first.";
        return;
    }

    let backsightReading = parseFloat(document.getElementById("backsightInput").value);
    let foresightReading = parseFloat(document.getElementById("foresightInput").value);

    if (isNaN(backsightReading) || isNaN(foresightReading)) {
        document.getElementById("CurrentResult").innerText = "⚠️ Please enter both values";
        return;
    }

    let result = backsightReading - foresightReading;
    let resultText = result < 0 ? `Fall ${(-result).toFixed(3)}` : `Rise ${result.toFixed(3)}`;
    document.getElementById("CurrentResult").innerText = resultText;

    previewData = { backsight: backsightReading, foresight: foresightReading, result: result };

    let previousRow = tableBody.rows[tableBody.rows.length - 1];
    let previousRL = parseFloat(previousRow.cells[4].innerText);

    let expected = selectedRoute[tableBody.rows.length];
    let stationName = selectedName[tableBody.rows.length];

    let newRL = previousRL + result;
    let difference = newRL - expected;

    if (Math.abs(difference)>0.005){
        document.getElementById("previewDiff").style.color = 'red';
    } else{
        document.getElementById("previewDiff").style.color = 'green';
    }
    document.getElementById("previewBacksight").innerText = backsightReading.toFixed(3);
    document.getElementById("previewForesight").innerText = foresightReading.toFixed(3);
    document.getElementById("previewResult").innerText = result.toFixed(3);
    document.getElementById("previewRL").innerText = newRL.toFixed(3);
    document.getElementById("previewExpected").innerText = expected.toFixed(3);
    document.getElementById("previewDiff").innerText = difference.toFixed(3);
    document.getElementById("previewStation").innerText = stationName;
}

// ------------------ CONFIRM ENTRY ------------------
function confirmEntry() {
    if (!previewData) return;

    let tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    let previousRow = tableBody.rows[tableBody.rows.length - 1];

    entryCount++;
    previousRow.cells[1].innerText = previewData.backsight.toFixed(3);

    let newRow = tableBody.insertRow();
    newRow.insertCell(0).innerText = entryCount;
    newRow.insertCell(1).innerText = "-";
    newRow.insertCell(2).innerText = previewData.foresight.toFixed(3);
    newRow.insertCell(3).innerText = previewData.result.toFixed(3);

    let previousRL = parseFloat(previousRow.cells[4].innerText);
    let currentRL = previousRL + previewData.result;
    newRow.insertCell(4).innerText = currentRL.toFixed(3);

    let expected = selectedRoute[tableBody.rows.length - 1];
    let stationName = selectedName[tableBody.rows.length - 1];
    newRow.insertCell(5).innerText = expected.toFixed(3);
    newRow.insertCell(6).innerText = (currentRL - expected).toFixed(3);
    newRow.insertCell(7).innerText = stationName;

    previewData = null;
    lastRL = currentRL;
    document.getElementById("backsightInput").value = "";
    document.getElementById("foresightInput").value = "";
    document.getElementById("CurrentResult").innerText = "Calculated results will be shown here";
    document.getElementById("backsightInput").focus();

    updateStationLabels();
    saveTableToStorage();
}

// ------------------ FIRST ROW ------------------
function addFirstRow() {
    const station = document.getElementById("station").value;
    if (!station) return;

    selectedRoute = reducedList[station];
    selectedName = reducedName[station];
    const tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    const startRL = startstations[station];

    if (tableBody.rows.length === 0) {
        entryCount = 1;
        lastRL = startRL;
        const newRow = tableBody.insertRow();

        newRow.insertCell(0).innerText = entryCount;
        newRow.insertCell(1).innerText = "-";
        newRow.insertCell(2).innerText = "-";
        newRow.insertCell(3).innerText = "-";
        newRow.insertCell(4).innerText = startRL.toFixed(3);
        newRow.insertCell(5).innerText = startRL.toFixed(3);
        newRow.insertCell(6).innerText = "0.000";
        newRow.insertCell(7).innerText = selectedName[0];
    } else {
        const firstRow = tableBody.rows[0];
        firstRow.cells[4].innerText = startRL.toFixed(3);
        firstRow.cells[5].innerText = startRL.toFixed(3);
        firstRow.cells[6].innerText = "0.000";
        firstRow.cells[7].innerText = selectedName[0];
        lastRL = startRL;
    }

    updateStationLabels();
}

// ------------------ UNDO ENTRY ------------------
function undoEntry() {
    const tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    const rowCount = tableBody.rows.length;

    if (rowCount <= 1) {
        document.getElementById("CurrentResult").innerText = "Nothing to undo.";
        return;
    }

    // Save last row before deleting (for redo)
    const lastRow = tableBody.rows[rowCount - 1];
    let rowData = [];
    for (let i = 0; i < lastRow.cells.length; i++) {
        rowData.push(lastRow.cells[i].innerText);
    }
    undoStack.push(rowData);

    // Delete last row
    tableBody.deleteRow(rowCount - 1);

    // Reset marker on new last row
    const newLastRow = tableBody.rows[rowCount - 2];
    newLastRow.cells[1].innerText = "-";

    const lastNo = parseInt(newLastRow.cells[0].innerText);
    entryCount = isNaN(lastNo) ? tableBody.rows.length : lastNo;
    lastRL = parseFloat(newLastRow.cells[4].innerText);

    previewData = null;
    document.getElementById("backsightInput").value = "";
    document.getElementById("foresightInput").value = "";
    document.getElementById("CurrentResult").innerText = "Last entry undone.";
    document.getElementById("backsightInput").focus();

    updateStationLabels();
    saveTableToStorage();
}

// ------------------ REDO ENTRY ------------------
function redoEntry() {
    const tableBody = document.getElementById("fieldbookTable").querySelector("tbody");

    if (undoStack.length === 0) {
        document.getElementById("CurrentResult").innerText = "Nothing to redo.";
        return;
    }

    // Get last undone row
    const rowData = undoStack.pop();

    // Insert row back at the end
    let newRow = tableBody.insertRow();
    rowData.forEach((cellData, idx) => {
        let newCell = newRow.insertCell(idx);
        newCell.innerText = cellData;
    });

    // Update entry count and RL
    const lastNo = parseInt(newRow.cells[0].innerText);
    entryCount = isNaN(lastNo) ? tableBody.rows.length : lastNo;
    lastRL = parseFloat(newRow.cells[4].innerText);

    previewData = null;
    document.getElementById("backsightInput").value = "";
    document.getElementById("foresightInput").value = "";
    document.getElementById("CurrentResult").innerText = "Last entry redone.";
    document.getElementById("backsightInput").focus();

    updateStationLabels();
    saveTableToStorage();
}

// ------------------ EXPORT ------------------
function exportToExcel() {
    let table = document.getElementById("fieldbookTable");
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, "Fieldbook");
    XLSX.writeFile(wb, "fieldbook.xlsx");
}

//AUTO FORMAT INPUT
function autoFormatInput(inputEl) {
    let raw = inputEl.value.replace(/[^0-9.]/g, ""); // keep only digits and decimal
    if (!raw) {
        inputEl.value = "";
        return;
    }

    let num = parseFloat(raw);
    if (isNaN(num)) {
        inputEl.value = "";
        return;
    }

    // If user typed without decimal, treat as /1000
    if (!raw.includes(".") && num > 0) {
        num = num / 1000;
    }

    // Format to 3 decimal places
    let formatted = num.toFixed(3);

    // Only update if changed
    if (inputEl.value !== formatted) {
        inputEl.value = formatted;

        // Put cursor at the end
        let cursorPos = formatted.length;
        inputEl.setSelectionRange(cursorPos, cursorPos);

        // 🔥 Force trigger an input event so linked functions re-run
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
}

function autoFormatOnBlur(inputEl) {
    let raw = inputEl.value.replace(/[^0-9.]/g, "");
    if (!raw) {
        inputEl.value = "";
        return;
    }

    let num = parseFloat(raw);
    if (isNaN(num)) {
        inputEl.value = "";
        return;
    }

    if (!raw.includes(".") && num > 100) {
        num = num / 1000;
    }

    inputEl.value = num.toFixed(3);
}
