const noteInput = document.getElementById("note-input");
const addBtn = document.getElementById("add-btn");
const notesContainer = document.getElementById("notes-container");

// load notes from localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// show notes
function renderNotes() {
  notesContainer.innerHTML = "";
  notes.forEach((note, index) => {
    const noteEl = document.createElement("div");
    noteEl.classList.add("note");
    noteEl.innerHTML = `
      <p>${note}</p>
      <button class="edit" onclick="editNote(${index})">Edit</button>
      <button onclick="deleteNote(${index})">Delete</button>
    `;
    notesContainer.appendChild(noteEl);
  });
}

// add note
addBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (text === "") return alert("Please write something!");
  notes.push(text);
  noteInput.value = "";
  saveNotes();
  renderNotes();
});

// delete note
function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
}

// edit note
function editNote(index) {
  const newText = prompt("Edit your note:", notes[index]);
  if (newText !== null && newText.trim() !== "") {
    notes[index] = newText.trim();
    saveNotes();
    renderNotes();
  }
}

// save notes to localStorage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// first render
renderNotes();
