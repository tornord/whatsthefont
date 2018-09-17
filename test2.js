var Canvas = require("canvas");
var Image = Canvas.Image;
var Font = Canvas.Font;
var path = require("path");
var { FontImageCreator } = require("./commonjs/src/FontImageCreator");

function fontFile(name) {
    return path.join(__dirname, "./src/fonts/ttf", name);
}

// var f = new Canvas.Font("Akzidenz Grotesk", fontFile("AkzidenzGrotesk-Roman.ttf"));

Canvas.registerFont(fontFile("AkzidenzGrotesk-Roman.ttf"), { family: "Akzidenz Grotesk" });
Canvas.registerFont(fontFile("AmericanTypewriter.ttf"), { family: "American Typewriter" });
Canvas.registerFont(fontFile("Arial.ttf"), { family: "Arial" });
Canvas.registerFont(fontFile("ArnhemPro-Blond.ttf"), { family: "Arnhem" });
Canvas.registerFont(fontFile("Avenir-Medium.ttf"), { family: "Avenir" });
Canvas.registerFont(fontFile("Baskerville-Medium.ttf"), { family: "Baskerville" });
Canvas.registerFont(fontFile("BrandonGrotesque-Medium.ttf"), { family: "Brandon Grotesque" });
Canvas.registerFont(fontFile("Bauhaus-Medium.ttf"), { family: "Bauhaus" });
Canvas.registerFont(fontFile("Bembo.ttf"), { family: "Bembo" });
Canvas.registerFont(fontFile("Bodoni-Regular.ttf"), { family: "Bodoni" });
Canvas.registerFont(fontFile("Circular-Medium.ttf"), { family: "Circular" });
Canvas.registerFont(fontFile("Didot.ttf"), { family: "Didot" });
Canvas.registerFont(fontFile("Consolas.ttf"), { family: "Consolas" });
Canvas.registerFont(fontFile("Cambria.ttf"), { family: "Cambria" });
Canvas.registerFont(fontFile("CaslonAntique.ttf"), { family: "Caslon Antique" });
Canvas.registerFont(fontFile("Courier.ttf"), { family: "Courier" });
Canvas.registerFont(fontFile("FranklinGothic-Book.ttf"), { family: "Franklin Gothic" });
Canvas.registerFont(fontFile("Frutiger-Roman.ttf"), { family: "Frutiger" });
Canvas.registerFont(fontFile("Futura-Medium.ttf"), { family: "Futura" });
Canvas.registerFont(fontFile("GothamRounded-Book.ttf"), { family: "GothamRounded-Book" });
Canvas.registerFont(fontFile("GothamRounded-Medium.ttf"), { family: "Gotham Rounded" });
Canvas.registerFont(fontFile("GillSans.ttf"), { family: "Gill Sans" });
Canvas.registerFont(fontFile("Gibson-Regular.ttf"), { family: "Gibson" });
Canvas.registerFont(fontFile("GothamPro.ttf"), { family: "Gotham" });
Canvas.registerFont(fontFile("Garamond.ttf"), { family: "Garamond" });
Canvas.registerFont(fontFile("Georgia.ttf"), { family: "Georgia" });
Canvas.registerFont(fontFile("Graphik-Regular.ttf"), { family: "Graphik" });
Canvas.registerFont(fontFile("HelveticaNeue.ttf"), { family: "Helvetica Neue" });
Canvas.registerFont(fontFile("Lato-Regular.ttf"), { family: "Lato" });
Canvas.registerFont(fontFile("LucidaSans.ttf"), { family: "Lucida Sans" });
Canvas.registerFont(fontFile("MrsEaves-Roman.ttf"), { family: "Mrs Eaves" });
Canvas.registerFont(fontFile("MinionPro-Regular.ttf"), { family: "Minion" });
Canvas.registerFont(fontFile("Montserrat-Medium.ttf"), { family: "Montserrat" });
Canvas.registerFont(fontFile("MuseoSans.ttf"), { family: "Museo Sans" });
Canvas.registerFont(fontFile("Myriad-Regular.ttf"), { family: "Myriad" });
Canvas.registerFont(fontFile("NewsGothic.ttf"), { family: "News Gothic" });
Canvas.registerFont(fontFile("Optima.ttf"), { family: "Optima" });
Canvas.registerFont(fontFile("OpenSans-Regular.ttf"), { family: "Open Sans" });
Canvas.registerFont(fontFile("ProximaNova-Regular.ttf"), { family: "Proxima Nova" });
Canvas.registerFont(fontFile("Palatino-Medium.ttf"), { family: "Palatino" });
Canvas.registerFont(fontFile("Petersburg.ttf"), { family: "Petersburg" });
Canvas.registerFont(fontFile("PlutoSans-Regular.ttf"), { family: "Pluto Sans" });
Canvas.registerFont(fontFile("Public.ttf"), { family: "Public" });
Canvas.registerFont(fontFile("Roboto-Regular.ttf"), { family: "Roboto" });
Canvas.registerFont(fontFile("Raleway-Medium.ttf"), { family: "Raleway" });
Canvas.registerFont(fontFile("Rockwell.ttf"), { family: "Rockwell" });
Canvas.registerFont(fontFile("Sabon-Roman.ttf"), { family: "Sabon" });
Canvas.registerFont(fontFile("SegoeUI.ttf"), { family: "Segoe UI" });
Canvas.registerFont(fontFile("Stag-Book.ttf"), { family: "Stag" });
Canvas.registerFont(fontFile("Tahoma.ttf"), { family: "Tahoma" });
Canvas.registerFont(fontFile("TimesNewRoman.ttf"), { family: "Times New Roman" });
Canvas.registerFont(fontFile("Univers.ttf"), { family: "Univers" });
Canvas.registerFont(fontFile("Verdana.ttf"), { family: "Verdana" });

var fontNames = [
    "Helvetica Neue",
    "Baskerville",
    "Times New Roman",
    "Akzidenz Grotesk",
    "Gotham",
    "Bodoni",
    "Didot",
    "Futura",
    "Gill Sans",
    "Frutiger",
    "Bembo",
    "Rockwell",
    "Franklin Gothic",
    "Sabon",
    "Georgia",
    "Garamond",
    "News Gothic",
    "Myriad",
    "Mrs Eaves",
    "Minion",
    "Roboto",
    "Verdana",
    "Montserrat",
    "Proxima Nova",
    "Gotham Rounded",
    "Segoe UI",
    "Arial",
    "Avenir",
    "Stag",
    "Public",
    "Museo Sans",
    "Gibson",
    "Tahoma",
    "Consolas",
    "Optima",
    "Lucida Sans",
    "Arnhem",
    "Palatino",
    "American Typewriter",
    "Courier",
    "Petersburg",
    "Bauhaus",
    "Open Sans",
    "Cambria",
    "Univers",
    "Graphik",
    "Caslon Antique",
    "Lato",
    "Pluto Sans",
    "Brandon Grotesque",
    "Raleway",
    "Circular"
];

console.log("loaded");

function draw() {
    var imageSize = 100;

    var canvases = fontNames.map((d) => Canvas.createCanvas(imageSize, imageSize));
    //var canvas = Canvas.createCanvas(imageSize, imageSize);

    //FontImageCreator.createRandomImage(ctx, imageSize, 21445025);
    for (let i = 0; i < 10000; i++) {
        var n = Math.floor(fontNames.length * Math.random());
        var canvas = canvases[n];
        var ctx = canvas.getContext("2d");
        ctx.font = "72.8px " + "'" + fontNames[n] + "'";
        ctx.fillText("test", 25, 45);
    }

    console.log('<img src="' + canvas.toDataURL() + '" />');
}

draw();
