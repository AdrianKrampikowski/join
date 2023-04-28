/* ================================== INCLUDE HTML 1================================================== */
//Source: https://developer-akademie.teachable.com/courses/902235/lectures/31232815
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    showAllContacts();
    setTimeout(() => {
        pushArrayToDo();
        setTimeout(() => {
            updateHTML();
            searchFunction();
        }, 500);
    }, 1250);

    setTimeout(() => {
        counters();
    }, 1500);
}

function counters() {
    taskCounter();
    inProgressCounter();
    awaitingFeedbackCounter();
    urgentCounter();
    deadlineDate();
    todoCounter();
    doneCounter();
    greeting();
    displayUserName();
}

/* ============================================= VARIABLES ========================================= */
let allTasks = [];
let toDos = [];
let userChar = [];
let allUsers = [];
let currentDraggedElement;

/* ========================================= BOARD FUNCTIONS ========================================= */
function updateHTML() {
    if (toDos.length > 0) {
        for (let index = 0; index < toDos.length; index++) {
            let taskId = toDos[index]["taskId"];

            let toDo = toDos.filter(t => t["statusCategory"] == "toDo");
            document.getElementById("toDoCard").innerHTML = ``;
            for (let i = 0; i < toDo.length; i++) {
                let element = toDo[i];
                document.getElementById("toDoCard").innerHTML += generateToDoHTML(element, index);
            }

            let inProgress = toDos.filter(t => t["statusCategory"] == "inProgress");
            document.getElementById("inProgress").innerHTML = ``;
            for (let i = 0; i < inProgress.length; i++) {
                let element = inProgress[i];
                document.getElementById("inProgress").innerHTML += generateToDoHTML(element, index);
            }

            let awaitingFeedback = toDos.filter(t => t["statusCategory"] == "awaitingFeedback");
            document.getElementById("awaitingFeedback").innerHTML = ``;
            for (let i = 0; i < awaitingFeedback.length; i++) {
                let element = awaitingFeedback[i];
                document.getElementById("awaitingFeedback").innerHTML += generateToDoHTML(element, index);
            }

            let done = toDos.filter(t => t["statusCategory"] == "done");
            document.getElementById("done").innerHTML = ``;
            for (let i = 0; i < done.length; i++) {
                let element = done[i];
                document.getElementById("done").innerHTML += generateToDoHTML(element, index);
            }
        }
        for (let i = 0; i < toDos.length; i++) {
            calculateProgressbar(i);
        }
        createBubbles();
    }
}


function pushArrayToDo() {
    toDos = tasks;
}


function generateToDoHTML(element, index) {
    let progressBarHTML = '';
    if (element.hasOwnProperty('numerator') && element.hasOwnProperty('denominator')) {
        progressBarHTML = `
            <div class="boardContainerProgress" onclick="openTask(${element["taskId"]})" >
                <div class="progress">
                    <div class="progressBar" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                        aria-valuemax="100">
                    </div>
                </div>
                <div class="progressInNumbers">
                    ${element["numerator"]} / ${element["denominator"]} Done
                </div>
            </div>
        `;
    }

    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element["taskId"]})" onclick="openTask(${element["taskId"]})">
            <div class="boardContainerTop">
                <div style = "background-color:${element["categoryColor"]}">
                    <div>${element["category"]}</div>
                </div>
                    
                </div>
            <div class="boardContainerHeadline">
                <h2>${element["title"]}</h2>
            </div>
            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>
            ${progressBarHTML}
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["taskId"]}"></div>
                <div>
                    <img class="priorityImg" src="img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}


function getFirstLetter(index, i) {
    if (i < toDos[index]["assignTo"].length) {
        let y = toDos[index]["assignTo"][i];
        let x = users.filter(obj => {
            if (obj.userid == y) {
                return obj.name;
            }
        });
        x = x[0]["name"].split(' ').map(word => word.charAt(0)).join('');
        return x;
    }
}


function createBubbles() {
    for (let j = 0; j < toDos.length; j++) {
        let bubbleTaskId = toDos[j]["taskId"];

        if (toDos[j]["assignTo"].length < 3) {
            for (let i = 0; i < toDos[j]["assignTo"].length; i++) {
                let name = getFirstLetter(j, i);
                document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
                    <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
                    `;
                let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);
                if (users[j]) {
                    userBubbleOne.style.backgroundColor = users[j] ? users[j]["userColor"] : users[j]["background"];
                }
            }
        }
        else if (toDos[j]["assignTo"].length >= 3) {
            for (let i = 0; i < 2; i++) {
                let name = getFirstLetter(j, i);
                document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
                    <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
                    `;
                let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);
                if (users[j]) {
                    userBubbleOne.style.backgroundColor = users[j] ? users[j]["userColor"] : users[j]["background"];
                }
            }
            let remainingCount = toDos[j]["assignTo"].length - 2;
            document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
                <div class="userBubbleOne" id="userBubbleOne${[j]}${[2]}">+${remainingCount}</div>
                `;
            let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[2]}`);
            userBubbleOne.style.backgroundColor = "black";

        }
    }
}

function calculateProgressbar(index) {
    let x = toDos[index]["numerator"] / toDos[index]["denominator"];
    x = x * 100;
    let progressBarElements = document.getElementsByClassName("progressBar");
    // progressBarElements[index].style.width = x + "%";
}


function changeColorBubble() {
    let colors = [];
    let numColors = 42;
    for (let i = 0; i < numColors; i++) {
        colors.push(generateRandomColor());
    }
    let randomColor = Math.floor(Math.random() * colors.length);
    return colors[randomColor];
}

function generateRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

//Source: www.w3schools.com/html/html5_draganddrop.asp
function startDragging(id) {
    currentDraggedElement = toDos.findIndex(obj => obj.taskId === id);
}

function moveTo(statusCategory) {
    toDos[currentDraggedElement]["statusCategory"] = statusCategory;
    updateTasks();
    updateHTML();
}

async function updateTasks() {
    let tasksAsString = JSON.stringify(toDos);
    await backend.setItem('tasks', tasksAsString);
}

function allowDrop(ev) {
    ev.preventDefault();
}

let startWithLetter = [];

async function showAllContacts() {
    await fetch("https://gruppenarbeit-486join.developerakademie.net/smallest_backend_ever/database.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            let users = JSON.parse(data.users);
            for (let i = 0; i < users.length; i++) {
                let contactMemory = users[i]["name"];
                allUsers.push(contactMemory);
                allUsers.sort();
            }
            for (let i = 65; i < 90; i++) {
                let contacts = allUsers
                    .filter(function (contact) {
                        return contact.charAt(0).toUpperCase().charCodeAt(0) === i;
                    })
                    .map(function (contact) {
                        return contact.charAt(0).toUpperCase();
                    });
                if (contacts.length > 0) {
                    startWithLetter.push(contacts);
                }
            }
            if (data.tasks) {
                let tasks = JSON.parse(data.tasks);
            }
        })
}

// function openTask(currentTaskId) {
//     document.getElementById('openTaskBackground').style.display = 'flex';

//     let existingTask = tasks.find(u => u.taskId == currentTaskId)
//     let currentTask = tasks.indexOf(existingTask);

//     let openTaskContainer = document.getElementById('openTaskContainer');
//     openTaskContainer.innerHTML = '';
//     openTaskContainer.innerHTML = openTaskTemplate(currentTask);

//     renderAssignedUsers(currentTask);
// }

// function openTaskTemplate(currentTask) {
//     return `
//         <div id="openTask${currentTask}" class="openTask">
//             <div class="openTaskTop">
//                 <div>
//                     <span>${tasks[currentTask]['category']}</span>
//                 </div>
//                 <div onclick="closeTask()">
//                     <img src="../img/close.svg">
//                 </div>
//             </div>

//             <div class="openTaskHeader">
//                 <h1>${tasks[currentTask]['title']}</h1>
//                 <span>${tasks[currentTask]['description']}</span>
//             </div>

//             <div class="openTaskMain">

//                 <div class="openTaskDate">
//                     <div>Due date:</div>
//                     <div>${tasks[currentTask]['dueDate']}</div>
//                 </div>

//                 <div class="openTaskPriority">
//                     <div>Priority:</div>
//                     <div>
//                         <div>
//                             <span>${tasks[currentTask]['priorityValue']}</span>
//                             <img src="">
//                         </div>
//                     </div>
//                 </div>

//                 <div class="openTaskAssigned">
//                     <div>Assigned To:</div>
//                     <div id="assignedToContainer" class="assignedToContainer">

//                     </div>                
//                 </div>
//             </div>
//         </div>

//         <div class="openTaskButtonContainer">
//             <div class="deleteTaskButton" onclick="deleteTask(${currentTask})">
//                 <img src="./img/deleteTask.svg">
//             </div>
//             <div class="openTaskEditButton" onclick="editTask()">
//                 <img src="./img/editWhite.svg">
//             </div>

//         </div>
//     `;
// }

// function deleteTask(currentTask) {
//     //let existingTask = tasks.find(u => u.taskId == currentTaskId)
//     //let currentTask = tasks.indexOf(existingTask);

//     tasks.splice(currentTask, 1);
//     updateTasks();
//     updateHTML();
//     document.getElementById('openTaskBackground').style.display = 'none';

//     // <img onclick="deleteTask(${element["taskId"]})" src="../img/deleteBlue.svg">
//     //=> Template für generateToDoHTML / Task generieren
// }

// function renderAssignedUsers(currentTask) {
//     let assignedUsers = tasks[currentTask]['assignTo'];
//     let currentName = "";
//     // for (let i = 0; i < assignedUsers.length; i++) {

//     // let y = toDos[index]["assignTo"][i];
//     let x = users.filter(obj => {
//         assignedUsers.filter((x) => {
//             if (obj.userid == x) {
//                 currentName = obj.name;
//                 console.log(currentName)

//                 renderName(currentName);
//             }
//         })
//     });

// }

// function renderName(currentName) {
//     let shortName = currentName.split(' ').map(word => word.charAt(0)).join('');
//     document.getElementById('assignedToContainer').innerHTML += `
//     <div class="openTaskAssignedPerson">
//         <div>
//             <span>${shortName}</span>
//         </div>
//         <div>${currentName}</div>
//     </div>
// `;
// }

// function editTask(currentTask) {
    // document.getElementById('openTaskContainer').innerHTML = editOpenTaskTemplate(currentTask);

    // if(tasks[currentTask]['category'] == 'urgent'){
    //     selectUrgentEdit();
    // } else if(tasks[currentTask]['category'] == 'medium') {
    //     selectMediumEdit();
    // } else if(tasks[currentTask]['category'] == 'low') {
    //     selectLowEdit();
    // }

    // let titleEdit = document.getElementById('titleEdit');
    // titleEdit.value = tasks[currentTask]['title'];
    // let descriptionEdit = document.getElementById('descriptionEdit');
    // descriptionEdit.value = tasks[currentTask]['description'];

    // document.getElementById('editSelectCategory').value = tasks[currentTask]['category'];

    // renderAssignedUsersEdit(currentTask);
// }

// function closeTask() {
//     document.getElementById('openTaskBackground').style.display = 'none';
// }

function searchFunction() {
    let originalToDos = toDos;
    let input = document.getElementById('searchValue');
    input.addEventListener('input', debounce(function (event) {
        let selectedValue = event.target.value.trim();
        let newArray;
        if (selectedValue === '') {
            newArray = [...originalToDos];
            toDos = originalToDos;
        } else {
            newArray = toDos.filter(item => {
                if (item.description.includes(selectedValue) || item.title.includes(selectedValue)) {
                    return item;
                }
            });
            if (newArray.length === 0 || selectedValue.length > 0) {
                newArray = originalToDos.filter(item => {
                    if (item.description.includes(selectedValue) || item.title.includes(selectedValue)) {
                        return item;
                    }
                });
            }
        }
        toDos = newArray;
        updateHTML();
        if (toDos.length > 0) {
            Array.from(document.getElementsByClassName("boardContainer")).forEach((card) => {
                card.style.display = "block";
            });
        } else {
            Array.from(document.getElementsByClassName("boardContainer")).forEach((card) => {
                card.style.display = "none";
            });
        }
    }, 100));
}

/* =============================== SUMMARY FUNCTIONS =================================== */
function taskCounter() {
    let taskCounter = toDos.length;
    document.getElementById("taskCounter").innerHTML = `
    ${taskCounter}
    `;
}

function awaitingFeedbackCounter() {
    let awaitingFeedbackCounter = toDos.filter(t => t["statusCategory"] == "awaitingFeedback");
    awaitingFeedbackCounter = awaitingFeedbackCounter.length;
    document.getElementById("awaitingFeedbackCounter").innerHTML = `
    ${awaitingFeedbackCounter}
    `;
}

function inProgressCounter() {
    let inProgressCounter = toDos.filter(t => t["statusCategory"] == "inProgress");
    inProgressCounter = inProgressCounter.length;
    document.getElementById("inProgressCounter").innerHTML = `
    ${inProgressCounter}
    `;
}

function urgentCounter() {
    let urgentCounter = toDos.filter(t => t["priorityValue"] == "urgent");
    urgentCounter = urgentCounter.length;
    document.getElementById("urgentCounter").innerHTML = `
    ${urgentCounter}
    `;
}


function todoCounter() {
    let toDoCounter = toDos.filter(t => t["statusCategory"] == "toDo");
    toDoCounter = toDoCounter.length;
    document.getElementById("todoCounter").innerHTML = `
    ${toDoCounter}
    `;
}


function doneCounter() {
    let doneCounter = toDos.filter(t => t["statusCategory"] == "done");
    doneCounter = doneCounter.length;
    document.getElementById("doneCounter").innerHTML = `
    ${doneCounter}
    `;
}

function deadlineDate() {
    let sortedDueDate = toDos
        .filter((t) => t.dueDate)
        .map((t) => new Date(t.dueDate))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

    if (sortedDueDate.length === 0) {
        console.log("No valid due dates found.");
        return;
    }
    let currentDate = new Date();
    let closestDate = sortedDueDate.reduce((a, b) => Math.abs(b - currentDate) < Math.abs(a - currentDate) ? b : a);
    let closestDateString = closestDate.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
    document.getElementById("deadlineDate").innerHTML = closestDateString;
}


function greeting() {
    let currentdate = new Date();
    let datetime = currentdate.getHours();
    let greeting = "Good morning,";
    if (datetime > 12) {
        greeting = "Good evening,";
    }
    document.getElementById("greeting").innerHTML = `
    ${greeting}
    `;
}


function displayUserName() {
    let userName = localStorage.getItem("userName");
    let abbreviatedName = abbreviateName(userName, 10);
    document.getElementById("userName").innerHTML = `
    ${abbreviatedName}
    `;
}


function abbreviateName(name, maxLength) {
    if (name.length <= maxLength) {
        return name;
    } else {
        let words = name.split(' ');
        let firstWord = words[0];
        let secondWordInitial = words[1].charAt(0);
        return `${firstWord} ${secondWordInitial}.`;
    }
}

/* ================================== TOP BAR FUNCTION ============================================ */

function logout() {
    localStorage.removeItem("userName");
    window.location.href = 'index.html';
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function displayMainSummaryPage() {
    document.getElementById("mainSummaryContainerDisplay").style.display = "block";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
}

function displayMainBoardPage() {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "block";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
}

function displayMainAddTaskPage() {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "block";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
}

function displayMainContacsPage() {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "block";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
    initContacts();
}

function displayMainLegalNoticePage() {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "block";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
}

function displayMainHelpPage() {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "block";
}

// 27.04.2023

function openTask(currentTaskId) {
    document.getElementById('openTaskBackground').style.display = 'flex';

    let existingTask = tasks.find(u => u.taskId == currentTaskId)
    let currentTask = tasks.indexOf(existingTask);

    let openTaskContainer = document.getElementById('openTaskContainer');
    openTaskContainer.innerHTML = '';
    openTaskContainer.innerHTML = openTaskTemplate(currentTask);
    renderAssignedUsers(currentTask);
    prioritySymbol(currentTask);
}

function openTaskTemplate(currentTask, categoryColor) {
    return `
        <div id="openTask" class="openTask">
            <div class="openTaskTop">
                <div style="background-color: ${tasks[currentTask]['categoryColor']};">
                    <span>${tasks[currentTask]['category']}</span>
                </div>
                <div onclick="closeTask()">
                    <img src="../img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                <h1>${tasks[currentTask]['title']}</h1>
                <span>${tasks[currentTask]['description']}</span>
            </div>

            <div class="openTaskMain">

                <div class="openTaskDate">
                    <div>Due date:</div>
                    <div>${tasks[currentTask]['dueDate']}</div>
                </div>

                <div class="openTaskPriority">
                    <div>Priority:</div>
                    <div>
                        <div>
                            <button class="prioButton2" id="priority">
                            <span>${tasks[currentTask]['priorityValue']}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="openTaskAssigned">
                    <div>Assigned To:</div>
                    <div id="assignedToContainer" class="assignedToContainer">

                    </div>                
                </div>
            </div>
        </div>

        <div class="openTaskButtonContainer">
            <div class="deleteTaskButton" onclick="deleteTask(${currentTask})">
                <img src="./img/deleteTask.svg">
            </div>
            <div class="openTaskEditButton" onclick="editTask(${currentTask})">
                <img src="./img/editWhite.svg">
            </div>

        </div>
    `;
}

function deleteTask(currentTask) {
    tasks.splice(currentTask, 1);
    updateTasks();
    updateHTML();
    document.getElementById('openTaskBackground').style.display = 'none';

    // <img onclick="deleteTask(${element["taskId"]})" src="../img/deleteBlue.svg">
    //=> Template für generateToDoHTML / Task generieren
}

function renderAssignedUsers(currentTask) {
    let assignedUsers = tasks[currentTask]['assignTo'];

    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUser = assignedUsers[i];
        let existingAssignUser = users.find(u => u.userid == assignedUser)
        let currentAssignUser = users.indexOf(existingAssignUser);

        let assignName = users[currentAssignUser]['name'];
        let assignSurname = users[currentAssignUser]['surname'];
        let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);
        let assignColor = users[currentAssignUser]['userColor'];

        document.getElementById('assignedToContainer').innerHTML += `
            <div class="openTaskAssignedPerson">
                <div style="background-color: ${assignColor};">
                    <span>${assignFirstLetters.toUpperCase()}</span>
                </div>
                <div>${assignName} ${assignSurname}</div>
            </div>
        `;
    }

    //style="background-color: '${assignColor}';
}


/*     for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUser = assignedUsers[i];
        let existingAssignUser = users.find(u => u.userid == assignedUser)
        let currentAssignUser = users.indexOf(existingAssignUser);

        let assignName = users[currentAssignUser]['name'];
        let assignSurname = users[currentAssignUser]['surname'];
        let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);
        let assignColor = users[currentAssignUser]['color'];

        document.getElementById('assignedToContainerEdit').innerHTML +=  `
            <div class="openTaskAssignedPerson">
                <input type="checkbox" value="${users[currentAssignUser]['userid']}" checked>
                <div style="background-color: ${assignColor};">
                    <span>${assignFirstLetters.toUpperCase()}</span>
                </div>
                <div>${assignName} ${assignSurname}</div>
            </div>
        `; */

//style="background-color: '${assignColor}';

function prioritySymbol(currentTask) {
    let currentPriority = tasks[currentTask]['priorityValue'];
    let priority = document.getElementById('priority');

    if (currentPriority == 'urgent') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/urgentArrow.svg">`;
    } else if (currentPriority == 'medium') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/medium.svg">`;
    } else if (currentPriority == 'low') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/low.svg">`;
    }
}

function editTask(currentTask) {
    document.getElementById('openTaskContainer').innerHTML = editOpenTaskTemplate(currentTask);
    if (tasks[currentTask]['category'] == 'urgent') {
        selectUrgentEdit();
    } else if (tasks[currentTask]['category'] == 'medium') {
        selectMediumEdit();
    } else if (tasks[currentTask]['category'] == 'low') {
        selectLowEdit();
    }

    let titleEdit = document.getElementById('titleEdit');
    titleEdit.value = tasks[currentTask]['title'];
    let descriptionEdit = document.getElementById('descriptionEdit');
    descriptionEdit.value = tasks[currentTask]['description'];

    document.getElementById('editSelectCategory').value = tasks[currentTask]['category'];

    renderAssignedUsersEdit(currentTask);
}

function renderAssignedUsersEdit(currentTask) {
    addOrRemoveUser(currentTask)

    let assignedUsers = tasks[currentTask]['assignTo'];
    console.log(assignedUsers);
    for (let j = 0; j < assignedUsers.length; j++) {
        let userid = assignedUsers[j];
        let useridAsString = userid.toString();

        if (assignedUsers.includes(useridAsString)) {
            let assignedUser = assignedUsers[j];
            let existingAssignUser = users.find(u => u.userid == assignedUser)
            let currentAssignUser = users.indexOf(existingAssignUser);
            let assignName = users[currentAssignUser]['name'];
            let assignSurname = users[currentAssignUser]['surname'];
            let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);

    

            let assignColor = users[currentAssignUser]['userColor'];

            document.getElementById('assignedToContainerEdit').innerHTML += `
                <div class="openTaskAssignedPerson">
                    <input type="checkbox" class="checkbox-class" value="${existingAssignUser['userid']}" checked>
                    <div style="background-color: ${assignColor};">
                        <span>${assignFirstLetters}</span>
                    </div>
                    <div>${assignName} ${assignSurname}</div>
                </div>
            `;

        } else {
            document.getElementById('assignedToContainerEdit').innerHTML += `
            <div class="openTaskAssignedPerson">
                <input type="checkbox"  value="${users[j]['userid']}">
                <div style="background-color: ${users[j]['userColor']};">
                    <span>${assignFirstLetters}</span>
                </div>
                <div>${users[j]['name']} ${users[j]['surname']}</div>
            </div>
            `;
        }
    }
}

testValues = []

// function addOrRemoveUser() {
//     document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
//         checkbox.addEventListener('change', (event) => {
//     debugger

//             const selectedValue = event.target.value;
//             if (event.target.checked) {
//                 if (!testValues.includes(selectedValue)) { // Check for duplicates
//                     testValues.push(selectedValue);
//                 }
//             } else {
//                 const index = testValues.indexOf(selectedValue);
//                 if (index > -1) {
//                     testValues.splice(index, 1);
//                 }
//             }
//             console.log(testValues); // Print the selected values to the console
//         });
//     });
// }


function addOrRemoveUser(currentTask) {
    document.getElementById('assignedToContainerEdit').addEventListener('change', (event) => {
        if (event.target.matches('.checkbox-class')) {
            const selectedValue = event.target.value;
            if (event.target.checked) {
                if (!tasks[currentTask]['assignTo'].includes(selectedValue)) { // Check for duplicates
                    tasks[currentTask]['assignTo'].push(selectedValue);
                }
            } else {
                const index = tasks[currentTask]['assignTo'].indexOf(selectedValue);
                if (index > -1) {
                    tasks[currentTask]['assignTo'].splice(index, 1);
                }
            }
            console.log(tasks); // Print the selected values to the console
        }
    });
}



function editOpenTaskTemplate(currentTask) {
    return `
        <div id="openTask${currentTask}" class="openTask">
            <div class="openTaskTop">
                <div style="background-color: ${tasks[currentTask]['categoryColor']};">
                    <select class="selectCategory" name="category" id="editSelectCategory">
                        <option value="Marketing" style="background-color: #0038ff;">Marketing</option>
                        <option value="Media" style="background-color: #ffc702;">Media</option>
                        <option value="Backoffice" style="background-color: #1FD7C1;">Backoffice</option>
                        <option value="Design" style="background-color: #ff7a00;">Design</option>
                        <option value="Sales" style="background-color: #fc71ff;">Sales</option>
                    </select>
                </div>

                <div onclick="closeTask()">
                    <img src="../img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                <input placeholder="${tasks[currentTask]['title']}" id="titleEdit" required="">
                <input placeholder="${tasks[currentTask]['description']}" id="descriptionEdit" required="">
            </div>

            <div class="openTaskMain">

                <div class="openTaskDate openTaskDateEdit">
                    <div>Due date:</div>
                    <input class="date" type="date" id="editDueDate" value="${tasks[currentTask]['dueDate']}">
                </div>

                <div class="openTaskPriority openTaskPriorityEdit">
                    <div>Priority:</div>
                    <div>
                        <div class="prioButtons prioButtonsEdit">
                            <button class="urgent prioButtonEdit" id="urgentEdit" type="button" onclick="selectUrgentEdit()">
                                Urgent
                                <img id="imgUrgentEdit" src="./img/urgentArrow.svg">
                            </button>
                            <button class="medium prioButtonEdit" id="mediumEdit" type="button" onclick="selectMediumEdit()">
                                Medium
                                <img id="imgMediumEdit" src="./img/medium.svg">
                            </button>
                            <button class="low prioButtonEdit" id="lowEdit" type="button" onclick="selectLowEdit()">
                                Low
                                <img id="imgLowEdit" src="./img/low.svg">
                            </button>
                        </div>
                    </div>
                </div>

                <div class="openTaskAssigned">
                    <div>Assigned To:</div>
                    <div id="assignedToContainerEdit" class="assignedToContainer">

                    </div>                
                </div>
            </div>
        </div>

        <div class="openTaskButtonContainer">
            <div class="cancleTaskEditButton" onclick="closeTask()">
                Cancle
            </div>
            <div class="saveChangesTask" onclick="saveEditedTask(${currentTask})">
                Save
            </div>

        </div>
    `;
}

/* function addAssignedToListEdit() {
    document.getElementById('assignedToChoices').innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let userID = users[i]["userid"];
        // let contact = users[i];
        let name = users[i]["name"];
        document.getElementById('assignedToChoices').innerHTML += `
        <div class="assigned-to-line">
            <label for="assigned-to-${i}" id="assigned_name${i}">${name}</label>
            <input type="checkbox" id="assigned-to-${i}"value="${userID}">
        </div>`
    }
} */

function saveEditedTask(currentTask) {
    let editCategory = document.getElementById('editSelectCategory').value;

    //let firstLetter = editCategory.charAt(0).toUpperCase();
    //let remainingLetters = editCategory.slice(1);
    //let editCategoryCorrect = firstLetter + remainingLetters;

    tasks[currentTask]['category'] = editCategory;
    tasks[currentTask]['categoryColor'] = addBackgroundColorCategory(editCategory);
    tasks[currentTask]['title'] = document.getElementById('titleEdit').value;
    tasks[currentTask]['description'] = document.getElementById('descriptionEdit').value;
    tasks[currentTask]['dueDate'] = document.getElementById('editDueDate').value;
    tasks[currentTask]['priorityValue'] = priorityEdit;
    //tasks[currentTask]['assignTo'] = 
    //let assignTo = selectedValues;

    updateTasks();
    updateHTML();
    document.getElementById('openTaskBackground').style.display = 'none';

    setTimeout(saveSelectedPriority, 1500);
}



function closeTask() {
    document.getElementById('openTaskBackground').style.display = 'none';
}