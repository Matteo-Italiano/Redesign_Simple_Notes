const SIMPLE_NOTES_STORAGE_KEY = "simpleNotes";

const controller = (() => {
  let noteIds = [];
  let ausgewählt = [];

  function createNote({ noteId, title, text }) {
    const existingNotes = document.getElementById("div-existing-notes");
    const existingNoteTemplate = document.getElementById(
      "existing-note-template"
    );

    const newNode = existingNoteTemplate.cloneNode(true);
    newNode.removeAttribute("hidden");
    const elementId = `existing-node-${noteId}`;
    newNode.setAttribute("id", elementId);
    existingNotes.appendChild(newNode);

    document.querySelector(`#${elementId} #existing-note-title`).innerText =
      title;
    document.querySelector(`#${elementId} #existing-note-text`).innerText =
      text;
    document
      .querySelector(`#${elementId} #existing-note-title`)
      .setAttribute("id", `existing-note-title-${noteId}`);
    document
      .querySelector(`#${elementId} #existing-note-text`)
      .setAttribute("id", `existing-note-text-${noteId}`);
    document.querySelector(`#${elementId}`).setAttribute("noteId", `${noteId}`);
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

    const foundIndexOfLocalstorage = notes.findIndex(
      (notes) => notes.noteId === id
    );
    const foundIndexOfIdList = noteIds.indexOf(id);

    notes.splice(foundIndexOfLocalstorage, 1);
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    noteIds.splice(foundIndexOfIdList, 1);
  }

  function exportNotesAsJSON() {
    notesAsObjectString = [];

    returnselectedNotesArray();

    allNotes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));

    selectedNotesArray.forEach((noteId) => {
      allNotes.forEach((element) => {
        if (noteId == element.noteId) {
          notesAsObjectString.push(JSON.stringify(element));
        }
      });
    });

    if (notesAsObjectString == "[]") {
      let isConfirmed = confirm(
        "No Notes, are you sure that you want to download an empty file?"
      );
      if (isConfirmed) {
        let downloadBtn = document.getElementById("download");
        let notesasJSON = notesAsObjectString;
        let jsonFile = new Blob([notesasJSON], { type: "application/json" });

        downloadBtn.href = URL.createObjectURL(jsonFile);
        downloadBtn.download = "JSON.json";
      }
    } else {
      let downloadBtn = document.getElementById("downloadHyperlink");
      let notesAsJSON = notesAsObjectString;
      let jsonFile = new Blob([notesAsJSON], { type: "application/json" });

      downloadBtn.href = URL.createObjectURL(jsonFile);
      downloadBtn.download = "JSON.json";
    }
  }

  function divClicked(noteId) {
    // const checkbox = document.getElementById(`existing-note-checkbox-${noteId}`);
    // checkbox.checked = !checkbox.checked;
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
    const titleToSave = document.getElementById(`Title`).value;
    const textToSave = document.getElementById(`Text`).value;

    const noteToSave = document.querySelector(`[selected]`);
    const noteIdToSaveTo = noteToSave.getAttribute("noteid");

    let parsedLocalstorgeObjects = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY)
    );

    parsedLocalstorgeObjects.forEach((object) => {
      if (object.noteId == noteIdToSaveTo) {
        object.title = titleToSave;
        object.text = textToSave;
      }
    });

    localStorage.setItem(
      SIMPLE_NOTES_STORAGE_KEY,
      JSON.stringify(parsedLocalstorgeObjects)
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

  function importNotesAsJSON() {
    const reader = new FileReader();
    let parsedArray;

    reader.onload = (evt) => {
      parsedArray = JSON.parse(evt.target.result);
      createImport(parsedArray);
    };
    reader.readAsText(document.getElementById("input").files[0]);

    function createImport(parsedArray) {
      parsedArray.forEach((object) => {
        checkIfNoteIdIsIncluded(object);

        function checkIfNoteIdIsIncluded(object) {
          let notes = JSON.parse(
            localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY)
          );

          for (let i = 0; i <= notes.length; i++) {
            if (noteIds.length == 0) {
              createIdNote(object);
            }
            if (noteIds.includes(object.noteId)) {
              // does not create the note
            } else createIdNote(object);
          }
        }
      });
    }
  }

  function getFileExtension() {
    if (document.getElementById("input").files[0]) {
      importNotesAsJSON();
    } else {
      alert("Bro, are you good? There aren't any notes to import XD");
    }
  }

  function createIdNote(object) {
    createNote(object);
    addNoteToLocalStorage(object);
    loadNotes();
  }

  function addNote() {
    title = "";
    text = "";

    const noteId = new Date().getTime().toString();

    addNoteToLocalStorage({ noteId, title, text });
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

  function returnselectedNotesArray() {
    const checkboxes = document.querySelectorAll(".checkbox:checked");
    selectedNotesArray = [];

    checkboxes.forEach((checkbox) => {
      selectedNotesArray.push(checkbox.defaultValue);
    });

    return selectedNotesArray;
  }

  function selectCheckbox() {
    const checkedBoxes = [];
    const uncheckedBoxes = [];
    const allCheckboxes = document.querySelectorAll(".checkbox");

    allCheckboxes.forEach((element) => {
      if (element.checked) {
        checkedBoxes.push(element);
      } else {
        uncheckedBoxes.push(element);
      }
    });

    const selectAllButton = document.getElementById("select-all");

    if (selectAllButton.innerText === "Select all") {
      uncheckedBoxes.forEach((element) => {
        element.checked = true;
        const noteId = element.value;
        setBorder(noteId);
      });
      selectAllButton.innerText = "Deselect all";
    } else {
      checkedBoxes.forEach((element) => {
        element.checked = false;
        const noteId = element.value;
        setBorder(noteId);
      });
      selectAllButton.innerText = "Select all";
    }
  }

  function deleteNote(noteId) {
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
  }

  function displayNote(noteId) {
    const allNotes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY))
    

    allNotes.forEach(note => {
      if (note.noteId == noteId) {
        const noteToDisplay = note

        document.getElementById("Title").innerText = noteToDisplay.title;
      document.getElementById("Text").innerText = noteToDisplay.text;
      }
      
    });

    document.addEventListener("DOMContentLoaded", () => {
      // Ich abuse hier diesen Eventlistener um die Seite zu laden und dann kann ich die Farbe ändern
    });

    // Setze Titel und Text in die Eingabefelder
    
  }

  return {
    addNote,
    saveNote,
    deleteNote,
    loadNotes,
    exportNotesAsJSON,
    importNotesAsJSON,
    deleteSelected,
    selectCheckbox,
    getFileExtension,
    divClicked,
    displayNote,
  };
})();
