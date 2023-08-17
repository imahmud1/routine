function addExam() {
    var date = document.getElementById('examDate').value;
    if (date) {
        var dateParts = date.split("-");
        date = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    }
    var name = document.getElementById('examName').value;
    if (date && name) {
        var tableBody = document.getElementById('tableBody');
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = date;
        cell2.innerHTML = name;
        cell3.innerHTML = '<button class="table-button edit-button" onclick="editExam(this)">✎</button>'; // Edit button
        cell4.innerHTML = '<button class="table-button delete-button" onclick="deleteExam(this)">✖</button>'; // Delete button
        cell3.className = 'edit-cell'; // Corrected this line
        cell4.className = 'delete-cell'; // Add this line
        document.getElementById('examDate').value = '';
        document.getElementById('examName').value = '';
    } else {
        alert('Please fill both fields.');
    }
}

function editExam(button) {
    var row = button.parentNode.parentNode;
    var dateCell = row.cells[0];
    var nameCell = row.cells[1];
    var editButton = row.cells[2].firstChild;

    if (editButton.innerHTML === '✎') { // If the Edit button is clicked
        var existingDate = dateCell.innerHTML;
        var dateParts = existingDate.split("-");
        var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0]; // Reformatting date as YYYY-MM-DD
        dateCell.innerHTML = '<input type="date" value="' + formattedDate + '">';
        nameCell.innerHTML = '<input type="text" value="' + nameCell.innerHTML + '">';
        editButton.innerHTML = '✔';
    } else { // If the Save button (✔) is clicked
        var newDate = dateCell.firstChild.value;
        var dateParts = newDate.split("-");
        newDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0]; // Reformatting date as DD-MM-YYYY
        var newName = nameCell.firstChild.value;
        dateCell.innerHTML = newDate;
        nameCell.innerHTML = newName;
        editButton.innerHTML = '✎';
    }
}

function deleteExam(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveAsImage() {
    var table = document.getElementById('scheduleTable');
    var editTh = table.querySelector('.edit-column'); // Select Edit header cell
    var deleteTh = table.querySelector('.delete-column'); // Select Delete header cell

    var editCells = table.querySelectorAll('.edit-cell');
    var deleteCells = table.querySelectorAll('.delete-cell');

    editTh.style.display = 'none'; // Hide Edit header cell
    deleteTh.style.display = 'none'; // Hide Delete header cell

    editCells.forEach(cell => cell.style.display = 'none'); // Hide the Edit cells
    deleteCells.forEach(cell => cell.style.display = 'none'); // Hide the Delete cells

    var node = document.getElementById('table-container');
    domtoimage.toJpeg(node, { quality: 1 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'exam_schedule.jpg';
            link.href = dataUrl;
            link.click();

            editTh.style.display = ''; // Show Edit header cell again
            deleteTh.style.display = ''; // Show Delete header cell again

            editCells.forEach(cell => cell.style.display = ''); // Show the Edit cells again
            deleteCells.forEach(cell => cell.style.display = ''); // Show the Delete cells again
        })
        .catch(function (error) {
            console.error('An error occurred:', error);

            editTh.style.display = ''; // Show Edit header cell again
            deleteTh.style.display = ''; // Show Delete header cell again

            editCells.forEach(cell => cell.style.display = ''); // Show the Edit cells again
            deleteCells.forEach(cell => cell.style.display = ''); // Show the Delete cells again
        });
}