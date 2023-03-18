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
    "category": "toDo"
}, {
    "id": 1,
    "title": "Kochen",
    "category": "toDo"
}, {
    "id": 2,
    "title": "Einkaufen",
    "category": "inProgress"
}];

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

    function generateToDoHTML(element) {
        return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element['id']})">
        <div class="boardContainerTop">${element["title"]}</div>
        </div>
        `;
    }


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