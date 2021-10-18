var Store = require('electron-store');
var db = new Store();
var fs = require('fs');
var drawingSection = document.getElementById("drawingSection");
var canvas = document.getElementById("drawingCanvas");
var ctx = canvas.getContext('2d');
var newNoteButton = document.getElementById("create-note-button");

var Delta = Quill.import('delta');
var quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['code-block']
    ]
  },
  placeholder: 'Write something here...',
  theme: 'snow'
});
const BlockPrototype = Quill.import("blots/block");

class CustomBlock extends BlockPrototype {
  constructor(domNode, value) {
    super(domNode, value);
    this.format("size", "18px");
  }

  static tagName = "P";

  format(name, value) {
    if (name === "size") {
      this.domNode.style.fontSize = value;
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(CustomBlock, true);

window.onload = async () => {
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
