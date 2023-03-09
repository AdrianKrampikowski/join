let allTasks= [];

function addTask() {
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;

    let task = {
        'descirption': description,
        'category': category,
        'createDate': newDate().getTime()
    }

    allTasks.push(task);

    let allTasksAsString = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', allTasksAsString)
}

/**
 * This function loads the saved tasks form the local storage
 * 
 */
function loadAllTasks() {
    let allTasksAsString = localStorage.getItem('allTasks')
    allTasks = JSON.parse(allTasksAsString);                  // Array wird überschrieben mit den Inhalten.
                                                              // Array soll nicht reingepushd werden.
}
