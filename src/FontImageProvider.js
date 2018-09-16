export class FontImageProvider {
	
	static fontNames = [ "Helvetica Neue", "Baskerville", "Times New Roman", "Akzidenz Grotesk", "Gotham", "Bodoni", 
	"Didot", "Futura", "Gill Sans", "Frutiger", "Bembo", "Rockwell", 
	"Franklin Gothic", "Sabon", "Georgia", "Garamond", "News Gothic", "Myriad", 
	"Mrs Eaves", "Minion", 
	"Roboto", "Verdana", "Montserrat", "Proxima Nova", "Gotham Rounded", "Segoe UI", "Arial", "Avenir", "Stag", "Public", 
	"Museo Sans", "Gibson", "Tahoma", "Consolas", "Optima", "Lucida Sans", "Arnhem", "Palatino", "American Typewriter", "Courier", 
	"Petersburg", "Bauhaus", "Open Sans", "Cambria", "Univers", "Graphik", "Caslon Antique",
	"CNN Sans", "Lane Crawford" ];

	static details = ["randomTwoGlyphs", "randomUpperGlyph", "randomLowerGlyph", "g", "Q", "T", "O", "P", "A", "d", "k", "m", "J"];

	static upperGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
	static lowerGlyphs = "abcdefghijklmnopqrstuvwxyzåäö0123456789";

	static randomInt = (rng, n) => {
		return Math.floor(n*rng());
	}
	
	static randomItem = (arr, rng) => {
		return arr[FontImageProvider.randomInt(rng, arr.length)];
	}

	static calcSeed(fontIndex, detailIndex, upperIndex, lowerIndex) {
		var res = lowerIndex;
		res = res * FontImageProvider.upperGlyphs.length + upperIndex;
		res = res * FontImageProvider.details.length + detailIndex;
		res = res * FontImageProvider.fontNames.length + fontIndex;
		return res;
	}

	static createRandomFeatures(seed) {
		var n = seed % FontImageProvider.fontNames.length;
		var font = FontImageProvider.fontNames[n];
		seed = (seed-n)/FontImageProvider.fontNames.length;

		n = seed % FontImageProvider.details.length;
		var detail = FontImageProvider.details[n];
		seed = (seed-n)/FontImageProvider.details.length;

		n = seed % FontImageProvider.upperGlyphs.length;
		var upper = FontImageProvider.upperGlyphs[n];
		seed = (seed-n)/FontImageProvider.upperGlyphs.length;

		n = seed % FontImageProvider.lowerGlyphs.length;
		var lower = FontImageProvider.lowerGlyphs[n];
		seed = (seed-n)/FontImageProvider.lowerGlyphs.length;

		var text = detail;
		if (detail === "randomTwoGlyphs") {
			text = upper + lower;
		}
		else if (detail === "randomUpperGlyph") {
			text = upper;
		}
		else if (detail === "randomLowerGlyph") {
			text = lower;
		}
		return {
			font, text,	detail
		};
	}
	
	static createRandomImage(canvas, size, seed) {
		var { font, text, detail } = FontImageProvider.createRandomFeatures(seed);

		var fontSize = 0.55;
		var x = 0;
		var y = 0;
		if (detail === "randomglyph") {
			fontSize = 0.85;
		}
		else if (detail === "g") {
			fontSize = 2.5;
		}
		else if (detail === "m") {
			fontSize = 1.6;
			x = -0.2;
			y = 0.1;
		}
		else if (detail === "Q") {
			fontSize = 1.9;
			x = 0.15;
			y = -0.15;
		}
		else if (detail === "J") {
			fontSize = 1.65;
			x = -0.05;
			y = -0.12;
		}
		else if (detail === "O") {
			fontSize = 1.3;
			x = 0.0;
			y = 0.4;
		}
		else if (detail === "T") {
			fontSize = 1.55;
			x = 0.0;
			y = 0.4;
		}
		else if (detail === "P" || detail === "k") {
			fontSize = 2.6;
			x = -0.14;
			y = 0.2;
		}
		else if (detail === "d") {
			fontSize = 2.8;
			x = 0.13;
			y = 0.55;
		}
		else if (detail === "A") {
			fontSize = 2.6;
			if (font === "Bauhaus") {
				fontSize = 1.8;
			}
			x = 0;
			y = 0.5;
		}

		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.font = (size*fontSize).toFixed(4) + "px " + "'" + font + "'";
		ctx.fillStyle = "#000";
		ctx.textBaseline = 'alphabetic';
		var { width } = ctx.measureText(text);
		if (x.width > size) {
			console.log(font);
		}
		ctx.fillText(text, (size-width)/2 - size*fontSize*x, 3*size/4 + size*fontSize*y);
		ctx.restore();
	}
}