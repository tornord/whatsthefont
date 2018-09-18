var seedrandom = require("seedrandom");
var tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
var fs = require("fs");
var path = require("path");
var { Model } = require("../commonjs/src/Model");
var { FontImageCreator } = require("../commonjs/src/FontImageCreator");
var { FontImageProvider } = require("./FontImageProvider");

const BATCH_SIZE = 64;
const TRAIN_BATCHES = 3000;
const TEST_BATCH_SIZE = 1000;
const TEST_ITERATION_FREQUENCY = 5;
const IMAGES_SIZE = 32;
const SEED = new Date().getTime();
var canvases = {};

class UI {
    plotLosses(values) {}
    plotAccuracies(values) {}
}

function nextBatch(canvases, batchSize, imageSize, seed) {
    let batch = FontImageProvider.nextBatch(canvases, batchSize, imageSize, seed);
    let xs = tf.tensor2d(batch.xs, [batchSize, imageSize * imageSize]);
    let labels = tf.tensor2d(batch.labels, [batchSize, batch.labels[0].length]);
    xs = xs.reshape([batchSize, imageSize, imageSize, 1]);
    return { xs, labels };
}

async function modelToJson(model, name) {
    var ws = model.getNamedWeights();
    const { data: weightData, specs: weightSpecs } = await tf.io.encodeWeights(ws);
    const modelTopology = model.toJSON(null, false);
    return { name, modelTopology, weightSpecs, weightData: new Buffer(weightData).toString("base64") };
}

async function train(model) {
    let rng = seedrandom(SEED);
    let testRng = seedrandom(rng());
    let ui = new UI();
    let lossValues = [];
    let accuracyValues = [];
    for (let i = 0; i < TRAIN_BATCHES; i++) {
        let [batch, validationData] = tf.tidy(() => {
            let batch = nextBatch(canvases, BATCH_SIZE, IMAGES_SIZE, Math.floor(1e8 * rng()));

            let validationData;
            if (i % TEST_ITERATION_FREQUENCY === 0) {
                let testBatch = nextBatch(canvases, TEST_BATCH_SIZE, IMAGES_SIZE, Math.floor(1e8 * testRng()));
                validationData = [testBatch.xs, testBatch.labels];
            }
            return [batch, validationData];
        });
        let history = await model.fit(batch.xs, batch.labels, { batchSize: BATCH_SIZE, validationData, epochs: 1 });

        let loss = history.history.loss[0];
        let accuracy = history.history.acc[0];

        lossValues.push({ batch: i, loss: loss, set: "train" });
        ui.plotLosses(lossValues);

        if (validationData != null) {
            accuracyValues.push({ batch: i, accuracy: accuracy, set: "train" });
            ui.plotAccuracies(accuracyValues);
        }
        if (i > 0 && i % 20 === 0) {
            console.log(i + ": " + Object.keys(canvases).length + " - " +
                accuracyValues
                    .slice(accuracyValues.length - 4, accuracyValues.length)
                    .map((d) => (100 * d.accuracy).toFixed(0))
                    .join(" ")
            );
        }
        tf.dispose([batch, validationData]);
        await tf.nextFrame();
    }
    return { lossValues, accuracyValues };
}

class ResultPage {
    constructor() {
        this.html = '<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">\r\n<title>Geometry Images Machine Learning</title>\r\n<style>\r\nbody { background: #e8e8e8; }\r\n</style>';
        this.html += '</head>\r\n<body translate="no">\r\n';
    }

    addImage(title, src) {
        this.html += '<img title="' + title + '" src="' + src + '" />\r\n';
    }

    writeFile(fileName) {
        this.html += "</body>\r\n</html>\r\n";
        fs.writeFileSync(fileName, this.html);
    }
}

async function run() {
    let model = Model.create(IMAGES_SIZE);
    let res = await train(model);
    console.log(res.accuracyValues.map((d) => (100 * d.accuracy).toFixed(0)).join(" "));

    let seed = 123; //new Date().getTime();
	let rng = seedrandom(seed);
    let testBatchesCount = 1;

    let page = new ResultPage();
    let nTot = 0;
    let nCorrect = 0;
    for (let i = 0; i < testBatchesCount; i++) {
		let batchSeed = Math.floor(1e8 * rng());
		let batchRng = seedrandom(batchSeed);
		let batch = nextBatch(canvases, TEST_BATCH_SIZE, IMAGES_SIZE, batchSeed);
		let pred = model.predict(batch.xs, { batchSize: TEST_BATCH_SIZE });
		// let y = await batch.labels.data();
		let yPred = await pred.data();
		for (let j=0; j<TEST_BATCH_SIZE; j++) {
			let imgseed = Math.floor(1e8 * batchRng());
			let feats = FontImageCreator.calcFeatures(imgseed);
			var predLab = FontImageCreator.fontNames.reduce(
				(p, c, k) => {
					var v = yPred[FontImageCreator.fontNames.length * j + k];
					if (p.value > v) {
						return p;
					}
					return { name: c, value: v };
				},
				{ name: "", value: 0 }
			);
			nTot++;	
			nCorrect += feats.font === predLab.name ? 1 : 0;
			if (i === 0) {
				var src = FontImageProvider.createDataURL(canvases, IMAGES_SIZE, feats.font === predLab.name ? "#96f16a" : "#ec6a6a", imgseed);
				page.addImage(feats.font + " => " + predLab.name + " " + (100 * predLab.value).toFixed(0) + "%", src);
			}
		}
    }
    console.log(((100 * nCorrect) / nTot).toFixed(2) + "%");
    page.writeFile(path.join(__dirname, "../public/result.html"));
    var json = await modelToJson(model, "whatsthefont");
    var modelPath = path.join(__dirname, "data");
    fs.writeFileSync(path.join(modelPath, "model.json"), JSON.stringify(json));
}

run();
