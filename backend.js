let users = [];
let tasks = [];

let id;
let taskId;

// Immer als erste Funktion ausführen!
async function init() {
    setURL('https://gruppenarbeit-486join.developerakademie.net/smallest_backend_ever');

    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
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
    let color = document.getElementById('color');
    let userId = id;

    let userColor = document.getElementById('userColor');
    let userColorValue = userColor.options[userColor.selectedIndex].value;

    for (let i = 0; i < users.length; i++) {
        if(users[i]['userid'].includes === id) {
            generateUserId();
        } 
    }

    let userData = {name: name.value, surname: surname.value, email: email.value, password: password.value, color: userColorValue, userid: userId};
    let user = users.find(u => u.email == email.value && u.password == password.value);

    if (user) {
        alreadySignedUpPupup();
        name.value = '';
        surname.value = '';
        email.value = '';
        password.value = '';
    } else {
        users.push(userData);
        save();
        successfullySignedUpPopup();
        setInterval(backToLoginScreen, 1200);
    }
}

function backToLoginScreen() {
    window.location.href = '../index.html';
}

async function save() {
    let usersAsString = JSON.stringify(users);
    await backend.setItem('users', usersAsString);
}

// ToDoStart
function createTask() {
    let taskId = generateTaskId();
    let statusCategory = "toDo";
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);;
    let assignTo = selectedValues;
    let dueDate = document.getElementById('dueDate');
    let priorityValue = priority;
    let taskData = {taskId: taskId, statusCategory: statusCategory, title: title.value, description: description.value, category: category, assignTo: assignTo, dueDate: dueDate.value, priorityValue: priorityValue };
    tasks.push(taskData);
    saveTasks();
    console.log("Tasks", taskData);
    // window.location.href = 'index.html';
}
async function saveTasks() {
    let tasksAsString = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsString);
}

// Define an empty array to store the selected values
selectedValues = [];
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
            console.log(selectedValues); // Print the selected values to the console
        });
    });
}
let priority = "";
function saveSelectedPriority() {
    Array.from(document.getElementsByClassName("prioButton")).forEach((button) => {
        button.addEventListener('click', (event) => {
            priority = event.target.id;
        });
    });
}
let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229";

function selectUrgent() {
    document.getElementById("urgent").style.background = orange;
    document.getElementById("medium").style.background = white;
    document.getElementById("low").style.background = white;

    document.getElementById("urgent").style.color = white;
    document.getElementById("medium").style.color = black;
    document.getElementById("low").style.color = black;
    
    document.getElementById("imgUrgent").style.filter = "brightness(0) saturate(100%) invert(87%) sepia(69%) saturate(1%) hue-rotate(72deg) brightness(108%) contrast(101%)";
    document.getElementById("imgMedium").style.filter = "brightness(0) saturate(100%) invert(74%) sepia(88%) saturate(4267%) hue-rotate(9deg) brightness(116%) contrast(102%)";
    document.getElementById("imgLow").style.filter = "brightness(0) saturate(100%) invert(92%) sepia(41%) saturate(6077%) hue-rotate(32deg) brightness(96%) contrast(85%)";
}
function selectMedium() {
    document.getElementById("urgent").style.background = white;
    document.getElementById("medium").style.background = lightorange;
    document.getElementById("low").style.background = white;

    document.getElementById("urgent").style.color = black;
    document.getElementById("medium").style.color = white;
    document.getElementById("low").style.color = black;

    document.getElementById("imgUrgent").style.filter = "brightness(0) saturate(100%) invert(29%) sepia(82%) saturate(2522%) hue-rotate(0deg) brightness(99%) contrast(109%)";
    document.getElementById("imgMedium").style.filter = "brightness(0) saturate(100%) invert(87%) sepia(69%) saturate(1%) hue-rotate(72deg) brightness(108%) contrast(101%)";
    document.getElementById("imgLow").style.filter = "brightness(0) saturate(100%) invert(92%) sepia(41%) saturate(6077%) hue-rotate(32deg) brightness(96%) contrast(85%)";
}
function selectLow() {
    document.getElementById("urgent").style.background = white;
    document.getElementById("medium").style.background = white;
    document.getElementById("low").style.background = green;

    document.getElementById("urgent").style.color = black;
    document.getElementById("medium").style.color = black;
    document.getElementById("low").style.color = white;

    document.getElementById("imgUrgent").style.filter = "brightness(0) saturate(100%) invert(29%) sepia(82%) saturate(2522%) hue-rotate(0deg) brightness(99%) contrast(109%)";
    document.getElementById("imgMedium").style.filter = "brightness(0) saturate(100%) invert(74%) sepia(88%) saturate(4267%) hue-rotate(9deg) brightness(116%) contrast(102%)";
    document.getElementById("imgLow").style.filter = "brightness(0) saturate(100%) invert(87%) sepia(69%) saturate(1%) hue-rotate(72deg) brightness(108%) contrast(101%)";
}

let categoryValue = "";
let previousCategoryValue = "";
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
    
    if(user) {
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
        pwEmailIncorrectPopup();
    } else {
        userDoesNotExistPopup();
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

function userColor(userColor){
    document.getElementById('topNavBarRightImgPicture').style.borderColor = userColor;  
}

function showLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');

    if (logoutButton.style.display == "none") {
        logoutButton.style.display = "flex";
    } else {
        logoutButton.style.display = "none";
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
function alreadySignedUpPupup() {
    // Get the snackbar DIV
    var x = document.getElementById("alreadySignedUp");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function successfullySignedUpPopup() {
    // Get the snackbar DIV
    var x = document.getElementById("successfullySignedUp");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

  function userDoesNotExistPopup() {
    // Get the snackbar DIV
    var x = document.getElementById("userDoesNotExist");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

  function pwEmailIncorrectPopup() {
    // Get the snackbar DIV
    var x = document.getElementById("pwEmailIncorrect");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

  function noEmailInsertedPopup() {
    // Get the snackbar DIV
    var x = document.getElementById("noEmailInsertedPopup");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function sendEmailPopup() {
    // Get the snackbar DIV
    var x = document.getElementById("sendEmail");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

  function passwordResetPopup() {
    // Get the snackbar DIV
    var x = document.getElementById("passwordReset");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function passwordsNotIdentical() {
    // Get the snackbar DIV
    var x = document.getElementById("passwordsNotIdentical");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

/* ======================================================================================*/

async function saveContacts() {
    let contactsAsString = JSON.stringify(contacts);
    await backend.setItem('contacts', contactsAsString);
}

function checkForCorrectEmail() {

    let sendEmailToResetPw = document.getElementById('sendEmailToResetPw');  
    let emails = users[i]['email'];

    for (let i = 0; i < emails.length; i++) {
        let existingEmail = emails.find(u => u.email == sendEmailToResetPw.value);


        
    }

    if(sendEmailToResetPw.value == '') {
        noEmailInsertedPopup();
        return false;
    } 
    
    if(!existingEmail) {
        userDoesNotExistPopup();  
        return false;
    }

    setInterval(sendEmailPopup, 1200);
    return(true);
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
        passwordsNotIdentical();
    }
}

function activeTab() {
    let currentElement = document.getElementById('contactID' + c);
    let allElements = document.querySelectorAll('.contact');

    allElements.forEach((element) => {
        element.style.backgroundColor = '#F5F5F5';
        element.style.color = 'black';
        // element.classList.remove('.activeContact');
    })
        currentElement.style.backgroundColor = '#2A3647';
        currentElement.style.color = 'white';

        // currentElement.classList.add('.activeContact');

}



