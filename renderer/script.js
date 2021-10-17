var Store = require('electron-store');
var db = new Store();
var fs = require('fs');
var drawingSection = document.getElementById("drawingSection");
var canvas = document.getElementById("drawingCanvas");
var ctx = canvas.getContext('2d');
ctx.strokeStyle = "red";
ctx.strokeRect(100, 100, 200, 500);
var newNoteButton = document.getElementById("create-note-button");

window.onload = async () => {
  };

  newNoteButton.onclick = () => {
      var noteID = new Date().getTime().toString();
      db.set(noteID, {
          title: "new note",
          value: ""
      });
      drawingSection.style.display = "block";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpg', 1);
      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      fs.writeFile('./media/'+noteID+'.png', base64Data, 'base64', function (err) {
        console.log(err);
    });
  }
