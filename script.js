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

let newUsers = [{
    "id": 0,
    "name": "Adrian",
    "surname": "Krampikowski"
}, {
    "id": 1,
    "name": "Tobias",
    "surname": "Odermatt"
}, {
    "id": 2,
    "name": "Fausto",
    "surname": "Oliveira"
}, {
    "id": 3,
    "name": "test",
    "surname": "test"
}];

let userChar = [];

let currentDraggedElement;

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
    getFirstLetter();
}

function generateToDoHTML(element, i) {
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
                <div class="userBubble" id="${element['id']}">
                </div>
            </div>

            <div>
                <img src="img/greenArrow.svg">
            </div>

        </div>

        `;
    
}


function getFirstLetter(i) {
    for (let i = 0; i < newUsers.length; i++) {
        let x = newUsers[i]["name"];
        x = x.split(' ').map(word => word.charAt(0)).join('');
        let y = newUsers[i]["surname"];
        y = y.split(' ').map(word => word.charAt(0)).join('');
        z = x + y;
        userChar.push(z);
    }
    createBubbles(i);
}

function createBubbles(i) {
    let positionForBubbles = document.getElementById(`userBubble${[i]}`);
    // if (newUsers.length < 99) {
    // for (let j = 0; j < 2; j++) {
        positionForBubbles.innerHTML += `
        <div class="userBubbleOne">${userChar[i]}</div>
   `;
    // }
}

function createThreeBubbles(z) {
}

let normalyCounter = 0;
const newUserCount = newUsers.length - 2;

function createMoreThanThreeBubbles(z) {
    for (let j = 0; j < toDos.length; j++) {
        if (j < 2) {
            document.getElementById(`userBubble${[j]}`).innerHTML += `
            <div class="userBubbleOne">${z}</div>
            `;
        } else {
            document.getElementById(`userBubble${[0]}`).innerHTML = `
            <div class="userBubbleOne">+${newUserCount}</div>
       `;
        }
    }
}

function calculateProgressbar(index) {
    let x = toDos[index]["numerator"] / toDos[index]["denominator"];
    x = x * 100;
    let progressBarElements = document.getElementsByClassName("progressBar");
    progressBarElements[index].style.width = x + "%";
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

function showAllContacts() {
    fetch("https://gruppenarbeit-486join.developerakademie.net/smallest_backend_ever/database.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            const users = JSON.parse(data.users);
            console.log(users[0]);
            console.log(users[0]["name"]);
            console.log(users[0]["email"]);
            console.log(users[0]["password"]);
            console.log(users[0]["userid"]);
        })
}
showAllContacts();