    let contacts = [];
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    let newName = document.getElementById('contactName');
    let newSurname = document.getElementById('contactSurname');
    let newEmail = document.getElementById('contactEmail');
    let newPhone = document.getElementById('contactPhone');

    let editName = document.getElementById('editContactName');
    let editSurname = document.getElementById('editContactSurname');
    let editEmail = document.getElementById('editContactEmail');
    let editPhone = document.getElementById('editContactPhone');

    let newContactPopUp = document.getElementById('addContactBackground');
    let editContactPopUp = document.getElementById('editContactBackground');

    let bgColor;
    let firstLetters;

    async function initContacts() {
        setURL('https://gruppenarbeit-486join.developerakademie.net/smallest_backend_ever');
        await downloadFromServer();
        contacts = JSON.parse(backend.getItem('contacts')) || [];

        renderLetters();
    } 


    function renderLetters() {
        let contactList = document.getElementById('contactList');
        contactList.innerHTML = '';

        for (let i = 0; i < letters.length; i++) {
            let letter = letters[i];
            
            contactList.innerHTML += `
                <div id='contactContainer${i}' class="contactContainer">
                    <div class="letter">
                        <div>${letter}</div>
                    </div>
                    <div class="contactsHline"></div>
                    <div id="sortedContacts${i}" class="sortedContacts">
                    </div>
                </div>
            `;
            renderContacts(i, letter);
            checkForEmptyLetters(i);
        }
    }

    function renderContacts(i, letter) {
        let sortedContacts = document.getElementById('sortedContacts'+i);
        sortedContacts.innerHTML = '';

        contactsSorted = contacts.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
            });

        for (let c = 0; c < contactsSorted.length; c++) {
            let contactListName = contacts[c]['name'];
            let contactListSurname = contacts[c]['surname'];
            let contactEmail = contacts[c]['email'];
            let contactBgColor = contacts[c]['background']

            randomBackground();
            nameGetFirstLetter(c);

            if(firstLetters.charAt(0) == letter) {
                sortedContacts.innerHTML += `
                    <div id="contactID${c}" class="contact" onclick="openContactInfo(${c})">
                        <div>
                            <div style="background-color:${contactBgColor};"class="contactIcon">
                                <span>${firstLetters}</span>
                            </div>
                        </div>
                        <div>
                            <div class="contactName">
                                <span>${contactListName}</span>
                                <span>${contactListSurname}</span>
                            </div>
                            <a class="contactEmail" href="${contactEmail}">${contactEmail}</a> 
                        </div>
                    </div>
                    `;
            }
        }
    }  
    
    function checkForEmptyLetters(i) {
        let contactContainer = document.getElementById('contactContainer'+i);
        let emptyLetters = document.getElementById('sortedContacts'+i);

        if(emptyLetters.innerHTML == '') {
            contactContainer.style.display = 'none';
        }
    }
     
    function nameGetFirstLetter(c) {
        let x = contacts[c]['name'];
        x = x.split(' ').map(word => word.charAt(0)).join('');
        let y = contacts[c]['surname'];
        y = y.split(' ').map(word => word.charAt(0)).join('');
        firstLetters = x + y;
    }

    function newContact() {
        document.getElementById('addContactBackground').style.display = 'flex';
    }

    function closePopup() {
        document.getElementById('addContactBackground').style.display = 'none';
        document.getElementById('editContactBackground').style.display = 'none';
        name.value = '';
        surname.value = '';
        email.value = '';
        phone.value = '';
    }

    function canclePopup() {
        document.getElementById('addContactBackground').style.display = 'none';
        document.getElementById('editContactBackground').style.display = 'none';
        newName.value = '';
        newSurname.value = '';
        newEmail.value = '';
        newPhone.value = '';
    }

    function doNotClose(event) {
        event.stopPropagation();
    }

    function createContact() {
        if (newName.value == '' || newEmail.value == '') {
            inputRequiredPopup();
        } else {
            randomBackground();
            let newContact = { name: newName.value, surname: newSurname.value, email: newEmail.value, phone: newPhone.value, background: bgColor};
            contacts.push(newContact);
            saveContacts();
            newName.value = '';
            newSurname.value = '';
            newEmail.value = '';
            newPhone.value = '';
            renderLetters();
            showContactCreatedPupup();
            document.getElementById('addContactBackground').style.display = 'none';
        }
    }

    function randomBackground() {
        let x = Math.floor(Math.random() * 256)
        let y = Math.floor(Math.random() * 256)
        let z = Math.floor(Math.random() * 256)
        bgColor = `rgb(${x}, ${y}, ${z})`;
    }

    function openContactInfo(c) {
        activeContact(c);

        let contactInformation = document.getElementById('contactsContent');
        contactInformation.innerHTML = '';

        let contactInfoName = contacts[c]['name'];
        let contactInfoSurname = contacts[c]['surname'];
        let contactInfoEmail = contacts[c]['email'];
        let contactInfoPhone = contacts[c]['phone'];
        let contactInfoBgColor = contacts[c]['background'];

        nameGetFirstLetter(c);

        contactInformation.innerHTML += contactInfoTemplate(firstLetters, contactInfoName, contactInfoSurname, c, contactInfoEmail, contactInfoPhone);
        document.getElementById('contactIconBig' + c).style.backgroundColor = contactInfoBgColor;
        document.getElementById('contactDetails' + c).style.animation = 'flying 225ms ease-in-out';

        if (window.innerWidth < 950) {
            document.getElementById('contactsBar').classList.add('d-none');
            document.getElementById('contactsContainer').classList.add('contactsContainerMobile');
            document.getElementById('newContactButton').classList.add('d-none');
        }
    }

    function activeContact(c) {
        let currentElement = document.getElementById('contactID' + c);
        let allElements = document.querySelectorAll('.contact');

        allElements.forEach((element) => {
            element.style.backgroundColor = '#F5F5F5';
            element.style.color = 'black';
        })
            currentElement.style.backgroundColor = '#2A3647';
            currentElement.style.color = 'white';
    }

    function contactInfoTemplate(firstLetters, contactInfoName, contactInfoSurname, c, contactInfoEmail, contactInfoPhone) {
        return `
            <div class="contactDetails" id="contactDetails${c}">
                <div>
                    <div>
                        <div id="contactIconBig${c}" class="contactIconBig">
                            <span>${firstLetters}</span>
                        </div>
                    </div>
                    <div class="contactDetailsName">
                        <div class="name">
                            <div>
                                <span>${contactInfoName}</span>
                                <span>${contactInfoSurname}</span>
                            </div>
                        </div>
                        <div onclick="addTaskViaContact()" class="addTask">
                            <img src="../img/plus.svg"><span>Add Task</span>
                        </div>
                    </div>
                </div>

                <div class="contactInformation">
                    <div>
                        <div class="contactInformationHeader">
                            <div>
                                <span>Contact Information</span>
                            </div>
                            <div class="editContact" onclick="editContact(${c})">
                                <img src="../img/edit.svg">
                                <span>Edit Contact</span>
                            </div>
                        </div>

                        <div class="contactInformationMain">
                            <div>
                                <span>Email</span>
                                <a href="${contactInfoEmail}">${contactInfoEmail}</a>
                            </div>
                            <div>
                                <span>Phone</span>
                                <a href="tel:${contactInfoPhone}">${contactInfoPhone}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="deleteContact">
                <div onclick="deleteContact(${c})">
                    <span>Delete contact</span>
                    <img src="../img/delete.svg">
                </div>
            </div>

        `;
        }

        // function addTaskViaContact() {
        //     window.location.href = 'addTask.html';
        // }

        function editContact(i) {
            editContactPopUp.style.display = 'flex';

            editName.value = contacts[i]['name'];
            editSurname.value = contacts[i]['surname'];
            editEmail.value = contacts[i]['email'];
            editPhone.value = contacts[i]['phone'];
            let contactInfoBgColor = contacts[i]['background'];


            let saveChangesButton = document.getElementById('saveChangesButton');

            saveChangesButton.innerHTML = `
                <button class="createContact" onclick="saveChanges(${i})">  
                    <span>Save</span>
                </button>
                `;

            nameGetFirstLetter(i);

            document.getElementById('contactImg').innerHTML = `
            <div id="contactImgBg${i}" class="contactImgBg">
                <span>${firstLetters}</span>
            </div>
            `;
            document.getElementById('contactImgBg' + i).style.backgroundColor = contactInfoBgColor;
        }

        function saveChanges(i) {
            contacts[i]['name'] = editName.value;
            contacts[i]['surname'] = editSurname.value;
            contacts[i]['emailpho'] = editEmail.value;
            contacts[i]['phone'] = editPhone.value;

            saveContacts();
            renderLetters();
            contactChangesSavedPupup();
            editContactPopUp.style.display = 'none';
        }

        function deleteContact(i) {
            contacts.splice(i, 1);
            saveContacts();
            renderContacts();
        }

        function backToContactsList() {
            document.getElementById('contactsBar').classList.remove('d-none');
            document.getElementById('contactsContainer').classList.remove('contactsContainerMobile');
            document.getElementById('newContactButton').classList.remove('d-none');

        }

        /* ================================== SNACKBAR =======================================*/
        function showContactCreatedPupup() {
            // Get the snackbar DIV
            var x = document.getElementById("contactCreated");

            // Add the "show" class to DIV
            x.className = "show";

            // After 3 seconds, remove the show class from DIV
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }

        function contactChangesSavedPupup() {
            // Get the snackbar DIV
            var x = document.getElementById("contactChangesSaved");

            // Add the "show" class to DIV
            x.className = "show";

            // After 3 seconds, remove the show class from DIV
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }

        function inputRequiredPopup() {
            // Get the snackbar DIV
            var x = document.getElementById("inputRequired");

            // Add the "show" class to DIV
            x.className = "show";

            // After 3 seconds, remove the show class from DIV
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
