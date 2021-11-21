var Store = require('electron-store');
var db = new Store();
var drawingSection = document.getElementById("drawingSection");
var noteSection = document.getElementById("note-section");
var newNoteButton = document.getElementById("create-note-button");
var modeToggleButton = document.getElementById("mode-toggle-button");
var quillEditor = document.getElementById("quill-editor");
var drawingCanvas = document.getElementById("drawingCanvas");
var canvas, ctx, quill, activeKey, editKey, activePage = 1, toggle = 0;

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
  renderNotes();
  console.log(db.store);
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
    if (db.size === 0)
    {
      quillEditor.style.display = "none";
      drawingCanvas.style.display = "none";
    }
    else
    {
    if (toggle === 0)
      quillEditor.style.display = "block";
    else
      drawingCanvas.style.display = "block";
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!activeKey) return;
    data = db.get(activeKey);
    if (data.content)
      quill.setContents(data.content);
    else
      quill.setContents([{ insert: '\n' }]);
      
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

  updateNote = () => {
    if (!activeKey) return;
    key = activeKey;
    currentData = db.get(key);
    images = currentData.images;
    images[activePage] = canvas.toDataURL('image/jpg', 1);
    db.set(key,
      {
        'title': currentData.title,
        'content': quill.getContents(),
        'description': quill.getText(0, 30).replace("\n", ""),
        'images': images
      })
  }

  onSelectNote = (key) => {
    if (!db.has(key) || activeKey === key) return;
    activeKey = key;
    if (editKey != key) editKey = "";
    renderNotes();
  }

  onEditButtonClick = (key) => {
    console.log("hi");
    editKey = key;
    renderNotes();
  }

  onTitleEdit = (key) => {
    title = document.getElementById("note-title").value;
    currentData = db.get(key);
    db.set(key, 
      {
        'title': title,
        'description': currentData.description,
        'content': currentData.content,
        'images': currentData.images
      });
    editKey = "";
    renderNotes();
  }

  onNoteDelete = (key) => {
    db.delete(key);
    if (activeKey == key)
      activeKey = "";
    renderNotes();
  }

  renderNotes = () => {
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
      content += `<a onclick="onSelectNote('${key}')" class="list-group-item list-group-item-action py-3 lh-tight`;
      if (key == activeKey) content += ` active`;
      content += `"><div class="d-flex w-100 align-items-center justify-content-between"><div>`;

      if (key == editKey)
      {
      content += `<button style="float: right;" class="btn" onclick="onTitleEdit('${key}')"><i class="fa fa-check-square"></i></button>`;
      content += `<input id="note-title" type="text" value="${title}" maxlength="16" size="10%"><br><br>`;
      }
      else
      {
        content += `<strong class="mb-1">${title}</strong>`;
        content += `<button class="btn" onclick="onEditButtonClick('${key}')"><i class="fa fa-pencil"></i></button>`;
      }
      content += `</div><button class="btn" onclick="onNoteDelete('${key}')">`
      content += `<i class="fa fa-trash" style="color: red;"></i></button>`;
      content += `</div><div class="col-10 mb-1 small">${description}</div><div style="float: right;">`;
      content += `<small>${getFormattedTime(key)}</small>`;
      content += `</div></a>`;
    }
    noteSection.innerHTML = content;
    loadNote();
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
    if (!activeKey)
      activeKey = noteID;
    renderNotes();
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

      if (toggle === 0)
      {
        modeToggleButton.innerHTML = modeToggleButton.innerHTML.replace('toggle-off', 'toggle-on');
        quillEditor.style.display = "none";
        if (db.size !== 0) 
          drawingCanvas.style.display = "block";
      }
      else
      {
        modeToggleButton.innerHTML = modeToggleButton.innerHTML.replace('toggle-on', 'toggle-off');
        drawingCanvas.style.display = "none";
        if (db.size !== 0)
          quillEditor.style.display = "block";
      }
      toggle = 1 - toggle;
    }

    setInterval(updateNote, 1000);