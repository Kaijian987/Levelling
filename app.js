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

        // Restore entryCount from last row
        if (tableBody.rows.length > 0) {
            let lastRowNo = parseInt(tableBody.rows[tableBody.rows.length - 1].cells[0].innerText);
            entryCount = isNaN(lastRowNo) ? 0 : lastRowNo;

            // Restore lastRL too
            lastRL = parseFloat(tableBody.rows[tableBody.rows.length - 1].cells[4].innerText);
        }
    }
}

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

document.getElementById("station").addEventListener("change", function () {
    addFirstRow();
});

let entryCount = 0; // Keep track of row numbers
let previewData = null; // Temp storage for preview
let startstations = {
    "route1": 59.413,
    "route2": 59.413,
    "route3": 75.555,
    "route4": 71.601,
    "route5": 73.654
};

let reducedList = {
    "route1": [59.413, 60.095, 61.408, 62.264, 62.7, 63.5, 64.183, 64.383, 65.244, 66.477, 67.575, 69.203, 70.942, 72.422, 73.348, 74.978, 76.048, 75.549, 76.286, 75.617, 74.376, 73.414, 73.488, 75.102, 76.022, 76.657, 76.276, 75.551, 74.64, 73.651],
    "route2": [59.413, 60.095, 61.412, 60.04, 59.74, 59.48, 58.899, 58.394, 58.063, 59.02, 60.479, 61.221, 61.511, 61.855, 62.127, 62.423, 62.858, 63.308, 64.597, 65.979, 67.823, 68.913, 70.351, 73.609, 77.679, 81.687, 85.698, 89.78, 92.386, 90.876, 86.956, 82.869, 79.8, 77.397, 74.455],
    "route3": [75.555, 76.055, 74.984, 73.359, 72.428, 70.951, 69.209, 67.583, 66.481, 65.248, 64.386, 64.187, 63.505, 62.706, 62.271, 61.414, 60.042, 59.742, 59.482, 58.901, 58.396, 58.065, 59.022, 60.481, 61.223, 61.513, 61.857, 62.129, 62.425, 62.86, 63.31, 64.599, 65.981, 65.25, 64.939],
    "route4": [71.601, 68.81, 68.13, 69.538, 69.678, 68.429, 66.854, 66.071, 67.109, 68.395, 69.329, 70.754, 71.905, 72.635, 72.804, 72.554, 72.444, 72.998, 74.156, 75.146, 76.134, 76.956, 76.897, 76.806, 76.326, 75.914, 75.742, 75.409, 75.875, 76.7, 77.699, 78.379, 78.401, 77.53, 77.069, 74.996, 74.418, 74.47],
    "route5": [73.654, 74.147, 75.136, 76.124, 76.949, 76.889, 76.798, 76.318, 75.905, 75.734, 75.401, 75.872, 76.695, 77.695, 78.375, 78.399, 77.527, 77.066, 74.99, 74.412, 74.463, 77.795, 79.809, 82.878, 86.962, 90.881, 92.391, 89.784, 85.703, 81.693, 77.687, 73.618, 70.361, 68.923, 67.834, 65.988, 65.257, 64.946]
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

let selectedRoute = reducedList["route1"];
let selectedName = reducedName["route1"];
let lastRL = 0;

// ---------- PREVIEW RESULT ----------
function calculateResult() {

    let tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    let previousRow = tableBody.rows[tableBody.rows.length - 1]; // last row

    let backsightReading = parseFloat(document.getElementById("backsightInput").value);
    let foresightReading = parseFloat(document.getElementById("foresightInput").value);

    if (isNaN(backsightReading) || isNaN(foresightReading)) {
        document.getElementById("CurrentResult").innerText = "⚠️ Please enter both values";
        return;
    }

    let result = backsightReading - foresightReading;
    let resultText = result < 0 ? `Fall ${(-result).toFixed(3)}` : `Rise ${result.toFixed(3)}`;
    document.getElementById("CurrentResult").innerText = resultText;

    // Store preview data
    previewData = {
        backsight: backsightReading,
        foresight: foresightReading,
        result: result
    };

    // // Show preview buttons
    // document.getElementById("PreviewActions").style.display = "block";

    // Use last RL from the table
    let previousRL = parseFloat(previousRow.cells[4].innerText);

    // Get expected + station for NEXT row
    let expected = selectedRoute[tableBody.rows.length];
    let stationName = selectedName[tableBody.rows.length];

    let newRL = previousRL + result;
    let difference = newRL - expected;

    // Update Current Result preview
    document.getElementById("previewBacksight").innerText = backsightReading.toFixed(3);
    document.getElementById("previewForesight").innerText = foresightReading.toFixed(3);
    document.getElementById("previewResult").innerText = result.toFixed(3);
    document.getElementById("previewRL").innerText = newRL.toFixed(3);
    document.getElementById("previewExpected").innerText = expected.toFixed(3);
    document.getElementById("previewDiff").innerText = difference.toFixed(3);
    document.getElementById("previewStation").innerText = stationName;
}

// ---------- CONFIRM ENTRY ----------
function confirmEntry() {
    if (!previewData) return;

    entryCount++;
    let tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    let previousRow = tableBody.rows[tableBody.rows.length - 1]; // last row

    // Update previous row's backsight
    previousRow.cells[1].innerText = previewData.backsight.toFixed(3);

    // Insert new row
    let newRow = tableBody.insertRow();
    newRow.insertCell(0).innerText = entryCount;
    newRow.insertCell(1).innerText = "";
    newRow.insertCell(2).innerText = previewData.foresight.toFixed(3);
    newRow.insertCell(3).innerText = previewData.result.toFixed(3);

    // Reduced Level
    let previousRL = previousRow ? parseFloat(previousRow.cells[4].innerText) : 0;
    let currentRL = previousRL + previewData.result;
    newRow.insertCell(4).innerText = currentRL.toFixed(3);

    // Expected + Station Name
    let expected = selectedRoute[tableBody.rows.length - 1];
    let stationName = selectedName[tableBody.rows.length - 1];
    newRow.insertCell(5).innerText = expected.toFixed(3);
    newRow.insertCell(6).innerText = (currentRL - expected).toFixed(3);
    newRow.insertCell(7).innerText = stationName;

    // Reset inputs & preview
    previewData = null;
    document.getElementById("backsightInput").value = "";
    document.getElementById("foresightInput").value = "";
    document.getElementById("CurrentResult").innerText = "Calculated results will be shown here";
    document.getElementById("backsightInput").focus();

    saveTableToStorage();
}

// ---------- CANCEL PREVIEW ----------
function cancelPreview() {
    previewData = null;
    document.getElementById("CurrentResult").innerText = "Cancelled";
}

// ---------- FIRST ROW ----------
function addFirstRow() {
    const station = document.getElementById("station").value;
    if (!station) return;
    selectedRoute = reducedList[station];
    selectedName = reducedName[station];
    const tableBody = document.getElementById("fieldbookTable").querySelector("tbody");
    const startRL = startstations[station];

    if (tableBody.rows.length === 0) {
        // Table empty → add first row
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
        // Table has values → update first row
        const firstRow = tableBody.rows[0];
        firstRow.cells[4].innerText = startRL.toFixed(3);
        firstRow.cells[5].innerText = startRL.toFixed(3);
        firstRow.cells[6].innerText = "0.000";
        firstRow.cells[7].innerText = selectedName[0];
        lastRL = startRL;
    }
}