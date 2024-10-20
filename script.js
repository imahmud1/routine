function addExam() {
    var date = document.getElementById('examDate').value;
    if (date) {
        var dateParts = date.split("-");
        date = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    }
    var name = document.getElementById('examName').value;
    var slot = document.getElementById('examSlot').value;
    
    if (date && name) {
        var tableBody = document.getElementById('tableBody');
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = date;
        
        // Insert the exam name into the selected slot and leave the other slot empty
        if (slot === 'slot1') {
            cell2.innerHTML = name;
            cell3.innerHTML = '';
        } else {
            cell2.innerHTML = '';
            cell3.innerHTML = name;
        }
        
        cell4.innerHTML = '<button class="table-button edit-button" onclick="editExam(this)">✎</button>'; // Edit button
        cell5.innerHTML = '<button class="table-button delete-button" onclick="deleteExam(this)">✖</button>'; // Delete button
        // Reset the form fields
        document.getElementById('examDate').value = '';
        document.getElementById('examName').value = '';
        document.getElementById('examSlot').value = 'slot1';
    } else {
        alert('Please fill both fields.');
    }
}

function editExam(button) {
    var row = button.parentNode.parentNode;
    var dateCell = row.cells[0];
    var slot1Cell = row.cells[1];
    var slot2Cell = row.cells[2];
    var editButton = row.cells[3].firstChild;

    if (editButton.innerHTML === '✎') { // If the Edit button is clicked
        var existingDate = dateCell.innerHTML;
        var dateParts = existingDate.split("-");
        var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
        dateCell.innerHTML = '<input class="table-input" type="date" value="' + formattedDate + '">';
        slot1Cell.innerHTML = '<input class="table-input" type="text" value="' + slot1Cell.innerHTML + '">';
        slot2Cell.innerHTML = '<input class="table-input" type="text" value="' + slot2Cell.innerHTML + '">';
        dateCell.classList.add('editable');
        slot1Cell.classList.add('editable');
        slot2Cell.classList.add('editable');
        editButton.innerHTML = '✔';
    } else { // If the Save button (✔) is clicked
        var newDate = dateCell.firstChild.value;
        var dateParts = newDate.split("-");
        newDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
        var newSlot1Name = slot1Cell.firstChild.value;
        var newSlot2Name = slot2Cell.firstChild.value;

        dateCell.innerHTML = newDate;
        slot1Cell.innerHTML = newSlot1Name;
        slot2Cell.innerHTML = newSlot2Name;
        dateCell.classList.remove('editable');
        slot1Cell.classList.remove('editable');
        slot2Cell.classList.remove('editable');
        editButton.innerHTML = '✎';
    }
}


function deleteExam(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveAsImage() {
    var tableContainer = document.getElementById('table-container');
    var table = document.getElementById('scheduleTable');
    var editColumn = table.getElementsByClassName('edit-column')[0]; // Select Edit column
    var deleteColumn = table.getElementsByClassName('delete-column')[0]; // Select Delete column

    var editColumnIndex = editColumn.cellIndex;
    var deleteColumnIndex = deleteColumn.cellIndex;

    // Hide the Edit and Delete columns
    Array.from(table.rows).forEach(row => {
        row.cells[editColumnIndex].style.display = 'none';
        row.cells[deleteColumnIndex].style.display = 'none';
    });

    // Temporarily apply styles that match the desktop view
    tableContainer.style.width = '800px'; // Match container width

    domtoimage.toJpeg(tableContainer, { quality: 1 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'exam_schedule.jpg';
            link.href = dataUrl;
            link.click();

            // Revert to original styles
            tableContainer.style.width = '';

            // Show the Edit and Delete columns again
            Array.from(table.rows).forEach(row => {
                row.cells[editColumnIndex].style.display = '';
                row.cells[deleteColumnIndex].style.display = '';
            });
        })
        .catch(function (error) {
            console.error('An error occurred:', error);

            // Revert to original styles even in case of an error
            tableContainer.style.width = '';

            // Show the Edit and Delete columns again in case of an error
            Array.from(table.rows).forEach(row => {
                row.cells[editColumnIndex].style.display = '';
                row.cells[deleteColumnIndex].style.display = '';
            });
        });
}