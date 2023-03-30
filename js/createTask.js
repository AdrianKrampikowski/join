
function createDropdownUsers() {
    for (let i = 0; i < users.length; i++) {
        document.getElementById("assignedToUsers").innerHTML += `
        <option value="${users[i]["id"]}"><input type="checkbox">${users[i]["name"]}</option>
        `;
    }
}
setTimeout(() => {
    // createDropdownUsers()
    // createDropdownCheckboxes();
    // getSelectedUsers();
    addAssignedToList();
    setDateToday();
}, 1250);

function addAssignedToList() {
    document.getElementById('assignedToChoices').innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let userID = users[i]["id"];
        // let contact = users[i];
        let name = users[i]["name"];
        document.getElementById('assignedToChoices').innerHTML += `
        <div class="assigned-to-line"><label for="assigned-to-${i}" 
        id="assigned_name${i}">${name}
        </label><input type="checkbox" id="assigned-to-${i}" 
        value="${name}"></div>`
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

function clearAll() {
    document.getElementById('titleTextfield').value = '';
    document.getElementById('description_textfield').value = '';
    document.getElementById('categoryHeader').innerHTML = 'Select your Category';
    for (let i = 0; i < contactsAddTask.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            document.getElementById('assigned-to-' + i).checked = false;
        }
    }
    document.getElementById('date').value = '';
    document.getElementById('subtask-list').innerHTML = '';
}