/*************************************************************************
 * Create Note Popup Logic
 **************************************************************************/

function popup() {
  // Create the popup container
  const popupContainer = document.createElement("div");
  popupContainer.id = "popupContainer"; // Ensure this matches CSS or usage elsewhere
  popupContainer.style.display = 'flex'; // Make sure it is visible
  popupContainer.style.zIndex = '9999'; // Bring it to the front

  // Add inner HTML for the popup
  popupContainer.innerHTML = `
    <h2>notes:</h2>
    <textarea id="note-text" placeholder="Jot down your thoughts..."></textarea>
    <div id="btn-container">
        <button id="submitBtn" onclick="createNote()">create</button>
        <button id="closeBtn" onclick="closePopup()">close</button>
    </div>
  `;

  // Append the popup to the body
  document.body.appendChild(popupContainer);
}


function closePopup() {
  const popupContainer = document.getElementById("popupContainer");
  if(popupContainer) {
      popupContainer.remove();
  }
}

function createNote() {

  const popupContainer = document.getElementById('popupContainer');
  const noteText = document.getElementById('note-text').value;
  if (noteText.trim() !== '') {
      const note = {
      id: new Date().getTime(),
      text: noteText
      };

      const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
      existingNotes.push(note);

      localStorage.setItem('notes', JSON.stringify(existingNotes));

      document.getElementById('note-text').value = '';

      popupContainer.remove();
      displayNotes();
  }
}


/*************************************************************************
* Display Notes Logic
**************************************************************************/

function displayNotes() {
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = '';

  const notes = JSON.parse(localStorage.getItem('notes')) || [];

  notes.forEach(note => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
      <span>${note.text}</span>
      <div id="noteBtns-container">
          <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
          <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
      `;
      notesList.appendChild(listItem);
  });
}


/*************************************************************************
* Edit Note Popup Logic
**************************************************************************/

function editNote(noteId) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const noteToEdit = notes.find(note => note.id == noteId);
  const noteText = noteToEdit ? noteToEdit.text : '';
  
  const editingPopup = document.createElement("div");
  
  editingPopup.innerHTML = `
  <div id="editing-container" data-note-id="${noteId}">
      <h2>edit:</h2>
      <textarea id="note-text">${noteText}</textarea>
      <div id="btn-container">
          <button id="submitBtn" onclick="updateNote()">done</button>
          <button id="closeBtn" onclick="closeEditPopup()">cancel</button>
      </div>
  </div>
  `;

  // Ensure the popup is displayed above all content
  editingPopup.style.position = "fixed";
  editingPopup.style.top = "50%";
  editingPopup.style.left = "50%";
  editingPopup.style.transform = "translate(-50%, -50%)";
  editingPopup.style.zIndex = "9999";  // Ensures it stays above other elements
  editingPopup.style.backgroundColor = "rgba(255, 255, 255, 0.95)"; // Light background for clarity

  document.body.appendChild(editingPopup);
}


function closeEditPopup() {
  const editingPopup = document.getElementById("editing-container");

  if(editingPopup) {
      editingPopup.remove();
  }
}


function updateNote() {
  const noteText = document.getElementById('note-text').value.trim();
  const editingPopup = document.getElementById('editing-container');

  if (noteText !== '') {
      const noteId = editingPopup.getAttribute('data-note-id');
      let notes = JSON.parse(localStorage.getItem('notes')) || [];

      // Find the note to update
      const updatedNotes = notes.map(note => {
          if (note.id == noteId) {
              return { id: note.id, text: noteText };
          }
          return note;
      });

      // Update the notes in local storage
      localStorage.setItem('notes', JSON.stringify(updatedNotes));

      // Close the editing popup
      editingPopup.remove();

      // Refresh the displayed notes
      displayNotes();
  }
}

/*************************************************************************
* Delete Note Logic
**************************************************************************/

function deleteNote(noteId) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes = notes.filter(note => note.id !== noteId);

  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

displayNotes();

// JavaScript to handle back button click
document.getElementById('back-button').addEventListener('click', function() {
  window.history.back(); // Goes back to the previous page
});
