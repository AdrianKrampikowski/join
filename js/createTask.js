
function createDropdownUsers(){
    for (let i = 0; i < users.length; i++) {
        document.getElementById("assignedToUsers").innerHTML += `
        <option value="${users[i]["id"]}">${users[i]["name"]}</option>
        `; 
    }
}
setTimeout(() => {
    createDropdownUsers();
}, 1250);