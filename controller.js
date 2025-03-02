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
    const existingNoteTemplate = document.getElementById("existing-note-template");
    const newNode = existingNoteTemplate.cloneNode(true);

    newNode.removeAttribute("hidden");
    newNode.setAttribute("id", noteId);
    existingNotes.appendChild(newNode);
    newNode.removeAttribute("noteId")

    document.querySelector(`[id="${noteId}"]`).removeAttribute('selected')
    document.querySelector(`[id="${noteId}"] [id="title"]`).innerText = title;
    document.querySelector(`[id="${noteId}"] [id="text"]`).innerText = text.substr(0, 74);
    document.querySelector(`[id="${noteId}"] [id="date-for-small-note"]`).innerText = DateOfCreation
    document.querySelector(`[id="${noteId}"] [id="title"]`).setAttribute("id", `title-${noteId}`);
    document.querySelector(`[id="${noteId}"] [id="text"]`).setAttribute("id", `text-${noteId}`);
    newNode.setAttribute("onclick", `controller.divClicked(${noteId})`);
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

    let noteId = noteToDelete.getAttribute('id')

    deleteNote(noteId)

    location.reload();
  }

  function divClicked(noteId) {

    document.addEventListener("DOMContentLoaded", () => {
      // Ich abuse hier diesen Eventlistener um die Seite zu laden und dann kann ich die Farbe ändern
    });

    document.querySelectorAll(`[selected]`).forEach((note) => {
      note.removeAttribute("selected");
    });

    const note = document.getElementById(`${noteId}`);

    note.setAttribute("selected", "");

    displayNote(noteId);
  }

  function saveNote() {
    const title = document.getElementById(`title-area`).innerText;
    const text = document.getElementById(`text-area`).innerText;

    const NotetoSave = document.querySelector(`[selected]`).getAttribute("id")

    if (NotetoSave.toString() == "existing-note-template") {

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

    const sideBar = document.getElementById("sidebar");
    const startButton = document.getElementById("start-button");
    const mainContent = document.getElementById("main--content");
    const verticalLine = document.getElementById("vertical-line-container")
    const verticalLineContainer = document.getElementById('vertical-line')

    startButton.addEventListener("click", () => {

      sideBar.classList.remove("close-sidebar", "open-sidebar")
      verticalLineContainer.classList.remove("goLeft", "goRight")
      verticalLine.classList.remove("goLeft", "goRight")
      startButton.classList.remove("rotate", "rotate2")
      mainContent.classList.remove("shrinkTo80", "growTo100")

      const status = startButton.getAttribute("status");

      if (status === "Open") {
        startButton.setAttribute("status", "Closed");
        sideBar.classList.add ("close-sidebar") 
        startButton.classList.add ("rotate") 
        mainContent.classList.add ("growTo100")
        verticalLine.classList.add ("goLeft")
        verticalLineContainer.classList.add ("goLeft")


      } else if (status === "Closed") {
        startButton.setAttribute("status", "Open");
        sideBar.classList.add ("open-sidebar");
        startButton.classList.add ("rotate2");
        mainContent.classList.add ("shrinkTo80");
        verticalLine.classList.add ("goRight")
        verticalLineContainer.classList.add ("goRight")
      }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {

    let notes = []
    notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY))

    const searchInput = document.getElementById("searchbar")

    searchInput.addEventListener("input", e => {
      const value = e.target.value


      notes.forEach(note => {
        const isVisible = note.title.includes(value) || note.text.includes(value) || note.DateOfCreation.includes(value)

        console.log(note)
        console.log(isVisible)

        let visabilityNote = document.getElementById(note.noteId)
        visabilityNote.toggleAttribute("hidden", !isVisible)
      })
    })

  })

  return {
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
