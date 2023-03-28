let users = [];
let tasks = [];

let id;

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
function generateUserId(){
    id = Math.floor((Math.random() * 1000000) + 1);
}

function addUser(){
    generateUserId();
    let name = document.getElementById('name');
    let surname = document.getElementById('surname');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let color = document.getElementById('color');
    let userId = id;

    for (let i = 0; i < users.length; i++) {
        if(users[i]['userid'].includes === id) {
            generateUserId();
        } 
    }

    let userData = {name: name.value, surname: surname.value, email: email.value, password: password.value, color: color.value, userid: userId};
    let user = users.find(u => u.email == email.value && u.password == password.value);
    
    if(user){
        alreadySignedUpPupup();
        name.value = '';
        surname.value = '';
        email.value = '';
        password.value ='';
    } else {
        users.push(userData);
        save();
        successfullySignedUpPopup();

        setInterval(forwardToLogin, 1200);
    }

//    let urlParams = new URLSearchParams(window.location.search);     // query paramter von einem query string (window.location.search) von der URL auslesen
//    let idMsg = urlParams.get('id');
}

// ToDoStart
function createTask(){
    // generateUserId();
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = document.getElementById('categoryChoices');
    let assignTo = document.getElementById('assignedToUsers');
    let dueDate = document.getElementById('dueDate');
    // let priority = selectedPriority;
    let taskData = {title: title.value, description: description.value, category: category.value, assignTo: assignTo.value, dueDate: dueDate.value};
    // tasks.push(taskData);
    // saveTasks();
    console.log("taskdata", taskData);

    // let surname = document.getElementById('surname');
    // let email = document.getElementById('email');
    // let password = document.getElementById('password');
    // let color = document.getElementById('color');
    // let userId = id;

    // for (let i = 0; i < users.length; i++) {
    //     if(users[i]['userid'].includes === id) {
    //         generateUserId();
    //     } 
    // }

    // let userData = {name: name.value, surname: surname.value, email: email.value, password: password.value, color: color.value, userid: userId};
    // let user = users.find(u => u.email == email.value && u.password == password.value);
    
    // if(user){
    //     alreadySignedUpPupup();
    //     name.value = '';
    //     surname.value = '';
    //     email.value = '';
    //     password.value ='';
    // } else {
    //     users.push(userData);
    //     save();
    //     successfullySignedUpPopup();

    //     setInterval(forwardToLogin, 1200);
    // }
} 
async function saveTasks() {
    let tasksAsString = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsString);
}
//ToDoEnd

function forwardToLogin() {
    // Weiterleitung zur Loginseite
    window.location.href = 'index.html?id=' + id;    // Die URL wird so geändert, dass die Login Seite angezeigt wird mit einem query Parameter    

}

async function save() {
       let usersAsString = JSON.stringify(users);
       await backend.setItem('users', usersAsString);
}

function backToLoginScreen() {
    window.location.href = 'index.html';
}

// ================================================ LOGIN ==========================================================
function login() {
    let emailLog = document.getElementById('emailLog');
    let passwordLog = document.getElementById('passwordLog');
    
    let user = users.find(u => u.email == emailLog.value && u.password == passwordLog.value);
    let existingUser = users.find(u => u.email == emailLog.value);
    
    if(user) {
        let urlParams = new URLSearchParams(window.location.search); // query paramter von einem query string (window.location.search) von der URL auslesen
        let userId = urlParams.get('id');
        let userName = user.name;
        localStorage.setItem('userName', userName);
        window.location.href = 'summery.html?id=' + userId;          // Die URL wird so geändert, dass die Login Seite angezeigt wird mit einem query Parameter    
    } else if (existingUser) {
        pwEmailIncorrectPopup();
    } else {
        userDoesNotExistPopup();
    }
}

function guestLogin(){
    let userName = "Guest";
    localStorage.setItem('userName', userName);
    window.location.href = 'summery.html';  
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