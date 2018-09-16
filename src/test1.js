var Canvas = require("canvas");
var seedrandom = require("seedrandom");
var Image = Canvas.Image;
var ImageData = Canvas.ImageData;

var fs = require('fs');
var ttf2woff2 = require('ttf2woff2');
 
var input = fs.readFileSync('./src/Baskerville-Medium.otf');
 
fs.writeFileSync('./src/Baskerville-Medium.woff2', ttf2woff2(input));