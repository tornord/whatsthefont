var path = require("path");
var Canvas = require("canvas");
var seedrandom = require("seedrandom");
var Image = Canvas.Image;
var ImageData = Canvas.ImageData;
var { FontImageCreator } = require("../commonjs/src/FontImageCreator");

function fontFile(name) {
    return path.join(__dirname, "./fonts/ttf", name);
}

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
Canvas.registerFont(fontFile("Tratex.ttf"), { family: "Tratex" });

class FontImageProvider {
    static createDataURL(canvases, imageSize, backgroundColor, seed) {
        // let canvas = Canvas.createCanvas(imageSize, imageSize);
        // let ctx = canvas.getContext("2d");
        let canvas = FontImageCreator.createRandomImage(canvases, null, imageSize, seed, backgroundColor);
        return canvas.toDataURL();
    }

    static readImageData(bytebuffer, index, canvas, imageSize) {
        let imagePixelCount = imageSize * imageSize;
        let ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const floatArray = new Float32Array(bytebuffer, index * imagePixelCount * 4, imagePixelCount);
        for (let i = 0; i < imageData.data.length / 4; i++) {
            floatArray[i] = imageData.data[i * 4] / 255;
        }
        return floatArray;
    }

    static nextBatch(canvases, count, imageSize, seed) {
        //var canvases = {}; //FontImageCreator.fontNames.map((d) => Canvas.createCanvas(imageSize, imageSize));
        let buffer = new ArrayBuffer(count * imageSize * imageSize * 4);
        let rng = seedrandom(seed);
        //let canvas = Canvas.createCanvas(imageSize, imageSize);
        let labels = [];
        for (let i = 0; i < count; i++) {
            let s = Math.floor(1e8 * rng());
            let feats = FontImageCreator.calcFeatures(s);
            //let canvas = canvases[s % FontImageCreator.fontNames.length];
            //let ctx = canvas.getContext("2d");
            //console.log(i + " - " + s + " - " + JSON.stringify(feats));
            let canvas = FontImageCreator.createRandomImage(canvases, null, imageSize, s);
            FontImageProvider.readImageData(buffer, i, canvas, imageSize);
            labels.push(FontImageCreator.fontNames.map((d) => (d === feats.font ? 1 : 0)));
        }
        return { xs: new Float32Array(buffer, 0, count * imageSize * imageSize), labels };
    }
}

module.exports = { FontImageProvider };
