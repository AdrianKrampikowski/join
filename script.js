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
//Source: www.w3schools.com/html/html5_draganddrop.asp
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

// Own Code

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
}];


let currentDraggedElement;

function updateHTML() {

    let toDo = toDos.filter(t => t["category"] == "toDo");
    document.getElementById("toDoCard").innerHTML = ``;
    for (let i = 0; i < toDo.length; i++) {
        let element = toDo[i];
        document.getElementById("toDoCard").innerHTML += generateToDoHTML(element);
        // calculateProgressbar(i);
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

            <div class="boardContainerUserBubbles" id="boardContainerUserBubbles${element["id"]}">


            <div>
                <img src="img/greenArrow.svg">
            </div>

        </div>

        `;
    }
    for (let i = 0; i < toDos.length; i++) {
        calculateProgressbar(i);
        getFirstLetter(i);
    }
}


function getFirstLetter(i) {
    if (i < newUsers.length) {
        let x = newUsers[i]["name"];
        x = x.split(' ').map(word => word.charAt(0)).join('');
        let y = newUsers[i]["surname"];
        y = y.split(' ').map(word => word.charAt(0)).join('');
        z = x + y;
        console.log(z);
    }
}
// function createUserBubbles(i){
//     debugger
//     document.getElementById("boardContainerUserBubbles"[i]);
// };
{/* <div class="userBubble">
<div class="userBubbleOne">AA</div>
<div class="userBubbleTwo">MV</div>
<div class="userBubbleConcatenation">+2</div>
</div> */}


function calculateProgressbar(index) {
    let x = toDos[index]["numerator"] / toDos[index]["denominator"];
    x = x * 100;
    let progressBarElements = document.getElementsByClassName("progressBar");
    progressBarElements[index].style.width = x + "%";
}


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