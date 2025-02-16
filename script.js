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
    await init();
    pushArrayToDo();
    updateHTML();
    searchFunction();
    counters();
    addAssignedToList();
    setDateToday();
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
let subtasks = [];
let priorityValueEdit;
let usersTaskEdit = [];
let startWithLetter = [];
let currentSubTask = '';
/* ========================================= BOARD FUNCTIONS ========================================= */
function saveSelectedUsersEdit(currentTask) {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (event.target.checked) {
                if (!tasks[currentTask]['assignTo'].includes(selectedValue)) { // Check for duplicates
                    tasks[currentTask]['assignTo'] = [... new Set(tasks[currentTask]['assignTo'])]
                    tasks[currentTask]['assignTo'].push(selectedValue);
                }
            } else {
                const index = tasks[currentTask]['assignTo'].indexOf(selectedValue);
                if (index > -1) {
                    tasks[currentTask]['assignTo'] = [... new Set(tasks[currentTask]['assignTo'])]
                    tasks[currentTask]['assignTo'].splice(index, 1);
                }
            }
        });
    });
};

function updateHTML() {
    if (tasks.length > 0) {
        for (let index = 0; index < tasks.length; index++) {
            let taskId = tasks[index]["taskId"];
            toDoFilter(index, taskId);
            inProgresFilter(index, taskId);
            awaitingFeedback(index, taskId);
            done(index, taskId);
        }
        for (let i = 0; i < tasks.length; i++) {
            calculateProgressbar(i);
        }
        createBubbles();
    }
}

function toDoFilter(index, taskId) {
    let toDo = tasks.filter(t => t["statusCategory"] == "toDo");
    document.getElementById("toDoCard").innerHTML = ``;
    for (let i = 0; i < toDo.length; i++) {
        let element = toDo[i];
        document.getElementById("toDoCard").innerHTML += generateToDoHTML(element, index);
        document.getElementsByClassName("beforeStatusCatergorytoDo")[i].style.display = "none";
    }
}

function inProgresFilter(index, taskId) {
    let inProgress = tasks.filter(t => t["statusCategory"] == "inProgress");
    document.getElementById("inProgress").innerHTML = ``;
    for (let i = 0; i < inProgress.length; i++) {
        let element = inProgress[i];
        document.getElementById("inProgress").innerHTML += generateToDoHTML(element, index);
    }
}

function awaitingFeedback(index, taskId) {
    let awaitingFeedback = tasks.filter(t => t["statusCategory"] == "awaitingFeedback");
    document.getElementById("awaitingFeedback").innerHTML = ``;
    for (let i = 0; i < awaitingFeedback.length; i++) {
        let element = awaitingFeedback[i];
        document.getElementById("awaitingFeedback").innerHTML += generateToDoHTML(element, index);
    }
}

function done(index, taskId) {
    let done = tasks.filter(t => t["statusCategory"] == "done");
    document.getElementById("done").innerHTML = ``;
    for (let i = 0; i < done.length; i++) {
        let element = done[i];
        document.getElementById("done").innerHTML += generateToDoHTML(element, index);
        document.getElementsByClassName("nextStatusCatergorydone")[i].style.display = "none";
    }
}

function pushArrayToDo() {
    toDos = tasks;
}

function generateToDoHTML(element, index) {
    let subTaskLength = element["subTaskArray"].length;
    let totallyCompletedSubTasks = element["subTaskArray"].filter((item) => {
        return item.isCompleted == true
    });
    let progressBarWidth = (totallyCompletedSubTasks.length / subTaskLength) * 100;
    let progressBarHTML = '';
    if (element.hasOwnProperty('subTaskArray') && subTaskLength > 0) {
        progressBarHTML = `
            <div class="boardContainerProgress" onclick="openTask(${element["taskId"]})" >
                <div class="progress">
                    <div class="progressBar" role="progressbar" style="width:${progressBarWidth}%;" aria-valuenow="0" aria-valuemin="0"
                        aria-valuemax="100">
                    </div>
                </div>
                <div class="progressInNumbers">
                    ${totallyCompletedSubTasks.length} / ${subTaskLength} Done
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
                <span class="boardContainerDescriptonSpan">${element["description"]}</span>
            </div>
            ${progressBarHTML}
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["taskId"]}"></div>
                <div>
                    <img class="priorityImg" src="img/${element["priorityValue"]}.svg">
                </div>
            </div>
            
            <div class="dragAndDropArrows">
                <img src="img/upArrow.svg" onclick="beforeStatusCatergory(${element["taskId"]}, '${element["statusCategory"]}', event,)" class="beforeStatusCatergory${element["statusCategory"]}">
                <img src="img/downArrow.svg" onclick="nextStatusCatergory(${element["taskId"]}, '${element["statusCategory"]}', event,)" class="nextStatusCatergory${element["statusCategory"]}">
            </div> 
            
            </div>
            `;
}

function getFirstLetter(index, i) {
    if (i < tasks[index]["assignTo"].length) {
        let y = tasks[index]["assignTo"][i];
        let x = users.filter(obj => {
            if (obj.userid == y) {
                return obj.name;
            }
        });
        let x1 = users.filter(obj => {
            if (obj.userid == y) {
                return obj.surname;
            }
        });
        x = x[0]["name"].split(' ').map(word => word.charAt(0)).join('');
        x1 = x1[0]["surname"].split(' ').map(word => word.charAt(0)).join('');
        let xx1 = x.toUpperCase() + x1.toUpperCase();
        return xx1;
    }
}

function createBubbles() {
    for (let j = 0; j < tasks.length; j++) {
        let bubbleTaskId = tasks[j]["taskId"];
        if (tasks[j]["assignTo"].length < 3) {
            createTwoBubbles(j, bubbleTaskId);
        }
        else if (tasks[j]["assignTo"].length >= 3) {
            createMoreThanTwoBubbles(j, bubbleTaskId)
        }
    }
}

function createTwoBubbles(j, bubbleTaskId) {
    for (let i = 0; i < tasks[j]["assignTo"].length; i++) {
        let name = getFirstLetter(j, i);
        document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
            <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
            `;
        let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);
        let currentUserId = tasks[j]['assignTo'][i];
        let existingUser = users.find(u => u.userid == parseInt(currentUserId));
        let correctUser = users.indexOf(existingUser);
        let correctUserBg = users[correctUser]['userColor']
        userBubbleOne.style.backgroundColor = correctUserBg;
    }
}

function createMoreThanTwoBubbles(j, bubbleTaskId) {
    for (let i = 0; i < 2; i++) {
        let name = getFirstLetter(j, i);
        document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
        <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
        `;
        let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);
        let currentUserId = tasks[j]['assignTo'][i];
        let existingUser = users.find(u => u.userid == parseInt(currentUserId));
        let correctUser = users.indexOf(existingUser);
        let correctUserBg = users[correctUser]['userColor']
        userBubbleOne.style.backgroundColor = correctUserBg;
    }
    let remainingCount = tasks[j]["assignTo"].length - 2;
    document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
    <div class="userBubbleOne" id="userBubbleOne${[j]}${[2]}">+${remainingCount}</div>
    `;
    let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[2]}`);
    userBubbleOne.style.backgroundColor = "black";
}


function calculateProgressbar(index) {
    let subTaskLength = tasks[index]["subTaskArray"].length;
    let totallyCompletedSubTasks = tasks[index]["subTaskArray"].filter((item) => {
        return item.isCompleted == true
    });
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
    currentDraggedElement = tasks.findIndex(obj => obj.taskId === id);
}

function moveTo(statusCategory) {
    tasks[currentDraggedElement]["statusCategory"] = statusCategory;
    updateTasks();
    updateHTML();
}

async function updateTasks() {
    let tasksAsString = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsString);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function openTask(currentTaskId) {
    document.getElementById('openTaskBackground').style.display = 'flex';
    let existingTask = tasks.find(u => u.taskId == currentTaskId)
    let currentTask = tasks.indexOf(existingTask);
    let openTaskContainer = document.getElementById('openTaskContainer');
    openTaskContainer.innerHTML = '';
    openTaskContainer.innerHTML = openTaskTemplate(currentTask);
    displaySubTaskAndCompleted(currentTask);
    renderAssignedUsers(currentTask);
    prioritySymbol(currentTask);
}

function displaySubTasks(currentTask) {
    currentSubTask = tasks[currentTask]['subTaskArray'];
    for (let i = 0; i < currentSubTask.length; i++) {
        let currentSubTaskIndex = tasks[currentTask]['subTaskArray'][i];
        document.getElementById("subTaskContainer").innerHTML += `
        <input type="checkbox" ${currentSubTaskIndex.isCompleted ? "checked" : ""} onChange='updateCheckSubTask(${i}, checked, ${currentTask})'>
        ${currentSubTaskIndex.subTask} <br>
        `;
    }
    return currentSubTask;
}

function updateCheckSubTask(i, checked, currentTask) {
    tasks[currentTask]['subTaskArray'][i].isCompleted = checked;
}

function displaySubTaskAndCompleted(currentTask) {
    currentSubTask = tasks[currentTask]['subTaskArray'];
    for (let i = 0; i < currentSubTask.length; i++) {
        let currentSubTaskIndex = tasks[currentTask]['subTaskArray'][i];
        let completed = "Not Complete";
        if (currentSubTaskIndex.isCompleted == true) {
            completed = "Complete"
        }
        document.getElementById("displaySubTaskAndComplete").innerHTML += `
        ${currentSubTaskIndex.subTask}: ${completed} <br>
        `;
    }
}

function openTaskTemplate(currentTask, categoryColor) {
    return `
        <div id="openTask" class="openTask">
            <div class="openTaskTop">
                <div style="background-color: ${tasks[currentTask]['categoryColor']};">
                    <span>${tasks[currentTask]['category']}</span>
                </div>
                <div onclick="closeTask()">
                    <img src="img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                 <h2>${tasks[currentTask]['title']}</h2>
                 <span class="boardContainerDescriptonSpan">${tasks[currentTask]['description']}</span>
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
                            <span id="priorityValueTest">${tasks[currentTask]['priorityValue']}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                    Sub Task:
                    </div>
                </div>
                    <div id="displaySubTaskAndComplete">
                    </div>

                <div class="openTaskAssigned">
                     <div>Assigned To:</div>
                     <div id="assignedToContainer" class="assignedToContainer">

                    </div>                
                </div>
            </div>
            
            <div class="openTaskButtonContainer">
                <div class="deleteTaskButton" onclick="deleteTask(${currentTask})">
                    <img src="img/deleteTask.svg">
                </div>
                <div class="openTaskEditButton" onclick="editTask(${currentTask})">
                    <img src="img/editWhite.svg">
                </div>
            </div>


        </div>

     `;
}

function deleteTask(currentTask) {
    tasks.splice(currentTask, 1);
    updateTasks();
    updateHTML();
    document.getElementById('openTaskBackground').style.display = 'none';
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
        generateAssignedToHTML(assignedUser, existingAssignUser, currentAssignUser, assignName, assignSurname, assignFirstLetters, assignColor);
    }
}

function generateAssignedToHTML(assignedUser, existingAssignUser, currentAssignUser, assignName, assignSurname, assignFirstLetters, assignColor) {
    document.getElementById('assignedToContainer').innerHTML += `
    <div class="openTaskAssignedPerson">
        <div style="background-color: ${assignColor};">
            <span>${assignFirstLetters.toUpperCase()}</span>
        </div>
        <div>${assignName} ${assignSurname}</div>
    </div>
`;
}

function prioritySymbol(currentTask) {
    let currentPriority = tasks[currentTask]['priorityValue'];
    let priority = document.getElementById('priority');
    if (currentPriority == 'urgent') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="img/urgentArrow.svg">`;
    } else if (currentPriority == 'medium') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="img/medium.svg">`;
    } else if (currentPriority == 'low') {
        priority.innerHTML += `<img id="openTaskImgPriority" src="img/low.svg">`;
    }
}

function editTask(currentTask) {
    document.getElementById('openTaskContainer').innerHTML = editOpenTaskTemplate(currentTask);
    displaySubTasks(currentTask);
    document.getElementById('openTaskContainer').classList.remove('openTaskContainerHeight');
    let titleEdit = document.getElementById('titleEdit');
    titleEdit.value = tasks[currentTask]['title'];
    let descriptionEdit = document.getElementById('descriptionEdit');
    descriptionEdit.value = tasks[currentTask]['description'];
    document.getElementById('editSelectCategory').innerHTML = testSelectedCategorys(currentTask);
    document.getElementById('editSelectCategory').value = tasks[currentTask]['category'];
    let assignedUsersToCurrentTask = tasks[currentTask]['assignTo'];
    for (let i = 0; i < assignedUsersToCurrentTask.length; i++) {
        let assignedUser = assignedUsersToCurrentTask[i];
        usersTaskEdit.push(assignedUser);
    }
    renderUrgency(currentTask);
    renderAssignedUsersEdit(currentTask);
}

function editOpenTaskTemplate(currentTask) {
    return `
        <div id="openTask${currentTask}" class="openTask">
            <div class="openTaskTop">

                <div style="background-color: ${tasks[currentTask]['categoryColor']};">
                <select class="selectCategory" name="category" id="editSelectCategory">
                </select>
                </div>

                <div onclick="closeTask()">
                    <img src="img/close.svg">
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
                    <div style="width: 100%;">
                        <div class="prioButtons prioButtonsEdit">
                            <button class="urgent prioButtonEdit" id="urgentEdit" type="button" onclick="selectUrgentEdit(), savePriorityValueEdit('urgent')">
                                Urgent
                                <img id="imgUrgentEdit" src="img/urgentArrow.svg">
                            </button>
                            <button class="medium prioButtonEdit" id="mediumEdit" type="button" onclick="selectMediumEdit(), savePriorityValueEdit('medium')">
                                Medium
                                <img id="imgMediumEdit" src="img/medium.svg">
                            </button>
                            <button class="low prioButtonEdit" id="lowEdit" type="button" onclick="selectLowEdit(), savePriorityValueEdit('low')">
                                Low
                                <img id="imgLowEdit" src="img/low.svg">
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                    Sub Task:
                    </div>
                </div>
                <div id="subTaskContainer">
                </div>

                <div class="openTaskAssigned">
                    <div>Assigned To:</div>
                    <div id="assignedToContainerEdit" class="assignedToContainer">

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

        </div>
            `;
}

function testSelectedCategorys(currentTask) {
    if (tasks[currentTask]['category'] == 'Marketing' || tasks[currentTask]['category'] == 'Media' || tasks[currentTask]['category'] == 'Backoffice' || tasks[currentTask]['category'] == 'Design' || tasks[currentTask]['category'] == 'Sales') {
        return `
    <option value="Marketing" style="background-color: #0038ff;">Marketing</option>
    <option value="Media" style="background-color: #ffc702;">Media</option>
    <option value="Backoffice" style="background-color: #1FD7C1;">Backoffice</option>
    <option value="Design" style="background-color: #ff7a00;">Design</option>
    <option value="Sales" style="background-color: #fc71ff;">Sales</option>
    `
    } else {
        return `
        <option value="Marketing" style="background-color: #0038ff;">Marketing</option>
        <option value="Media" style="background-color: #ffc702;">Media</option>
        <option value="Backoffice" style="background-color: #1FD7C1;">Backoffice</option>
        <option value="Design" style="background-color: #ff7a00;">Design</option>
        <option value="Sales" style="background-color: #fc71ff;">Sales</option>
        <option value="${tasks[currentTask]['category']}" style="background-color: ${tasks[currentTask]['categoryColor']}">${tasks[currentTask]['category']}</option>
        `
    }
}

function renderUrgency(currentTask) {
    if (tasks[currentTask]['priorityValue'] == 'urgent') {
        selectUrgentEdit();
    } else if (tasks[currentTask]['priorityValue'] == 'medium') {
        selectMediumEdit();
    } else if (tasks[currentTask]['priorityValue'] == 'low') {
        selectLowEdit();
    }
}

function renderAssignedUsersEdit(currentTask) {
    let assignedUsers = tasks[currentTask]['assignTo'];
    for (let j = 0; j < users.length; j++) {
        let userid = users[j]['userid'];
        let assignName = users[j]['name'];
        let assignSurname = users[j]['surname'];
        let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);
        if (assignedUsers.includes(userid.toString())) {
            createAssignedUsersChecked(j, userid, assignFirstLetters, currentTask);
        } else {
            createAssignedUsers(j, userid, assignFirstLetters, currentTask);
        }
    }
}

function createAssignedUsersChecked(j, userid, assignFirstLetters, currentTask) {
    document.getElementById('assignedToContainerEdit').innerHTML += `
    <div class="openTaskAssignedPerson" onclick="saveSelectedUsersEdit(${currentTask})">
        <input type="checkbox" value="${users[j]['userid']}" checked>
        <div style="background-color: ${users[j]['userColor']};">
            <span>${assignFirstLetters}</span>
        </div>
        <div>${users[j]['name']} ${users[j]['surname']}</div>
    </div>
`;
}

function createAssignedUsers(j, userid, assignFirstLetters, currentTask) {
    document.getElementById('assignedToContainerEdit').innerHTML += `
    <div class="openTaskAssignedPerson" onclick="saveSelectedUsersEdit(${currentTask})">
        <input type="checkbox" value="${users[j]['userid']}">
        <div style="background-color: ${users[j]['userColor']};">
            <span>${assignFirstLetters}</span>
        </div>
        <div>${users[j]['name']} ${users[j]['surname']}</div>
    </div>
`;
}

function saveEditedTask(currentTask) {
    let editCategory = document.getElementById('editSelectCategory').value;
    tasks[currentTask]['category'] = editCategory;
    tasks[currentTask]['categoryColor'] = addBackgroundColorCategory(editCategory);
    tasks[currentTask]['title'] = document.getElementById('titleEdit').value;
    tasks[currentTask]['description'] = document.getElementById('descriptionEdit').value;
    tasks[currentTask]['dueDate'] = document.getElementById('editDueDate').value;
    if (priorityValueEdit) {
        tasks[currentTask]['priorityValue'] = priorityValueEdit;
    }
    tasks[currentTask]['assignTo'] = [... new Set(tasks[currentTask]['assignTo'])];
    updateTasks();
    updateHTML();
    document.getElementById('openTaskBackground').style.display = 'none';
    document.getElementById('openTaskContainer').classList.add('openTaskContainerHeight');
}

function savePriorityValueEdit(priority) {
    priorityValueEdit = priority;
}

function closeTask() {
    document.getElementById('openTaskBackground').style.display = 'none';
    document.getElementById('openTaskContainer').classList.add('openTaskContainerHeight');
}

function searchFunction() {
    let originalToDos = tasks;
    let input = document.getElementById('searchValue');
    input.addEventListener('input', debounce(function (event) {
        let selectedValue = event.target.value.trim();
        selectedValue = selectedValue.toLowerCase();
        let newArray;
        if (selectedValue === '') {
            newArray = [...originalToDos];
            tasks = originalToDos;
        } else {
            newArray = tasks.filter(item => {
                if (item.description.toLowerCase().includes(selectedValue) || item.title.toLowerCase().includes(selectedValue)) {
                    return item;
                }
            });
            if (newArray.length === 0 || selectedValue.length > 0) {
                newArray = originalToDos.filter(item => {
                    if (item.description.toLowerCase().includes(selectedValue) || item.title.toLowerCase().includes(selectedValue)) {
                        return item;
                    }
                });
            }
        }
        tasks = newArray;
        updateHTML();
        if (tasks.length > 0) {
            Array.from(document.getElementsByClassName("boardContainer")).forEach((card) => {
                card.style.display = "block";
            });
        } else {
            Array.from(document.getElementsByClassName("boardContainer")).forEach((card) => {
                card.style.display = "none";
            });
        }
    }, 200));
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            input.dispatchEvent(new Event('input'));
        }
    });
}

/* =============================== SUMMARY FUNCTIONS =================================== */
function taskCounter() {
    let taskCounter = tasks.length;
    document.getElementById("taskCounter").innerHTML = `
    ${taskCounter}
    `;
}

function awaitingFeedbackCounter() {
    let awaitingFeedbackCounter = tasks.filter(t => t["statusCategory"] == "awaitingFeedback");
    awaitingFeedbackCounter = awaitingFeedbackCounter.length;
    document.getElementById("awaitingFeedbackCounter").innerHTML = `
    ${awaitingFeedbackCounter}
    `;
}

function inProgressCounter() {
    let inProgressCounter = tasks.filter(t => t["statusCategory"] == "inProgress");
    inProgressCounter = inProgressCounter.length;
    document.getElementById("inProgressCounter").innerHTML = `
    ${inProgressCounter}
    `;
}

function urgentCounter() {
    let urgentCounter = tasks.filter(t => t["priorityValue"] == "urgent");
    urgentCounter = urgentCounter.length;
    document.getElementById("urgentCounter").innerHTML = `
    ${urgentCounter}
    `;
}

function todoCounter() {
    let toDoCounter = tasks.filter(t => t["statusCategory"] == "toDo");
    toDoCounter = toDoCounter.length;
    document.getElementById("todoCounter").innerHTML = `
    ${toDoCounter}
    `;
}

function doneCounter() {
    let doneCounter = tasks.filter(t => t["statusCategory"] == "done");
    doneCounter = doneCounter.length;
    document.getElementById("doneCounter").innerHTML = `
    ${doneCounter}
    `;
}

function deadlineDate() {
    let sortedDueDate = tasks
        .filter((t) => t.dueDate)
        .map((t) => new Date(t.dueDate))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

    if (sortedDueDate.length === 0) {
        console.log("No valid due dates found.");
        document.getElementById("deadlineDate").innerHTML = "";
        return;
    }

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the current date to midnight to only compare dates

    let closestDate = sortedDueDate.reduce((a, b) => Math.abs(b - currentDate) < Math.abs(a - currentDate) ? b : a);
    let closestDateCopy = new Date(closestDate);
    closestDateCopy.setHours(0, 0, 0, 0); // Normalize closestDate to midnight

    let closestDateString = closestDate.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

    if (closestDateCopy < currentDate) {
        document.getElementById("deadlineDate").innerHTML = "";
    } else {
        if (closestDateCopy.getTime() === currentDate.getTime()) {
            closestDateString = "Today";
        }
        document.getElementById("deadlineDate").innerHTML = closestDateString;
    }
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
    if (userName == undefined) {
        document.getElementById("userName").innerHTML = 'Guest';

    } else {
        document.getElementById("userName").innerHTML = `
        ${abbreviatedName}
        `;
    }
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

function displayPage(pageId) {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
    document.getElementById(pageId).style.display = "block";
    if (pageId == 'mainAddTaskContainerDisplay') {
        let dueDateInput = document.getElementById('dueDate');
        let today = new Date();
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');
        let formattedDate = `${year}-${month}-${day}`;
        dueDateInput.value = formattedDate;
    }
}

function selectYourOwnCategory() {
    Array.from(document.getElementsByClassName("category")).forEach((item) => {
        item.style.display = 'none';
    });
    document.getElementsByClassName("selectWrapper")[0].style.display = 'none';
    document.getElementById("selectYourOwnCategoryItem").style.display = 'block';
}

function cancelYourOwnCategory() {
    Array.from(document.getElementsByClassName("category")).forEach((item) => {
        item.style.display = 'flex';
    });
    document.getElementsByClassName("selectWrapper")[0].style.display = 'block';
    document.getElementById("selectYourOwnCategoryItem").style.display = 'none';
}

function lockYourOwnCategory() {
    Array.from(document.getElementsByClassName("category")).forEach((item) => {
        item.style.display = 'flex';
    });
    let category = categoryValue ? categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1) : '';
    let categoryColor = category ? addBackgroundColorCategory(category) : '';
    let errorMessage = '';
    if (!categoryColor) {
        errorMessage += 'Category Color is missing.\n';
    }
    if (errorMessage != '') {
        displayTaskErrorPopup('taskError', errorMessage);
        return
    }
    document.getElementsByClassName("selectWrapper")[0].style.display = 'block';
    document.getElementById("selectYourOwnCategoryItem").style.display = 'none';
    categoryValue = document.getElementById("enterYourOwnCategoryInputId").value;
    document.getElementById("selectCategory").innerHTML = `
    <div>
        ${categoryValue}<div class="circle" style="background: ${ownCategoryBackgroundColor};"></div>
    </div>
    `;
}

function saveOwnCategoryBackgroundColor(color, element) {
    ownCategoryBackgroundColor = color;
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => circle.classList.remove('selected'));
    element.classList.add('selected');
}