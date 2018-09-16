var tf = require("@tensorflow/tfjs");
var { FontImageCreator } = require("./FontImageCreator");

class Model {
    static create(imageSize) {
        const model = tf.sequential();

        model.add(
            tf.layers.conv2d({
                inputShape: [imageSize, imageSize, 1],
                kernelSize: 5,
                filters: 120,
                strides: 1,
                activation: "relu",
                kernelInitializer: "VarianceScaling"
            })
        );

        model.add(
            tf.layers.maxPooling2d({
                poolSize: [2, 2],
                strides: [2, 2]
            })
        );

        var lay3 = tf.layers.conv2d({
            kernelSize: 5,
            filters: 120,
            strides: 1,
            activation: "relu",
            kernelInitializer: "VarianceScaling"
        });
        model.add(lay3);
        var nlay3 = lay3.outputShape[1];
        var mlay3 = lay3.outputShape[2];

        model.add(
            tf.layers.maxPooling2d({
                poolSize: [nlay3, mlay3],
                strides: [1, 1]
            })
        );

        model.add(tf.layers.flatten());

        model.add(
            tf.layers.dense({
                units: FontImageCreator.fontNames.length,
                kernelInitializer: "VarianceScaling",
                activation: "softmax"
            })
        );

        const LEARNING_RATE = 0.15;
        const optimizer = tf.train.sgd(LEARNING_RATE);

        model.compile({
            optimizer: optimizer,
            loss: "categoricalCrossentropy",
            metrics: ["accuracy"]
        });

        console.log([model.layers[0].batchInputShape, ...model.layers.map((d) => d.outputShape)].map((d) => d.filter((e) => e !== null).join("x")).join(" => "));

        return model;
    }
}

module.exports = { Model };
