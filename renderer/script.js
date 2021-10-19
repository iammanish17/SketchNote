var Store = require('electron-store');
var db = new Store();
var fs = require('fs');
var drawingSection = document.getElementById("drawingSection");
var newNoteButton = document.getElementById("create-note-button");


var quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block']
    ]
  },
  placeholder: 'Write something here...',
  theme: 'snow'
});

window.onload = async () => {
  var customBoard2 = new DrawingBoard.Board('drawingCanvas', {
    controls: [
      'Color',
      { Size: { type: 'dropdown' } },
      { DrawingMode: { filler: false } },
      'Navigation'
    ],
    size: 1
  });
  };

  newNoteButton.onclick = () => {
      console.log(quill.getContents());
      return;
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
