//Source: https://developer-akademie.teachable.com/courses/902235/lectures/31232815
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    updateHTML();

}

let toDos = [{
    "id": 0,
    "title": "Design",
    "headline": "Website redesign",
    "description": "Modify the contents of the main website...",
    "numerator": "1",
    "denominator": "2",
    "category": "toDo"
}, {
    "id": 1,
    "title": "Sales",
    "headline": "Call potential clients",
    "description": "Make the product presen-tation to prospective buyers",
    "numerator": "1",
    "denominator": "1",
    "category": "inProgress"
}, {
    "id": 2,
    "title": "Backoffice",
    "headline": "Accounting invoices",
    "description": "Write open invoices for customer",
    "numerator": "1",
    "denominator": "3",
    "category": "awaitingFeedback"
}, {
    "id": 3,
    "title": "Marketing",
    "headline": "Social media strategy",
    "description": "Develop an ad campaign for brand positioning",
    "numerator": "1",
    "denominator": "5",
    "category": "done"
}];

// let newUsers = [{
//     "id": 0,
//     "name": "Adrian",
//     "surname": "Krampikowski"
// }, {
//     "id": 1,
//     "name": "Tobias",
//     "surname": "Odermatt"
// }, {
//     "id": 2,
//     "name": "Fausto",
//     "surname": "Oliveira"
// }, {
//     "id": 3,
//     "name": "test",
//     "surname": "test"
// }];

let userChar = [];
let allUsers = [];

let currentDraggedElement;
showAllContacts();
function updateHTML() {

    let toDo = toDos.filter(t => t["category"] == "toDo");
    document.getElementById("toDoCard").innerHTML = ``;
    for (let i = 0; i < toDo.length; i++) {
        let element = toDo[i];
        document.getElementById("toDoCard").innerHTML += generateToDoHTML(element);
    }

    let inProgress = toDos.filter(t => t["category"] == "inProgress");
    document.getElementById("inProgress").innerHTML = ``;
    for (let i = 0; i < inProgress.length; i++) {
        let element = inProgress[i];
        document.getElementById("inProgress").innerHTML += generateToDoHTML(element);
    }

    let awaitingFeedback = toDos.filter(t => t["category"] == "awaitingFeedback");
    document.getElementById("awaitingFeedback").innerHTML = ``;
    for (let i = 0; i < awaitingFeedback.length; i++) {
        let element = awaitingFeedback[i];
        document.getElementById("awaitingFeedback").innerHTML += generateToDoHTML(element);
    }

    let done = toDos.filter(t => t["category"] == "done");
    document.getElementById("done").innerHTML = ``;
    for (let i = 0; i < done.length; i++) {
        let element = done[i];
        document.getElementById("done").innerHTML += generateToDoHTML(element);
    }

    for (let i = 0; i < toDos.length; i++) {
        calculateProgressbar(i);
    }
    createBubbles();
}

function generateToDoHTML(element) {
    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element['id']})">

            <div class="boardContainerTop">
                ${element["title"]}
            </div>

            <div class="boardContainerHeadline">
                <h2>${element["headline"]}</h2>
            </div>

            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>

            <div class="boardContainerProgress">
                <div class="progress">
                    <div class="progressBar" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                        aria-valuemax="100">
                    </div>
                </div>
            <div class="progressInNumbers">
                ${element["numerator"]}
                /
                ${element["denominator"]}
                Done
            </div>
            </div>

                <div class="boardContainerUserBubbles">
                    <div class="userBubble" id="userBubble${element["id"]}">
                    </div>

                    <div>
                        <img src="img/greenArrow.svg">
                    </div>

                </div>

        </div>
        `;
}


function getFirstLetter(i) {
    if (i < allUsers.length) {
        let x = allUsers[i];
        x = x.split(' ').map(word => word.charAt(0)).join('');
        return x;
    }
}

function createBubbles() {
    if (allUsers.length > 3) {
        let Counter = allUsers.length
        for (let j = 0; j < toDos.length; j++) {
            for (let i = 0; i < 2; i++) {
                let name = getFirstLetter(i)
                document.getElementById(`userBubble${[j]}`).innerHTML += `
                    <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
                    `;
                let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);
                userBubbleOne.style.backgroundColor = changeColorBubble();
            }
        }
        for (let j = 0; j < toDos.length; j++) {
            let remainingCount = Counter - 2;
            document.getElementById(`userBubble${[j]}`).innerHTML += `
                <div class="userBubbleOne" id="userBubbleOne${[j]}${[2]}">+${remainingCount}</div>
                `;
            let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[2]}`);
            userBubbleOne.style.backgroundColor = "black";
        }
    } else {
        for (let j = 0; j < toDos.length; j++) {
            for (let i = 0; i < allUsers.length; i++) {
                let name = getFirstLetter(i)
                document.getElementById(`userBubble${[j]}`).innerHTML += `
                    <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>
                    `;
                let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[i]}`);
                userBubbleOne.style.backgroundColor = changeColorBubble();
            }
        }
    }
}

function calculateProgressbar(index) {
    let x = toDos[index]["numerator"] / toDos[index]["denominator"];
    x = x * 100;
    let progressBarElements = document.getElementsByClassName("progressBar");
    progressBarElements[index].style.width = x + "%";
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
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

//Source: www.w3schools.com/html/html5_draganddrop.asp
function startDragging(id) {
    currentDraggedElement = id;
}


function moveTo(category) {
    toDos[currentDraggedElement]['category'] = category;
    updateHTML();
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
            const users = JSON.parse(data.users);
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
        })

}

setTimeout(() => {
    taskCounter();
    inProgressCounter();
    awaitingFeedbackCounter();
    todoCounter();
    doneCounter();

    greeting();
    displayUserName();
}, 100);

function taskCounter() {
    let taskCounter = toDos.length
    document.getElementById("taskCounter").innerHTML = `
    ${taskCounter}
    `;
}

function awaitingFeedbackCounter() {
    let awaitingFeedbackCounter = toDos.filter(t => t["category"] == "awaitingFeedback");
    awaitingFeedbackCounter = awaitingFeedbackCounter.length;
    document.getElementById("awaitingFeedbackCounter").innerHTML = `
    ${awaitingFeedbackCounter}
    `;
}

function inProgressCounter() {
    let inProgressCounter = toDos.filter(t => t["category"] == "inProgress");
    inProgressCounter = inProgressCounter.length;
    document.getElementById("inProgressCounter").innerHTML = `
    ${inProgressCounter}
    `;
}

function urgenCounter() {
    // Fehlt noch
}

function todoCounter() {
    let toDoCounter = toDos.filter(t => t["category"] == "toDo");
    toDoCounter = toDoCounter.length;
    document.getElementById("todoCounter").innerHTML = `
    ${toDoCounter}
    `;
}

function doneCounter() {
    let doneCounter = toDos.filter(t => t["category"] == "done");
    doneCounter = doneCounter.length;
    document.getElementById("doneCounter").innerHTML = `
    ${doneCounter}
    `;
}

function deadlineDate(){
    // Fehlt von AddTask
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
        // If the name is already short enough, just return it as is
        return name;
    } else {
        // Otherwise, abbreviate the name by taking the first letter of each word
        // and adding an ellipsis at the end
        // let words = name.split(' ');
        // let initials = words.map(word => word.charAt(0)).join('');
        // return initials;
        let words = name.split(' ');
        let firstWord = words[0];
        let secondWordInitial = words[1].charAt(0);
        return `${firstWord} ${secondWordInitial}.`;
    }
}


function logout() {
    localStorage.removeItem("userName");
    window.location.href = 'index.html';
}

// function conlogAllContacts() {
//     let startWithLetter = [];
//     for (let i = 65; i < 90; i++) {
//         for (let j = 0; j < allContacts.length; j++) {
//             if (allContacts[j].charAt[0].toUpperCase() === String.fromCharCode(i)) {
//                 startWithLetter.push(allContacts[j]);
//             }
//         }
//     }
//     console.log(startWithLetter);
// }