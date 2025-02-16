function addAssignedToList() {
    document.getElementById('assignedToChoices').innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let userID = users[i]["userid"];
        let name = users[i]["name"];
        document.getElementById('assignedToChoices').innerHTML += `
        <div class="assignedToLine">
            <label for="assigned-to-${i}" id="assigned_name${i}">${name}</label>
            <input type="checkbox" id="assigned-to-${i}"value="${userID}">
        </div>`
    }
}

function openDropdown(id) {
    if (document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.remove('d-none');
    }
    else if (!document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.add('d-none');
    }
}

function setDateToday() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("dueDate").setAttribute('min', String(today));
}

//Ändert die Symbole für Unteraufgaben in die Symbole "Löschen" und "Hinzufügen", wenn das Eingabefeld für die Unteraufgabe angeklickt wird.//
function changeSubIcon() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

//Ändert die Symbole für Unteraufgaben in die Symbole "Löschen" und "Hinzufügen", wenn das Eingabefeld geändert wird.
function inputChangeSubIcons() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

//Fügt eine Unteraufgabe zur Liste und zum Unteraufgaben-Array hinzu, wenn die Schaltfläche "Hinzufügen" angeklickt wird.
function addSubtask() {
    let subtask = document.getElementById('subtask').value;
    if (!subtask == '') {
        document.getElementById('subtaskList').innerHTML += `<li>${subtask}</li>`;
        document.getElementById('subtask').value = '';
        subtasks.push({
            'subtaskName': subtask,
            'status': 'undone'
        });
    }
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}

//Löscht das Unteraufgabeneingabefeld und ändert die Unteraufgabensymbole zurück in das "Plus"-Symbol
function clearSubtask() {
    document.getElementById('subtask').value = "";
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}


function clearAll() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('selectCategory').innerHTML = 'Select your Category';
    document.getElementById('selectYourOwnCategory').innerHTML = 'Select your own Category';
    for (let i = 0; i < users.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            document.getElementById('assigned-to-' + i).checked = false;
        }
    }
    document.getElementById('dueDate').value = '';
    clearPrios();
    document.getElementById("enterYourOwnCategoryInputId").value = '';
}

function clearPrios(){
    document.getElementById('urgent').style.background = white;
    document.getElementById('urgent').style.color = black;
    document.getElementById('imgUrgent').style.filter = "";

    document.getElementById('medium').style.background = white;
    document.getElementById('medium').style.color = black;
    document.getElementById('imgMedium').style.filter = "";

    document.getElementById('low').style.background = white;
    document.getElementById('low').style.color = black;
    document.getElementById('imgLow').style.filter = "";
}