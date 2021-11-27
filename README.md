# SketchNote

a note taking and drawing app with a rich text editor supporting LaTeX and embeds.

# Getting started

1. Clone the repository.
2. Run `npm install` to install all the required packages. Then run `npm start` to start the app.

electron-packager is used to package and build the app.

**Linux:** Run `npm run package-linux` to create the release build. Then run the `SketchNote` file in the release folder to launch the app.


**Windows/macOS:** Use electron-packager in a similar way to create the build.

# Features
- Easily manage notes and add as many drawings as required onto each note.
- Rich text-editor with several features including LaTeX and image/video embeds.
- Download any of your notes as a html file with proper rendering.
- Save the drawings as an image file.
- Notes are auto-saved every second.

# Dependencies
- [quill](https://github.com/quilljs/quill)
- [drawingboard.js](https://github.com/Leimi/drawingboard.js/)
- [KaTeX](https://github.com/KaTeX/KaTeX)
- Bootstrap
---
![](https://github.com/iammanish17/SketchNote/blob/main/ss.gif?raw=true)
