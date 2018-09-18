"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tf = require("@tensorflow/tfjs");

var _require = require("./FontImageCreator"),
    FontImageCreator = _require.FontImageCreator;

var Model = function () {
    function Model() {
        _classCallCheck(this, Model);
    }

    _createClass(Model, null, [{
        key: "create",
        value: function create(imageSize) {
            var model = tf.sequential();

            model.add(tf.layers.conv2d({
                inputShape: [imageSize, imageSize, 1],
                kernelSize: 5,
                filters: 120,
                strides: 1,
                activation: "relu",
                kernelInitializer: "VarianceScaling"
            }));

            model.add(tf.layers.maxPooling2d({
                poolSize: [2, 2],
                strides: [2, 2]
            }));

            var lay3 = tf.layers.conv2d({
                kernelSize: 5,
                filters: 200,
                strides: 1,
                activation: "relu",
                kernelInitializer: "VarianceScaling"
            });
            model.add(lay3);
            var nlay3 = lay3.outputShape[1];
            var mlay3 = lay3.outputShape[2];

            model.add(tf.layers.maxPooling2d({
                poolSize: [nlay3, mlay3],
                strides: [1, 1]
            }));

            model.add(tf.layers.flatten());

            model.add(tf.layers.dense({
                units: FontImageCreator.fontNames.length,
                kernelInitializer: "VarianceScaling",
                activation: "softmax"
            }));

            var LEARNING_RATE = 0.15;
            var optimizer = tf.train.sgd(LEARNING_RATE);

            model.compile({
                optimizer: optimizer,
                loss: "categoricalCrossentropy",
                metrics: ["accuracy"]
            });

            console.log([model.layers[0].batchInputShape].concat(_toConsumableArray(model.layers.map(function (d) {
                return d.outputShape;
            }))).map(function (d) {
                return d.filter(function (e) {
                    return e !== null;
                }).join("x");
            }).join(" => "));

            return model;
        }
    }]);

    return Model;
}();

module.exports = { Model: Model };