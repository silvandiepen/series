const fs = require("fs");
const path = require("path");
const dir = "../TESTSHOWS";
const chalk = require("chalk");

let dirt = [
  "HDTV",
  "-SVA",
  "-RARBG",
  "-KILLERS",
  "WEB-DL",
  "WEBRIP",
  "x264",
  "-tbs",
  ".web"
];

let trash = ["ore", "nfo", "txt", "srt"];

let operation = [["..", "."], ["  ", " "]];

function deleteFile(file, callback = function() {}) {
  fs.unlink(file, err => {
    if (err) throw err;
    console.log("successfully deleted /tmp/hello");
    callback();
  });
}
// Check if the file has dirty strings.
function hasDirt(file) {
  let dirty = false;
  dirt.forEach(function(v) {
    if (file.indexOf(v) > -1) {
      dirty = true;
    }
  });
  return dirty;
}

// Check if the file could use some cosmetic help
function isUgly(file) {
  let ugly = false;
  operation.forEach(function(v) {
    if (file.indexOf(v[0]) > -1) {
      ugly = true;
    }
  });
  return ugly;
}

// Check if this file is useless.
function isTrash(fileName) {
  let waste = false;
  trash.forEach(function(v) {
    if (fileName.substr(fileName.length - 3) == v) {
      waste = true;
    }
  });
  return waste;
}

// Rename the file
function renameDirt(file, callback = function() {}) {
  let i = 0;
  let newFile;
  dirt.forEach(function(v) {
    if (file.indexOf(v) > -1) {
      console.log(file, file.replace(v, ""));
      fs.rename(file, file.replace(v, ""), err => {
        if (err) throw err;
        console.log("renamed complete");
      });
    }
    i++;
    if (i == dirt.length) {
      callback();
      return newFile;
    }
  });
}
function getFilename(filename) {
  return filename.split("/")[filename.split("/").length - 1];
}
// Get rid of the uglyness.
function doSurgery(file, callback = function() {}) {
  let i = 0;
  let newFile;
  operation.forEach(function(v) {
    if (file.indexOf(v[0]) > -1) {
      newFile = file.replace(v[0], v[1]);
      fs.rename(file, newFile, err => {
        if (err) throw err;
      });
    }
    //Check again of the file isnt ugly
    // if (isUgly(newFile)) {
    //   doSurgery(file, callback);
    // } else {
    i++;
    if (i == operation.length) {
      callback();
      return getFilename(newFile);
      //   }
    }
  });
}

let fixFile = function(fileName, file) {
  if (isTrash(fileName)) {
    deleteFile(file, function() {
      console.log(fileName, chalk.red(" is deleted"));
    });
  } else if (hasDirt(fileName) || isUgly(fileName)) {
    renameDirt(file, function() {
      console.log(fileName, chalk.blue(" is being renamed"));
      doSurgery(file, function() {
        console.log(fileName, chalk.blue(" got some surgery"));
      });
    });
  }
  //   deleteFile(renameDirt(doSurgery(file)));
};
let sherlock = function() {
  fs.readdir(dir, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      let file = dir + "/" + files[i];
      let fileName = files[i];
      fs.stat(file, function(err, stats) {
        // console.log(file);
        if (fs.lstatSync(file).isDirectory()) {
          console.log(file, chalk.yellow(" is a directory"));
        } else {
          fixFile(fileName, file);
        }
      });
    }
  });
};

sherlock();
