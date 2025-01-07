const SIMPLE_NOTES_STORAGE_KEY = "simpleNotes";

const controller = (() => {
  let noteIds = [];
  let ausgewählt = [];




  function getNoteIdOrDate(DateOrNoteId, index) {
    datum = new Date()

    const monate = [
      "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
      "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
    ];

    const tagZahl = datum.getDate();
    const monatName = monate[datum.getMonth()];
    const jahr = datum.getFullYear();

    if (DateOrNoteId == "Date") {
      DateOfToday = `${monatName + " " + tagZahl + ", " + jahr}`
      return DateOfToday

    } else if (DateOrNoteId == "Month") {
      return monate[index]
    } else {
      const noteId = new Date().getTime().toString();
      return noteId
    }
  }

  let noteId = new Date().getTime().toString();

  function createNote({ noteId, title, text, DateOfCreation }) {
    const existingNotes = document.getElementById("div-existing-notes");
    const existingNoteTemplate = document.getElementById(
      "existing-note-template"
    );

    const newNode = existingNoteTemplate.cloneNode(true);
    newNode.removeAttribute("hidden");
    const elementId = `existing-node-${noteId}`;
    newNode.setAttribute("id", elementId);
    existingNotes.appendChild(newNode);

    document.querySelector(`#${elementId} #existing-note-title`).innerText = title;
    document.querySelector(`#${elementId} #existing-note-text`).innerText = text.substr(0, 74);
    document.querySelector(`#${elementId} #date-for-small-note`).innerText = DateOfCreation
    document.querySelector(`#${elementId}`).removeAttribute('selected')
    document.querySelector(`#${elementId} #existing-note-title`).setAttribute("id", `existing-note-title-${noteId}`);
    document.querySelector(`#${elementId} #existing-note-text`).setAttribute("id", `existing-note-text-${noteId}`);
    document.querySelector(`#${elementId}`).setAttribute("noteId", `${noteId}`);
    newNode.setAttribute("onclick", `controller.divClicked(${noteId})`);

    // Closed Function
  }

  function addNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    notes.unshift(note);
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    noteIds.push(note.noteId);
  }

  function deleteNoteFromLocalStorage(id) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));

    const foundIndexOfLocalstorage = notes.findIndex((notes) => notes.noteId === id);
    const foundIndexOfIdList = noteIds.indexOf(id);

    notes.splice(foundIndexOfLocalstorage, 1);
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    noteIds.splice(foundIndexOfIdList, 1);
  }

  function deleteNoteNew() {
    noteToDelete = document.querySelector('[selected]')

    let noteId = noteToDelete.getAttribute('noteid')

    deleteNote(noteId)

    location.reload();
  }

  function divClicked(noteId) {

    document.addEventListener("DOMContentLoaded", () => {
      // Ich abuse hier diesen Eventlistener um die Seite zu laden und dann kann ich die Farbe ändern
    });

    document.querySelectorAll(`[selected]`).forEach((note) => {
      note.style.backgroundColor = "#FFFFFF"; // Zurücksetzen der Hintergrundfarbe
      note.removeAttribute("selected");
    });
    // Wähle die neue Notiz und setze den Status
    const note = document.getElementById(`existing-node-${noteId}`);
    note.style.backgroundColor = "#F2F2F2";
    note.setAttribute("selected", "");

    displayNote(noteId);
    selectorHandler(noteId);
  }

  function saveNote() {
    const title = document.getElementById(`title-area`).innerText;
    const text = document.getElementById(`text-area`).innerText;


    const NotetoSave = document.querySelector(`[selected]`).getAttribute("noteid")


    if (NotetoSave.toString() == "000000") {

      noteId = getNoteIdOrDate("ID")
      DateOfCreation = getNoteIdOrDate("Date")

      addNoteToLocalStorage({ noteId, title, text, DateOfCreation })
      createNote({ noteId, title, text, DateOfCreation })
    }

    let parsedLocalstorgeObjects = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));

    parsedLocalstorgeObjects.forEach((object) => {
      if (object.noteId == NotetoSave) {
        object.title = title;
        object.text = text;
      }
    });

    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(parsedLocalstorgeObjects)
    );

    location.reload();
  }

  function selectorHandler(noteId) {
    document.addEventListener("DOMContentLoaded", () => {
      // Ich abuse hier diesen Eventlistener um die Seite zu laden und dann kann ich die Farbe ändern
    });

    let ausgewählt = document.querySelectorAll(`[selected=""]`);

    if (ausgewählt.length == 0) {
      const note = document.getElementById(`existing-node-${noteId}`);
      note.style.backgroundColor = "#F2F2F2";
      note.setAttribute(`selected-note-${noteId}`, "");
      note.setAttribute(`selected`, "");
    } else {
      ausgewählt.forEach((selected) => {
        selected.style.backgroundColor = "#FFFFFF";
        selected.removeAttribute("selected");
      });

      const note = document.getElementById(`existing-node-${noteId}`);
      note.style.backgroundColor = "#F2F2F2";
      note.setAttribute("selected", "");
      note.setAttribute(`selected-note-${noteId}`, "");
    }
  }

  function createIdNote(object) {
    createNote(object);
    addNoteToLocalStorage(object);
    loadNotes();
  }

  function addNote() {
    DateOfCreation = getNoteIdOrDate("Date")
    noteId = getNoteIdOrDate("ID")
    title = ""
    text = ""

    addNoteToLocalStorage({ noteId, title, text, DateOfCreation });
    loadNotes();
    divClicked(noteId);
  }

  function deleteSelected() {
    returnselectedNotesArray();

    if (
      selectedNotesArray.length ==
      JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY)).length
    ) {
      let isConfirmed = confirm("are you sure you want to delete all Notes?");

      if (isConfirmed) {
        selectedNotesArray.forEach((noteId) => {
          deleteNote(noteId);
        });
      } else {
      }
    } else {
      if (selectedNotesArray.length > 0) {
        selectedNotesArray.forEach((noteId) => {
          deleteNote(noteId);
        });
      }
    }
    selectCheckbox();
  }

  function deleteNote(noteId) {
    if (!noteId) {
      noteId = document.querySelector()
    }

    deleteNoteFromLocalStorage(noteId);
    loadNotes();
  }

  function loadNotes() {
    document.getElementById("div-existing-notes").innerHTML = "";
    const notesString = localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY);

    if (!notesString) {
      localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify([]));
    }

    const notes = JSON.parse(notesString);
    notes.forEach(createNote);
    displayNote();
  }

  function displayNote(noteId) {
    if (noteId == undefined) {

      document.getElementById('date-on-main-content').innerText = getNoteIdOrDate("Date")
    } else {
      const allNotes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY))

      allNotes.forEach(note => {
        if (note.noteId == noteId) {
          const noteToDisplay = note

          document.getElementById("title-area").innerText = noteToDisplay.title;
          document.getElementById("text-area").innerText = noteToDisplay.text;
          document.getElementById('date-on-main-content').innerText = noteToDisplay.DateOfCreation
        }
      });

      document.addEventListener("DOMContentLoaded", () => {
        // Ich abuse hier diesen Eventlistener um die Seite zu laden und dann kann ich die Farbe ändern
      });
    }
  }

  //Animation Handler
    document.addEventListener("DOMContentLoaded", () => {
      
    const sidebar = document.getElementById("sidebar");
    const start_button = document.getElementById("start-button");
    const main_content = document.getElementById("main-content");
    const vertical_line = document.getElementById("vertical-line-container")
    const vertical_line_container = document.getElementById('vertical-line')

    sidebar.removeAttribute("style",)
    start_button.removeAttribute("style", "shrinkTo80 3s forwards")
    main_content.removeAttribute("style", "shrinkTo80 3s forwards")
    vertical_line.removeAttribute("style", "goLeft 3s forwards")
    vertical_line_container.removeAttribute('style', 'goLeft 3s forwards')

    start_button.addEventListener("click", () => {
      const status = start_button.getAttribute("status");

      if (status === "Open") {
        start_button.setAttribute("status", "Closed");
        sidebar.style.animation = "retract 3s forwards";
        start_button.style.animation = "rotate 3s forwards";
        main_content.style.animation = "growTo100 2.5s forwards";
        vertical_line.style.animation = 'goLeft 3s forwards'
        vertical_line_container.style.animation = 'goLeft 3s forwards'


      } else if (status === "Closed") {
        start_button.setAttribute("status", "Open");
        sidebar.style.animation = "grow 3s forwards";
        start_button.style.animation = "rotate2 3s forwards";
        main_content.style.animation = "shrinkTo80 3.5s forwards";
        vertical_line.style.animation = 'goRight 3s forwards'
        vertical_line_container.style.animation = 'goRight 3s forwards'
      }
    });

    });


    function searchbar(Text){
     // let notes = []
//
     // notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY))
//
//
     //   const searchInput = document.getElementById("search-bar")
     //   searchInput.addEventListener("input", e => {
     //     const value = e.target.value
     //     notes.forEach(notes => {
     //       const isVisible = notes.title.includes(value) || notes.text.includes(value) || notes.DateOfCreation.includes(value)
     //       notes.classList.toggle("hide", !isVisible)
     //     })
     //     
     //     })
    }






  return {
    searchbar,
    addNote,
    saveNote,
    deleteNote,
    deleteNoteNew,
    loadNotes,
    deleteSelected,
    divClicked,
    displayNote,
  };
})();
