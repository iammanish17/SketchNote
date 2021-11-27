var Store = require('electron-store');
var db = new Store();
var drawingSection = document.getElementById("drawingSection");
var noteSection = document.getElementById("note-section");
var modeToggleButton = document.getElementById("mode-toggle-button");
var quillEditor = document.getElementById("quill-editor");
var drawingCanvas = document.getElementById("drawingCanvas");
var pagination = document.getElementById("paginate-pages");
var pageAnchor = document.getElementById("page-number-display");
var downloadButton = document.getElementById("download-button");
var wrapper;
var board, quill, activeKey, editKey, activePage = 1, toggle = 0;

window.onload = async () => {

  quill = new Quill('#editor', {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block', 'image', 'video', 'formula']
      ]
    },
    placeholder: 'Write something here...',
    theme: 'snow'
  });
  board = new DrawingBoard.Board('drawingCanvas', {
    background: false,
    controls: [
      'Color',
      { Size: { type: 'dropdown' } },
      { DrawingMode: { filler: false } },
      'Navigation',
      'Download'
    ],
    size: 1,
    droppable: true,
    stretchImg: true
  });
  wrapper = document.getElementsByClassName("drawing-board-canvas-wrapper")[0];
  renderNotes();
};



window.addEventListener('resize', function (event) {
  var img = new Image();
  img.src = board.canvas.toDataURL('image/jpg', 1);
  var width = Math.floor(window.innerWidth * 0.55);
  var height = Math.floor(window.innerHeight * 0.825);
  board.canvas.width = width;
  board.canvas.style.width = width + 'px';
  wrapper.style.width = width + 'px';
  board.canvas.height = height;;
  board.canvas.style.height = height + 'px';
  wrapper.style.height = height + 'px';
  board.ctx.lineCap = 'round';
  board.ctx.lineJoin = 'round';
  img.onload = function () {
    board.ctx.drawImage(img, 0, 0, board.canvas.width, board.canvas.height);
  };
}, true);

getFormattedTime = (epoch) => {
  var date = new Date(Number(epoch));
  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  var day = date.getDate().toString().padStart(2, '0');
  var hour = date.getHours().toString().padStart(2, '0');
  var minute = date.getMinutes().toString().padStart(2, '0');
  return month + ' ' + day + ' ' + date.getFullYear() + ', ' + hour + ':' + minute;
}

changePage = (delta) => {
  if (activePage + delta >= 1) {
    activePage += delta;
    pageAnchor.innerHTML = activePage;
    loadNote();
  }
}

loadNote = () => {
  if (db.size === 0) {
    activePage = 1;
    pageAnchor.innerHTML = activePage;
    quillEditor.style.display = "none";
    drawingCanvas.style.display = "none";
    pagination.style.display = "none";
    downloadButton.style.display = "none";

  }
  else {
    if (toggle === 0) {
      quillEditor.style.display = "block";
      downloadButton.style.display = "block";
      pagination.style.display = "none";
    }
    else {
      drawingCanvas.style.display = "block";
      pagination.style.display = "inline-block";
    }
  }

  board.ctx.clearRect(0, 0, board.canvas.width, board.canvas.height);
  if (!activeKey) return;
  data = db.get(activeKey);
  if (data.content)
    quill.setContents(data.content);
  else
    quill.setContents([{ insert: '\n' }]);

  images = data.images;
  if (images.hasOwnProperty(activePage)) {
    var image = new Image();
    image.onload = function () {
      board.ctx.drawImage(image, 0, 0, board.canvas.width, board.canvas.height);
    };
    image.src = images[activePage];
  }
}

updateNote = () => {
  if (!activeKey) return;
  key = activeKey;
  currentData = db.get(key);
  images = currentData.images;
  images[activePage] = board.canvas.toDataURL('image/jpg', 1);
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
  activePage = 1;
  pageAnchor.innerHTML = activePage;
  if (editKey != key) editKey = "";
  renderNotes();
}

onEditButtonClick = (key) => {
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
  for (key in db.store) {
    keys.push(key)
  }
  keys = keys.sort(function (a, b) { return Number(b) - Number(a); });
  var content = "";
  if (!activeKey && keys.length > 0)
    activeKey = keys[0];
  if (!keys.length) {
    content = `<p>Looks like you have not created any notes. Click on the + button to get started.</p>`;
  }
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    title = db.get(key).title;
    description = db.get(key).description;
    content += `<a onclick="onSelectNote('${key}')" class="list-group-item list-group-item-action list-group-item-secondary py-3 lh-tight`;
    if (key == activeKey) content += ` active`;
    content += `"><div class="d-flex w-100 align-items-center justify-content-between"><div>`;

    if (key == editKey) {
      content += `<button style="float: right;" class="btn" onclick="onTitleEdit('${key}')"><i class="fa fa-check-square"></i></button>`;
      content += `<input id="note-title" type="text" value="${title}" maxlength="16" size="10%"><br><br>`;
    }
    else {
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

onCreateNote = () => {
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
}

modeToggleButton.onclick = () => {
  if (toggle === 0) {
    modeToggleButton.innerHTML = modeToggleButton.innerHTML.replace('toggle-off', 'toggle-on');
    quillEditor.style.display = "none";
    downloadButton.style.display = "none";
    if (db.size !== 0) {
      drawingCanvas.style.display = "block";
      pagination.style.display = "inline-block";
    }
  }
  else {
    modeToggleButton.innerHTML = modeToggleButton.innerHTML.replace('toggle-on', 'toggle-off');
    drawingCanvas.style.display = "none";
    pagination.style.display = "none";
    if (db.size !== 0) {
      quillEditor.style.display = "block";
      downloadButton.style.display = "block";
    }
  }
  toggle = 1 - toggle;
}

downloadButton.onclick = () => {
  var content = `
      <html>
      <head>
      <title>${db.get(activeKey).title}</title>
      <h2>${db.get(activeKey).title}</h2>
      <p>Created on ${getFormattedTime(activeKey)}</p>
      <hr>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.css">
      <script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.js"></script>
      </head>
      <body>
      ${quill.root.innerHTML}
      </body>
      </html>
      `;
  var blob = new Blob([content], { type: "text/html" });
  var doc = document.createElement("a");
  doc.href = URL.createObjectURL(blob);
  doc.download = activeKey + ".html";
  doc.hidden = true;
  document.body.appendChild(doc);
  doc.click();
}

setInterval(updateNote, 1000);