"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FontImageCreator = exports.FontImageCreator = function () {
    function FontImageCreator() {
        _classCallCheck(this, FontImageCreator);
    }

    _createClass(FontImageCreator, null, [{
        key: "calcSeed",
        value: function calcSeed(fontIndex, detailIndex, upperIndex, lowerIndex) {
            var res = lowerIndex;
            res = res * FontImageCreator.upperGlyphs.length + upperIndex;
            res = res * FontImageCreator.details.length + detailIndex;
            res = res * FontImageCreator.fontNames.length + fontIndex;
            return res;
        }
    }, {
        key: "calcFeatures",
        value: function calcFeatures(seed) {
            var n = seed % FontImageCreator.fontNames.length;
            var font = FontImageCreator.fontNames[n];
            seed = (seed - n) / FontImageCreator.fontNames.length;

            n = seed % FontImageCreator.details.length;
            var detail = FontImageCreator.details[n];
            seed = (seed - n) / FontImageCreator.details.length;

            n = seed % FontImageCreator.upperGlyphs.length;
            var upper = FontImageCreator.upperGlyphs[n];
            seed = (seed - n) / FontImageCreator.upperGlyphs.length;

            n = seed % FontImageCreator.lowerGlyphs.length;
            var lower = FontImageCreator.lowerGlyphs[n];
            seed = (seed - n) / FontImageCreator.lowerGlyphs.length;

            var text = detail;
            if (detail === "randomTwoGlyphs") {
                text = upper + lower;
            } else if (detail === "randomUpperGlyph") {
                text = upper;
            } else if (detail === "randomLowerGlyph") {
                text = lower;
            }
            return {
                font: font,
                text: text,
                detail: detail
            };
        }
    }, {
        key: "createRandomImage",
        value: function createRandomImage(ctx, size, seed, backgroundColor) {
            var _FontImageCreator$cal = FontImageCreator.calcFeatures(seed),
                font = _FontImageCreator$cal.font,
                text = _FontImageCreator$cal.text,
                detail = _FontImageCreator$cal.detail;

            var fontSize = 0.55;
            var x = 0;
            var y = 0;
            if (detail === "randomglyph") {
                fontSize = 0.85;
            } else if (detail === "g") {
                fontSize = 2.5;
            } else if (detail === "m") {
                fontSize = 1.6;
                x = -0.2;
                y = 0.1;
            } else if (detail === "Q") {
                fontSize = 1.65;
                x = 0.15;
                y = -0.1;
            } else if (detail === "J") {
                fontSize = 1.65;
                x = -0.05;
                y = -0.12;
            } else if (detail === "O") {
                fontSize = 1.3;
                x = 0.0;
                y = 0.4;
            } else if (detail === "T") {
                fontSize = 1.55;
                x = 0.0;
                y = 0.4;
            } else if (detail === "P" || detail === "k") {
                fontSize = 2.6;
                x = -0.14;
                y = 0.2;
            } else if (detail === "d") {
                fontSize = 2.8;
                x = 0.13;
                y = 0.55;
            } else if (detail === "A") {
                fontSize = 2.6;
                if (font === "Bauhaus") {
                    fontSize = 1.8;
                }
                x = 0;
                y = 0.5;
            }

            if (!backgroundColor) {
                backgroundColor = "rgba(255, 255, 255, 1)";
            }
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, size, size);

            font = FontImageCreator.fontNames[4];
            ctx.font = (size * fontSize).toFixed(2) + "px " + "'" + font + "'";
            // if (seed === 52443113) {
            //     console.log("u2");
            // }
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic";
            ctx.fillText(text, size * (0.5 - fontSize * x), 3 * size / 4 + size * fontSize * y);
        }
    }]);

    return FontImageCreator;
}();

FontImageCreator.fontNames = ["Helvetica Neue", "Baskerville", "Times New Roman", "Akzidenz Grotesk", "Gotham", "Bodoni", "Didot", "Futura", "Gill Sans", "Frutiger", "Bembo", "Rockwell", "Franklin Gothic", "Sabon", "Georgia", "Garamond", "News Gothic", "Myriad", "Mrs Eaves", "Minion", "Roboto", "Verdana", "Montserrat", "Proxima Nova", "Gotham Rounded", "Segoe UI", "Arial", "Avenir", "Stag", "Public", "Museo Sans", "Gibson", "Tahoma", "Consolas", "Optima", "Lucida Sans", "Arnhem", "Palatino", "American Typewriter", "Courier", "Petersburg", "Bauhaus", "Open Sans", "Cambria", "Univers", "Graphik", "Caslon Antique", "Lato", "Pluto Sans", "Brandon Grotesque", "Raleway", "Circular"];
FontImageCreator.details = ["randomTwoGlyphs", "randomUpperGlyph", "randomLowerGlyph", "g", "Q", "T", "O", "P", "A", "d", "k", "m", "J"];
FontImageCreator.upperGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
FontImageCreator.lowerGlyphs = "abcdefghijklmnopqrstuvwxyzåäö0123456789";

FontImageCreator.randomInt = function (rng, n) {
    return Math.floor(n * rng());
};

FontImageCreator.randomItem = function (arr, rng) {
    return arr[FontImageCreator.randomInt(rng, arr.length)];
};