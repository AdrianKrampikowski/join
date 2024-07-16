let users = [];
let tasks = [];
let subTaskArray = [];
let editedTaskPririty = [];
let ownCategoryBackgroundColor = '';
let id;
let taskId;
let allValueCheck = false;
let priority = "";
let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229";
let statusCategoryValueGlobal = 'toDo';
selectedValues = []; // Define an empty array to store the selected values
let prevPriorityElement = null; // keep track of previously clicked button
let categoryValue = "";
let previousCategoryValue = "";


// Immer als erste Funktion ausführen!
async function init() {
    setURL('https://join.adrian-krampikowski.com/smallest_backend_ever');
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    initializeEventListeners(); //neu
}

// ================================================ REGISTRIEREN ==========================================================
// Am besten eine separate "register.js" Datei erstellen
function generateUserId() {
    id = Math.floor((Math.random() * 1000000) + 1);
}

function generateTaskId() {
    taskId = Math.floor((Math.random() * 1000000) + 1);
    return taskId;
}

function addUser() {
    generateUserId();
    let name = document.getElementById('name');
    let surname = document.getElementById('surname');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let userId = id;
    let userColor = document.getElementById('userColor');
    let userColorValue = userColor.options[userColor.selectedIndex].value;
    for (let i = 0; i < users.length; i++) {
        if (users[i]['userid'].includes === id) {
            generateUserId();
        }
    }
    let userData = { name: name.value, surname: surname.value, email: email.value, password: password.value, userColor: userColorValue, userid: userId };
    let contactData = { name: name.value, surname: surname.value, email: email.value, phone: '-', contactColor: userColorValue };
    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (userData.name && userData.surname && userData.email.includes('@') && userData.password && userData.userColor && userData.userColor != "none") {
        if (user) {
            displaySignedUpPopup('alreadySignedUp');
            name.value = '';
            surname.value = '';
            email.value = '';
            password.value = '';
        } else {
            users.push(userData);
            contacts.push(contactData);
            save();
            saveContacts();
            displaySignedUpPopup('successfullySignedUp');
            setInterval(backToLoginScreen, 1200);
        }
    }
    else {
        displaySignedUpPopup('missingSignedUp');
    }
}

function backToLoginScreen() {
    window.location.href = 'https://join.adrian-krampikowski.com/';
}

async function save() {
    let usersAsString = JSON.stringify(users);
    await backend.setItem('users', usersAsString);
}

function setStatusCategoryValue(statusCategoryValue) {
    statusCategoryValueGlobal = statusCategoryValue;
}

function nextStatusCatergory(id, statusCategory, event, direction) {
    event.stopImmediatePropagation();
    currentDraggedElement = tasks.findIndex(obj => obj.taskId === id);
    if (statusCategory == 'toDo') {
        tasks[currentDraggedElement]["statusCategory"] = 'inProgress';
    }
    if (statusCategory == 'inProgress') {
        tasks[currentDraggedElement]["statusCategory"] = 'awaitingFeedback';
    }
    if (statusCategory == 'awaitingFeedback') {
        tasks[currentDraggedElement]["statusCategory"] = 'done';
    }
    updateTasksAndHTML();
}

function beforeStatusCatergory(id, statusCategory, event) {
    event.stopImmediatePropagation();
    currentDraggedElement = tasks.findIndex(obj => obj.taskId === id);
    if (statusCategory == 'inProgress') {
        tasks[currentDraggedElement]["statusCategory"] = 'toDo';
    }
    if (statusCategory == 'awaitingFeedback') {
        tasks[currentDraggedElement]["statusCategory"] = 'inProgress';
    }
    if (statusCategory == 'done') {
        tasks[currentDraggedElement]["statusCategory"] = 'awaitingFeedback';
    }
    updateTasksAndHTML();
}

function updateTasksAndHTML() {
    updateTasks();
    updateHTML();
}

// ToDoStart
async function createTask() {
    let taskId = generateTaskId();
    let statusCategory = statusCategoryValueGlobal;
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = categoryValue ? categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1) : '';
    let categoryColor = category ? addBackgroundColorCategory(category) : '';
    let assignTo = selectedValues ? selectedValues : '';
    let dueDate = document.getElementById('dueDate');
    let priorityValue = priority ? priority : '';
    let errorMessage = '';
    if (title.value == '') {
        errorMessage += 'Title is missing.\n';
    }
    if (description.value == '') {
        errorMessage += 'Description is missing.\n';
    }
    if (!category || category == '' || category == 'SelectYourOwnCategory') {
        errorMessage += 'Category is missing.\n';
    }
    if (assignTo == '') {
        errorMessage += 'Assignee is missing.\n';
    }
    if (!priorityValue) {
        errorMessage += 'Priority is missing.\n';
    }
    if (errorMessage != '') {
        displayTaskErrorPopup('taskError', errorMessage);
    } else {
        let taskData = {
            taskId: taskId,
            statusCategory: statusCategory,
            title: title.value,
            description: description.value,
            category: category,
            categoryColor: categoryColor,
            assignTo: assignTo,
            dueDate: dueDate.value,
            priorityValue: priorityValue,
            subTaskArray: subTaskArray
        };
        tasks.push(taskData);
        subTaskArray = [];
        await saveTasks();
        displayTaskCreatedPopup('taskCreated');
        setTimeout(() => {
            clearAll();
            updateTasksAndHTML();
            setTimeout(() => {
                displayPage('mainBoardContainerDisplay');
            }, 100);
        }, 1500);
    }
}

function createSubTask() {
    let subTask = document.getElementById('subtask').value;
    if (subTask) {
        let subTaskObject = { subTask: subTask, isCompleted: false }
        subTaskArray.push(subTaskObject);
        document.getElementById('subtask').value = '';
        displayCreatedSubTasks(subTaskArray);
    }
}

function displayCreatedSubTasks(subTask) {
    document.getElementById('addedSubTasks').innerHTML = ``;
    subTask.forEach((item) => {
        document.getElementById('addedSubTasks').innerHTML += `
            <div>
                ${item['subTask']}
            </div>
        `;
    })
}

async function saveTasks() {
    let tasksAsString = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsString);
}

setTimeout(() => {
    saveSelectedUsers();
    saveSelectedPriority();
    saveSelectedCategory();
}, 1500);

// Add an event listener to the checkboxes to update the selectedValues array
function saveSelectedUsers() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (event.target.checked) {
                if (!selectedValues.includes(selectedValue)) { // Check for duplicates
                    selectedValues.push(selectedValue);
                }
            } else {
                const index = selectedValues.indexOf(selectedValue);
                if (index > -1) {
                    selectedValues.splice(index, 1);
                }
            }
        });
    });
}

function saveSelectedPriority() {
    Array.from(document.getElementsByClassName("prioButton")).forEach((button) => {
        button.addEventListener('click', (event) => {
            priority = event.target.id;
        });
    });
}

function select(id, idsToDeselect, filtersToDeselect, idsToSelect, filtersToSelect) {
    // Set background and color for IDs to deselect
    for (var i = 0; i < idsToDeselect.length; i++) {
        var element = document.getElementById(idsToDeselect[i]);
        element.style.background = "white";
        element.style.color = "black";
        if (filtersToDeselect[i]) {
            var imgElement = document.getElementById(filtersToDeselect[i]);
            imgElement.style.filter = "";
        }
    }

    // Set background and color for IDs to select
    for (var i = 0; i < idsToSelect.length; i++) {
        var element = document.getElementById(idsToSelect[i]);
        switch (idsToSelect[i]) {
            case "urgent":
            case "urgentEdit":
                element.style.background = orange;
                element.style.color = white;
                break;
            case "medium":
            case "mediumEdit":
                element.style.background = lightorange;
                element.style.color = white; // change to white
                break;
            case "low":
            case "lowEdit":
                element.style.background = green;
                element.style.color = white; // change to white
                break;
            default:
                element.style.background = white;
                element.style.color = black;
        }
        if (filtersToSelect[i]) {
            var imgElement = document.getElementById(filtersToSelect[i]);
            imgElement.style.filter = "brightness(0) invert(1)";
        }
    }
}

function selectUrgent() {
    select("urgent", ["medium", "low"], ["imgMedium", "imgLow"], ["urgent"], ["imgUrgent"]);
}

function selectUrgentEdit() {
    select("urgentEdit", ["mediumEdit", "lowEdit"], ["imgMediumEdit", "imgLowEdit"], ["urgentEdit"], ["imgUrgentEdit"]);
}

function selectMedium() {
    select("medium", ["urgent", "low"], ["imgUrgent", "imgLow"], ["medium"], ["imgMedium"]);
}

function selectMediumEdit() {
    select("mediumEdit", ["urgentEdit", "lowEdit"], ["imgUrgentEdit", "imgLowEdit"], ["mediumEdit"], ["imgMediumEdit"]);
}

function selectLow() {
    select("low", ["urgent", "medium"], ["imgUrgent", "imgMedium"], ["low"], ["imgLow"]);
}

function selectLowEdit() {
    select("lowEdit", ["urgentEdit", "mediumEdit"], ["imgUrgentEdit", "imgMediumEdit"], ["lowEdit"], ["imgLowEdit"]);
}

function addBackgroundColorCategory(element) {
    if (element == "Marketing") {
        return "#0038ff";
    } else if (element == "Media") {
        return "#ffc702";
    } else if (element == "Backoffice") {
        return "#1FD7C1";
    } else if (element == "Design") {
        return "#ff7a00";
    } else if (element == "Sales") {
        return "#fc71ff";
    } else {
        return ownCategoryBackgroundColor;
    }
}

function saveSelectedCategory() {
    Array.from(document.getElementsByClassName("category")).forEach((item) => {
        item.addEventListener('click', (event) => {
            let newCategoryValue = event.target.id;
            let upperCaseValue = newCategoryValue.charAt(0).toUpperCase() + newCategoryValue.slice(1);
            if (event.target.id) {
                if (newCategoryValue !== categoryValue) {
                    previousCategoryValue = categoryValue;
                    categoryValue = newCategoryValue;
                    document.getElementById("selectCategory").innerHTML = `
                    ${upperCaseValue}
                `;
                    let parentDiv = document.getElementById(`${categoryValue}`).parentNode;
                    parentDiv.style.display = "none";
                    if (previousCategoryValue) {
                        let restoredParentDiv = document.getElementById(`${previousCategoryValue}`).parentNode;
                        restoredParentDiv.style.display = "flex";
                    }
                }
            }
        });
    });
}

//ToDoEnd
// ================================================ LOGIN ==========================================================
function login() {
    let emailLog = document.getElementById('emailLog');
    let passwordLog = document.getElementById('passwordLog');

    let user = users.find(u => u.email == emailLog.value && u.password == passwordLog.value);
    let existingUser = users.find(u => u.email == emailLog.value);

    if (user) {
        //********************************** */
        let userName = user.name;
        localStorage.setItem('userName', userName);
        //********************************** */

        let currentUser = users.indexOf(existingUser);

        let userId = users[currentUser]['userid'];
        let userColor = users[currentUser]['color'];

        forwardToSummery(userId);
        userColor(userColor);

    } else if (existingUser) {
        displaySignedUpPopup('pwEmailIncorrect');
    } else {
        displaySignedUpPopup('userDoesNotExist');
    }
}

function guestLogin() {
    let userName = "Guest";
    localStorage.setItem('userName', userName);
    window.location.href = 'join.html';
}

function forwardToSummery(userId) {
    // Weiterleitung zur Loginseite
    window.location.href = 'join.html?id=' + userId;    // Die URL wird so geändert, dass die Login Seite angezeigt wird mit einem query Parameter    
}

function userColor(userColor) {
    document.getElementById('topNavBarRightImgPicture').style.borderColor = userColor;
}

function showLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');
    if (logoutButton.style.display == "flex") {
        logoutButton.style.display = "none";
    } else {
        logoutButton.style.display = "flex";
    }
}

// ================================================ DATEN SPEICHERN ==========================================================
// IM LOCAL STORAGE
/* 
    allTasks.push(task);                                        => JSON mit Daten wird ins Array allTasks gepushed

    let allTasksAsString = JSON.stringify(allTasks);            => das Array allTasks wird in einen String umgewandelt
    localStorage.setItem('allTasks', allTasksAsString)          => Die Daten werden im Local Storage gespeichert / 'allTasks' ist der key und allTasksAsString ist der Wert der gespeichert wird 
*/

// AUF DEM SERVER
/* 
    let allTasksAsString = JSON.stringify(allTasks);
    backend.setItem('allTasks', allTasksAsString)
*/


// ================================================ DATEN LADEN ==========================================================
// VOM LOCAL STORAGE
/* 
    let allTasksAsString = localStorage.getItem('allTasks');    => Zugriff auf die Werte die unter dem key 'allTasks' gespeichert sind 
    allTasks = JSON.parse(allTasksAsString);                    => Die Werte werden wider von einem String in ein Array umgewandelt + Array allTasks wird überschrieben und die Werte eingefügt
*/

// VOM SERVER
/* 
    backend.setItem('users')    => Mehr Parameter nötig????
*/


/* ================================== SNACKBAR =======================================*/
function displaySignedUpPopup(popupId) {
    var x = document.getElementById(popupId);
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function displayTaskCreatedPopup(popupId) {
    var x = document.getElementById(popupId);
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function displayTaskErrorPopup(popupId, errorMessage) {
    var x = document.getElementById(popupId);
    x.innerHTML = errorMessage;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

async function saveContacts() {
    let contactsAsString = JSON.stringify(contacts);
    await backend.setItem('contacts', contactsAsString);
}

function checkForCorrectEmail() {
    let sendEmailToResetPw = document.getElementById('sendEmailToResetPw').value;
    let existingEmail = users.find(u => u.email == sendEmailToResetPw);
    let correctUser = users.indexOf(existingEmail);
    if (sendEmailToResetPw == '') {
        displaySignedUpPopup('noEmailInsertedPopup');
        return false;
    }
    if ((users.find(u => u.email == sendEmailToResetPw)) == null) {
        displaySignedUpPopup('userDoesNotExistTwo');
        return false;
    }
    setTimeout(sendEmailPopup, 3000);
    return true;
}

function resetPassword() {
    let urlParams = new URLSearchParams(window.location.search);
    let userEmail = urlParams.get('email');
    let newPassword = document.getElementById('newPassword');
    let confirmPassword = document.getElementById('confirmPassword');
    let existingEmail = users.find(u => u.email == userEmail)
    let currentUser = users.indexOf(existingEmail);
    if (newPassword.value == confirmPassword.value) {
        if (existingEmail) {
            users[currentUser]['password'] = confirmPassword.value;
            save();
            passwordReset();

            setInterval(backToLoginScreen, 1200);
        }
    } else {
        displaySignedUpPopup('passwordsNotIdentical');
    }
}

function activeTab() {
    let currentElement = document.getElementById('contactID' + c);
    let allElements = document.querySelectorAll('.contact');
    allElements.forEach((element) => {
        element.style.backgroundColor = '#F5F5F5';
        element.style.color = 'black';
    })
    currentElement.style.backgroundColor = '#2A3647';
    currentElement.style.color = 'white';
}