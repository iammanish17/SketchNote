var Store = require('electron-store');
var db = new Store();
var fs = require('fs');
var canvas = document.getElementById("myCanvas");
var newNoteButton = document.getElementById("create-note-button");

window.onload = async () => {
    //const url = canvas.toDataURL('image/jpg', 1);

    // remove Base64 stuff from the Image
    //const base64Data = url.replace(/^data:image\/png;base64,/, "");
    //fs.writeFile("./media/111.png", base64Data, 'base64', function (err) {
    //    console.log(err);
    //});
  };

  newNoteButton.onclick = () => {
      var noteID = new Date().getTime().toString();
      db.set(noteID, {
          title: "new note",
          value: ""
      });
  }
