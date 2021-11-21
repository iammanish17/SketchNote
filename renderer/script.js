var Store = require('electron-store');
var db = new Store();
var drawingSection = document.getElementById("drawingSection");
var noteSection = document.getElementById("note-section");
var newNoteButton = document.getElementById("create-note-button");
var modeToggleButton = document.getElementById("mode-toggle-button");
var quillEditor = document.getElementById("quill-editor");
var drawingCanvas = document.getElementById("drawingCanvas");
var canvas, ctx, quill, activeKey, activePage = 1;

window.onload = async () => {

quill = new Quill('#editor', {
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
  var customBoard2 = new DrawingBoard.Board('drawingCanvas', {
    controls: [
      'Color',
      { Size: { type: 'dropdown' } },
      { DrawingMode: { filler: false } },
      'Navigation'
    ],
    size: 1
  });
  canvas = document.getElementsByClassName('drawing-board-canvas')[0];
  ctx = canvas.getContext("2d");
  renderNotes('');
  loadNote();

  };

  getFormattedTime = (epoch) => {
    var date = new Date(Number(epoch));
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
    var day = date.getDate().toString().padStart(2, '0');
    var hour = date.getHours();
    var minute = date.getMinutes();
    return month + ' ' + day + ' ' + date.getFullYear() + ', ' + hour + ':' + minute;
  }

  loadNote = () => {
    if (!activeKey) return;
    data = db.get(activeKey);
    if (data.content)
    {
      quill.setContents(data.content);
    }
    images = data.images;
    if (images.hasOwnProperty(activePage))
    {
      var image = new Image();
      image.onload = function() {
      ctx.drawImage(image, 0, 0);
    };
    image.src = images[activePage];
    }
  }

  renderNotes = (editKey) => {
    var keys = [];
    var key;
    for (key in db.store)
    {
      keys.push(key)
    }
    keys = keys.sort(function (a, b) {  return Number(b) - Number(a);  });
    var content = "";
    if (!activeKey && keys.length > 0) 
      activeKey = keys[0]; 
    for(i = 0; i < keys.length; i++)
    {
      key = keys[i];
      title = db.get(key).title;
      description = db.get(key).description;
      content += '<a class="list-group-item list-group-item-action py-3 lh-tight';
      if (key == activeKey) content += ' active';
      content += '"><div class="d-flex w-100 align-items-center justify-content-between"><div>';

      if (key == editKey)
      {
      content += '<input type="text" id="edit-title-input-'+key+'"><br><br>';
      content += '<button id=end-edit-'+key+' class="btn" onclick="onTitleEdit()">';
      content += '<i class="fas fa-check-square"></i></button>';
      }
      else
      {
        content += '<strong class="mb-1">' + title + '</strong>';
        content += '<button id=begin-edit-'+key+' class="btn" onclick="onEditButtonClick()">';
        content += '<button class="btn"><i class="fa fa-pencil"></i></button>';
      }
      content += '</div><button class="btn" id="delete-' + key + '" onclick="onNoteDelete()">'
      content += '<i class="fa fa-trash" style="color: red;"></i></button>';
      content += '</div><div class="col-10 mb-1 small">' + description + '</div><div style="float: right;">';
      content += '<small>' + getFormattedTime(key) + '</small>';
      content += '</div></a>'
    }
    noteSection.innerHTML = content;
  }

  newNoteButton.onclick = () => {
    var noteID = new Date().getTime().toString();
    db.set(noteID,
      {
        'title': "New Note",
        'description': "",
        'content': false,
        'images': {
          }
      }
    );
    //const data = canvas.toDataURL('image/jpg', 1);
    //db.set({
    //  69: data
    //});
    
    //var image = new Image();
    //image.onload = function() {
    //  ctx.drawImage(image, 0, 0);
    //};
    //image.src = db.get('69');

    return;


      quill.setContents(db.get('69'));
      console.log(db.get('69'));
      console.log(quill.getContents());
      db.set({
        69: quill.getContents()
      });
  }

  modeToggleButton.onclick = () => {
      if (modeToggleButton.innerText === "Editor Mode")
      {
        modeToggleButton.innerText = "Canvas Mode";
        quillEditor.style.display = "none";
        drawingCanvas.style.display = "block";
      }
      else
      {
        modeToggleButton.innerText = "Editor Mode";
        drawingCanvas.style.display = "none";
        quillEditor.style.display = "block";
      }
  
    }