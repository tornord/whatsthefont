var Canvas = require("canvas");
var seedrandom = require("seedrandom");
var Image = Canvas.Image;
var ImageData = Canvas.ImageData;
var { FontImageCreator } = require("../commonjs/src/FontImageCreator");

class FontImageProvider {

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

    static nextBatch(count, imageSize, seed) {
        let buffer = new ArrayBuffer(count * imageSize * imageSize * 4);
        let rng = seedrandom(seed);
        console.log(count);
        let canvas = new Canvas(imageSize, imageSize);
        console.log("ok");
        let labelarray = [];
        for (let i = 0; i < count; i++) {
            let s = Math.floor(1e8 * rng());
            let feats = FontImageCreator.calcFeatures(s);
            console.log(JSON.stringify(feats));
            FontImageCreator.createRandomImage(canvas, imageSize, s);
            FontImageProvider.readImageData(buffer, i, canvas, imageSize);
            labelarray.push(FontImageCreator.fontNames.map((d) => (d === feats.font ? 1 : 0)));
        }

        return { xs: new Float32Array(buffer, 0, count * imageSize * imageSize), labels: labelarray };
    }
}

module.exports = { FontImageProvider };