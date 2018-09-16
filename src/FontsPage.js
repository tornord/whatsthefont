import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import seedrandom from "seedrandom";
import lorumipsum from "./lorumipsum.json";
import { FontImageProvider } from "./FontImageProvider";
import qs from "qs";

// References
// https://www.lifehack.org/428846/top-20-most-popular-fonts-of-all-time
// https://www.lifewire.com/double-storey-a-in-typography-1074913
// http://mentalfloss.com/article/53569/11-vocabulary-words-typography-nerds
// http://www.identifont.com/unusuals?0
// https://medium.com/@eugenesadko/guide-to-10-font-characteristics-and-their-use-in-design-b0a07cc66f7
// https://www.webtype.com/info/articles/fonts-weights/
// https://creativepro.com/typetalk-italic-vs-oblique/

export class FontsPage extends React.Component {
	static propTypes = {
		location: PropTypes.object
	}

	static randomFontText(seed, text) {
		var nf = seed % FontImageProvider.fontNames.length;
		var font = FontImageProvider.fontNames[nf];
		var rng = seedrandom((seed-nf)/FontImageProvider.fontNames.length);
		if (!text) {
			let rndtext = FontImageProvider.randomItem(lorumipsum.strings, rng);
			let m = 12;
			let n = FontImageProvider.randomInt(rng, rndtext.length-m);
			text = rndtext.slice(n, n+m).trim().replace(/^[A-Za-z]?[.,]? /, "").replace(/[.,;-]/g, "");
		}
		return <div className="row">
				<div className="col-12">
					<Link to={"/images?font=" + font} >
						<p className="fontname">{ font }</p>
						<p><span style={{ fontFamily: font }} className={ "fontexample" }>{ text }</span></p>
					</Link>
				</div>
			</div>;
	}

	render() {
        var queryArgs = qs.parse(this.props.location.search.substring(1));
		var seed = new Date().getTime();
		var rng = seedrandom(seed);
		return <Fragment>
			{ [...Array(FontImageProvider.fontNames.length)].map((d,i) => <div key={i}>{ FontsPage.randomFontText(FontImageProvider.fontNames.length*Math.floor(1e7*rng())+i, queryArgs.text) }</div>) }
		</Fragment>;
	}
}
