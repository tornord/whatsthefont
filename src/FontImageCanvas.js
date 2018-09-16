import React, { Component } from 'react';
import PropTypes from "prop-types";
import FontFaceObserver from "fontfaceobserver";
import { FontImageCreator } from "./FontImageCreator";

var format = (v, size, decimals) => {
    return v.toFixed(decimals, 10).padStart(size);
}

class CanvasHelper {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    rectangle(x, y, width, height, color) { 
        this.ctx.fillStyle = color; 
        this.ctx.fillRect(x, y, width, height); 
    }

    fill(color) {
        this.rectangle(0, 0, this.canvas.width, this.canvas.height, color);
    }

    line(x1, y1, x2, y2, width, color) { 
        this.ctx.strokeStyle = color; 
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    circle(x, y, radius, color) {
        this.ctx.fillStyle = color; 
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2*Math.PI);         
        this.ctx.closePath();
        this.ctx.fill();
    }

    text(x, y, size, text, color) {
        this.ctx.fillStyle = color; 
        this.ctx.font = size + 'px Monospace';
        this.ctx.fillText(text, x, y);
    }
}

export class FontImageCanvas extends Component {
    static propTypes = {
		seed: PropTypes.number.isRequired, 
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired
    };
    
    componentDidMount() {
        var { font } = FontImageCreator.calcFeatures(this.props.seed);
        var fontobs = new FontFaceObserver(font);
        fontobs.load().then(() => { this.draw(); });
    }

    draw() {
        var canvas = this.canvasRef;
        if (!canvas) {
            return;
		}
		canvas.width = this.props.width;
		canvas.height = this.props.height;
        var ch = new CanvasHelper(canvas);
        var ctx = canvas.getContext('2d');

        ctx.save();
        ch.fill("#fff");
        FontImageCreator.createRandomImage(canvas, this.props.width, this.props.seed);
        ctx.restore();
    }

    render() {
        var { font, text } = FontImageCreator.calcFeatures(this.props.seed);
        return <canvas className="fontimage" name={this.props.seed} title={font + " - " + text} ref={ (e) => { this.canvasRef = e; } } ></canvas>;
    }
}