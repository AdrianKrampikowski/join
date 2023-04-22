/* ================================== INCLUDE HTML ================================================== */
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
                userBubbleOne.style.backgroundColor = users[j]["userColor"];
            }
        }
        else if (toDos[j]["assignTo"].length > 3) {
            for (let i = 0; i < 2; i++) {
                let name = getFirstLetter(j, i);
                document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
                    <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
                    `;
                let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);
                userBubbleOne.style.backgroundColor = users[j]["userColor"];
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

function openTaskTemplate(currentTask) {
    return `
        <div id="openTask${currentTask}" class="openTask">
            <div class="openTaskTop">
                <div>
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
    //let existingTask = tasks.find(u => u.taskId == currentTaskId)
    //let currentTask = tasks.indexOf(existingTask);

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

        let assignColor = users[currentAssignUser]['color'];
        
        document.getElementById('assignedToContainer').innerHTML +=  `
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

function prioritySymbol(currentTask) {
    let currentPriority = tasks[currentTask]['priorityValue'];
    let priority = document.getElementById('priority');

    if(currentPriority == 'urgent') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/urgentArrow.svg">`;
    } else if (currentPriority == 'medium') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/medium.svg">`;
    } else if (currentPriority == 'low') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="./img/low.svg">`;
    }
}

function editTask(currentTask) {
    document.getElementById('openTaskContainer').innerHTML = `
        <div id="openTask${currentTask}" class="openTask">
            <div class="openTaskTop">
                <div>
                    <span>${tasks[currentTask]['category']}</span>
                </div>
                <div onclick="closeTask()">
                    <img src="../img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                <input type="text" placeholder="${tasks[currentTask]['title']}">
                <input type="text" placeholder="${tasks[currentTask]['description']}">
            </div>

            <div class="openTaskMain">
                <div class="openTaskDate">
                    <div>Due date:</div>
                    <input type="date" placeholder="${tasks[currentTask]['dueDate']}">
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

function closeTask() {
    document.getElementById('openTaskBackground').style.display = 'none';
}

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