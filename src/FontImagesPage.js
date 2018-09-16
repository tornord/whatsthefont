import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import { FontImageProvider } from "./FontImageProvider";
import { FontImageCanvas } from "./FontImageCanvas";
import seedrandom from "seedrandom";
import qs from "qs";

export class FontImagesPage extends React.Component {
	static propTypes = {
		location: PropTypes.object
	}

    componentDidMount() {
	}
	
	randomIndices(fontIndex, detailIndex, upperIndex, lowerIndex, rng) {
		return {
			font: fontIndex >= 0 ? fontIndex : Math.floor(FontImageProvider.fontNames.length*rng()),
			detail: detailIndex >= 0 ? detailIndex : Math.floor(FontImageProvider.fontNames.length*rng()),
			upper: upperIndex >= 0 ? upperIndex : Math.floor(FontImageProvider.upperGlyphs.length*rng()),
			lower: lowerIndex >= 0 ? lowerIndex : Math.floor(FontImageProvider.lowerGlyphs.length*rng())
		}
	}

	render() {
        var queryArgs = qs.parse(this.props.location.search.substring(1));
		var seed = queryArgs.seed ? Number(queryArgs.seed) : new Date().getTime();
		var rng = seedrandom(seed);
		var size = 100;
		var fontIndex = queryArgs.font ? FontImageProvider.fontNames.findIndex(d=>d===queryArgs.font) : -1;
		var detailIndex = queryArgs.detail ? FontImageProvider.details.findIndex(d=>d===queryArgs.detail) : -1;
		var upperIndex = queryArgs.upper ? FontImageProvider.upperGlyphs.indexOf(queryArgs.upper) : -1;
		var lowerIndex = queryArgs.lower ? FontImageProvider.lowerGlyphs.indexOf(queryArgs.lower) : -1;
		var seeds = [];
		if (queryArgs.detail === 'randomTwoGlyphs' || queryArgs.detail === 'randomUpperGlyph' || queryArgs.detail === 'randomLowerGlyph' || (detailIndex === -1 && lowerIndex === -1 && upperIndex === -1)) {
			for (let i=0; i < 1000; i++) {
				var idx = this.randomIndices(fontIndex, detailIndex, -1, -1, rng);
				seeds.push(FontImageProvider.calcSeed(idx.font, idx.detail, idx.upper, idx.lower));
			}
		}
		else  {
			if ((upperIndex >= 0) && (lowerIndex >= 0)) {
				detailIndex = FontImageProvider.details.findIndex(d=>d==="randomTwoGlyphs");
			}
			else if (upperIndex >= 0) {
				detailIndex = FontImageProvider.details.findIndex(d=>d==="randomUpperGlyph");
			}
			else if (lowerIndex >= 0) {
				detailIndex = FontImageProvider.details.findIndex(d=>d==="randomLowerGlyph");
			}
			for (let i=0; i < FontImageProvider.fontNames.length; i++) {
				var idx = this.randomIndices(i, detailIndex, upperIndex, lowerIndex, rng);
				seeds.push(FontImageProvider.calcSeed(idx.font, idx.detail, idx.upper, idx.lower));
			}
		}
		return <div className="row">
			<div className="col-12">
				{ seeds.map((d,i)=> <FontImageCanvas key={i} width={ size } height={ size } seed={ d } ></FontImageCanvas> ) }
			</div>
		</div>;
	}
}