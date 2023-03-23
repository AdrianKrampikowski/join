let newCategorySelected = false;

function resetNewCategoryInput() {
    currentCategoryColor = null;
    selectNewCatagoryCancel();
    newCategorySelected = false;
}

function openContactss() {
    let allContacts = document.getElementById('addTask_assignedToList');

    if (allContacts.classList.contains('d-none')) {
        allContacts.classList.remove('d-none');
        document.getElementById('addTask_openContact').classList.add('assignedDivBorderToEdit');
    } else {
        allContacts.classList.add('d-none');
        document.getElementById('addTask_openContact').classList.remove('assignedDivBorderToEdit');

    }
}

function openSubtasks() {
    document.getElementById('addTask_subtasksAddImg').classList.add('d-none');
    document.getElementById('addTask_subtsasksCancelImg').classList.remove('d-none');
    document.getElementById('addTask_subtasksSubLine').classList.remove('d-none');
    document.getElementById('addTask_subtasksChackImg').classList.remove('d-none');

}

function subtasksCancels() {
    document.getElementById('addTask_subtasksAddImg').classList.remove('d-none');
    document.getElementById('addTask_subtsasksCancelImg').classList.add('d-none');
    document.getElementById('addTask_subtasksSubLine').classList.add('d-none');
    document.getElementById('addTask_subtasksChackImg').classList.add('d-none');
    document.getElementById('addTask_openSubtasks').value = '';
}


function elseselectNewCategory() {
    document.getElementById('addTask_selectTaskCategory').classList.remove('d-none');
    document.getElementById('addTask_categoryList').classList.remove('d-none');
    document.getElementById('addTask_borderButton').classList.add('borderButton');
    document.getElementById('addTask_containerColorPicker').classList.add('d-none');
    document.getElementById('addTask_selectNewCategoryImg').classList.add('d-none');
    document.getElementById('addTask_selectTaskCategoryImg').classList.remove('d-none');
}


function openCategory() {

    if (newCategorySelected) {
        return; // Funktion abbrechen
    }

    // Öffnen - Wird nicht ausgeführt nach einem return
    let category = document.getElementById('addTask_categoryList');
    if (category.classList.contains('d-none')) {
        category.classList.remove('d-none');
        document.getElementById('addTask_borderButton').classList.add('borderButton');
    } else {
        category.classList.add('d-none');
        document.getElementById('addTask_borderButton').classList.remove('borderButton');
    }

}
