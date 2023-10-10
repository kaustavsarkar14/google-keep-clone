const addTitle = document.getElementById('addTitle')
const addNoteButton = document.getElementById('addNote')
const addText = document.getElementById('addText')
const notesDiv = document.getElementById('notes')
let notes = JSON.parse(localStorage.getItem('notes')) || []
let isTitleEdited = false

showNotes()

addText.addEventListener('focus', () => {
    addNoteButton.style.display = "block"
    addTitle.style.display = "block"
    addText.rows = 3
})
addText.addEventListener('blur', () => {
    addNoteButton.style.display = "none"
    addTitle.style.display = "none"
    addText.rows = 1
    addNotes()
})

function addNotes() {
    if (addText.value != '') {
        const title = addTitle.value
        const text = addText.value
        const date = new Date()
        const bgColor = 'none'
        let note = { title, text, date, bgColor }
        notes = [note, ...notes]
        showNotes()
        saveNotes()
    }
    addTitle.value = ''
    addText.value = ''
}
function showNotes() {
    notesDiv.innerHTML = ''
    notes.forEach((el, i) => {
        const date = new Date(el.date)
        notesDiv.innerHTML += `
        <div id="${i}" class="note" style="background-color:${el.bgColor};" >
        <div>
        <h4 id="title" >${el.title}</h4>
        <p class="text" >${el.text}</p>
        </div>
        <div class="bottom" >
        <p>${formatDate(date)}</p>
        <div class="buttons" >
        <label for="bgColor" >Color</label>
        <div style="display:none;" >
            <input data-index="${i}" oninput="setColor(this)" id="bgColor" type="color">
        </div>
        <button onclick="editNote(this)" >Edit</button>
        <button onclick="deleteNote(this)" >Delete</button>
        </div>
        </div>
        </div>
        `
    })
}

addNoteButton.addEventListener('click', addNotes)

function deleteNote(button) {
    let index = button.parentNode.parentNode.parentNode.id
    notes.splice(index, 1)
    showNotes()
    saveNotes()
}

function editNote(button) {
    const title = button.parentNode.parentNode.parentNode.querySelector('h4')
    const text = button.parentNode.parentNode.parentNode.querySelector('p')
    const index = button.parentNode.parentNode.parentNode.id
    if (button.innerText == "Save") {
        button.innerText = "Edit"
        title.contentEditable = "false"
        text.contentEditable = "false"
        if (title.innerText === "Title" && !isTitleEdited) {
            notes[index].title = "";
        } else {
            notes[index].title = title.textContent;
        }
        notes[index].text = text.textContent
        isTitleEdited = false
        saveNotes()
        showNotes()
        return
    }
    title.contentEditable = "true"
    if (title.innerText == "") title.innerText = "Title"
    title.addEventListener('focus', e => {
        isTitleEdited = true
    })
    text.contentEditable = "true"
    text.focus()
    button.innerText = "Save"
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes))
}


function formatDate(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear() % 100; // Get the last two digits of the year

    // Determine whether it's AM or PM
    const period = hours < 12 ? 'AM' : 'PM';

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Add leading zeros to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Construct the formatted string
    const formattedDate = `${formattedHours}:${formattedMinutes} ${period} ${day} ${month} ${year}`;

    return formattedDate;
}

function setColor(colorInput) {
    console.log(colorInput);
}


