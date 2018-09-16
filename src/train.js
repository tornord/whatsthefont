var seedrandom = require("seedrandom");
var tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
var fs = require("fs");
var { Model } = require("../commonjs/src/Model");
var { FontImageCreator } = require("../commonjs/src/FontImageCreator");
var { FontImageProvider } = require("./FontImageProvider");

const BATCH_SIZE = 64;
const TRAIN_BATCHES = 50;
const TEST_BATCH_SIZE = 1000;
const TEST_ITERATION_FREQUENCY = 5;
const IMAGES_SIZE = 28;
const SEED = new Date().getTime();

class UI {
    plotLosses(values) {}
    plotAccuracies(values) {}
}

function nextBatch(batchSize, imageSize, seed) {
    let batch = FontImageProvider.nextBatch(batchSize, imageSize, seed)
    let xs = tf.tensor2d(batch.xs, [batchSize, imageSize * imageSize]);
    let labels = tf.tensor2d(batch.labels, [batchSize, batch.labels[0].length]);
    xs = xs.reshape([batchSize, imageSize, imageSize, 1]);
    return { xs, labels };
}

async function modelToJson(model, name) {
    var ws = model.getNamedWeights();
    const { data: weightData, specs: weightSpecs } = await tf.io.encodeWeights(ws);
    const modelTopology = model.toJSON(null, false);    
    return { name, modelTopology, weightSpecs, weightData: new Buffer(weightData).toString('base64') };
}

async function train(model) {
    let rng = seedrandom(SEED);
    let testRng = seedrandom(rng());
    let ui = new UI();
    let lossValues = [];
    let accuracyValues = [];
    for (let i = 0; i < TRAIN_BATCHES; i++) {
        let [batch, validationData] = tf.tidy(() => {
            let batch = nextBatch(BATCH_SIZE, IMAGES_SIZE, Math.floor(1e8 * rng()));

            let validationData;
            if (i % TEST_ITERATION_FREQUENCY === 0) {
                let testBatch = nextBatch(TEST_BATCH_SIZE, IMAGES_SIZE, Math.floor(1e8 * testRng()));
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
        if (i % 50 === 0) {
            console.log(accuracyValues.map((d) => (100 * d.accuracy).toFixed(0)).join(" "));
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

    let seed = new Date().getTime();
    let testCount = 10000;
    let batch = nextBatch(testCount, IMAGES_SIZE, seed);
    let pred = model.predict(batch.xs, { batchSize: testCount });
    let y = await batch.labels.data();
    let yPred = await pred.data();

    let rng = seedrandom(seed);
    // let page = new ResultPage();
    let nCorrect = 0;
    for (let i = 0; i < testCount; i++) {
        let imgseed = Math.floor(1e8 * rng());
        let feats = FontImageCreator.calcFeatures(imgseed);
        var predLab = FontImageCreator.fontNames.reduce(
            (p, c, k) => {
                var v = yPred[3 * i + k];
                if (p.value > v) {
                    return p;
                }
                return { name: c, value: v };
            },
            { name: "", value: 0 }
        );
        nCorrect += feats.geoform === predLab.name ? 1 : 0;
        // if (i < 1000) {
        //     var src = FontImageProvider.createDataURL(IMAGES_SIZE, feats.geoform === predLab.name ? "#96f16a" : "#ec6a6a", imgseed);
        //     page.addImage(feats.geoform + " => " + predLab.name + " " + (100 * predLab.value).toFixed(0) + "%", src);
        // }
    }
    console.log(((100 * nCorrect) / testCount).toFixed(2) + "%");
	// page.writeFile("./index.html");
	var json = await modelToJson(model, "whatsthefont");
	var modelPath = path.join(__dirname, "data");
	fs.writeFileSync(path.join(modelPath, "model.json"), JSON.stringify(json));
}

run();
