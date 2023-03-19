let users = [
    /* {'email': 'odermatt.tobias.w@gmail.com', 'password': 'test123'} */
];

let id;

// Immer als erste Funktion ausführen!
async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
} 

// || [];
/*-------------------------------------------------------------------------------------------- */

// ================================================ REGISTRIEREN ==========================================================
// Am besten eine separate "register.js" Datei erstellen
function generateUserId(){
    id = Math.floor((Math.random() * 1000000) + 1);
}

function addUser(){
    generateUserId();
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let userId = id;

    for (let i = 0; i < users.length; i++) {
        if(users[i]['userid'].includes === id)
            generateUserId();
    } 

    let userData = {name: name.value, email: email.value, password: password.value, userid: userId};
    let user = users.find(u => u.email == email.value && u.password == password.value);

    if(user){
        // show Infobox go to Login Site
    } else {
        users.push(userData);
    }

    save();
    
    // Weiterleitung zur Loginseite + Nachricht anzeigen: "Erfolgreiche registrierung"
//         window.location.href = 'login.html?id=' + id;    // Es wird die so URL so geändert, dass die Login Seite angezeigt wird mit einem query Parameter    

        
/*         let urlParams = new URLSearchParams(window.location.search);     // query paramter von einem query string (window.location.search) von der URL auslesen
        let idMsg = urlParams.get('id');
 */}

function save() {
       let usersAsString = JSON.stringify(users);
       backend.setItem('users', usersAsString);


/*     let usersAsString = JSON.stringify(users);
    localStorage.setItem('users', usersAsString)
 */}

// ================================================ LOGIN ==========================================================
function login() {
    let emailLog = document.getElementById('emailLog');
    let passwordLog = document.getElementById('passwordLog');

    let user = users.find(u => u.email == emailLog.value && u.password == passwordLog.value);
    if(user){
        window.location.href = 'summary.html?id=' + id;
    } else {
        // Meldung zuerst registrieren
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
    URLSearchParams.push(task);
    backend.setItem('users')    => Mehr Parameter nötig????
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












