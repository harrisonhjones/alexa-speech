'use strict';

function Speech() {
	this.parts = [];
}

function formatAttribute(option){
	return option ? `option="${option}"`:``;
}

function formatAttributes(options){
	let output = "";
	for(var option in options){
		console.log(option);
		output += option ? `${option}="${options[option]}"`:``;
		// output += "a";
	}
	return output;
}

Speech.prototype.render = function() {
	var output = '<speak>';

	for (var i = 0; i < this.parts.length; i++) {
		output += this.parts[i]();
	}

	output += '</speak>';
	return output;
}

Speech.prototype.add = function(text) {
	this.parts.push(function() { return text; });
	return this;
}

Speech.prototype.prosody = function(options) {
	let last = `<prosody ${formatAttributes(options)}> ${this.parts.pop()()} </prosody>`
	// console.log(this.parts)
	this.parts.push(function() { return last });
	return this;
}

Speech.prototype.emphasis = function(options) {
	let last = `<emphasis ${formatAttributes(options)}> ${this.parts.pop()()} </emphasis>`;
	this.parts.push(function() { return last });

	// this.parts.push(function() { return text; });
	return this;
}

Speech.prototype.sub = function(options) {
	let last = `<sub ${formatAttributes(options)}> ${this.parts.pop()()} </sub>`;
	this.parts.push(function() { return last });

	// this.parts.push(function() { return text; });
	return this;
}

Speech.prototype.w = function(options) {
	let last = `<w ${formatAttributes(options)}> ${this.parts.pop()()} </w>`;
	this.parts.push(function() { return last });
	return this;
}

Speech.prototype.p = function() {
	let last = `<p> ${this.parts.pop()()} </p>`;
	this.parts.push(function() { return last });
	return this;
}

Speech.prototype.audio = function(options) {
	let last = `<audio ${formatAttributes(options)} />`;
	this.parts.push(function() { return last });
	return this;
}

Speech.prototype.break = function(options) {
	let last = `<audio ${formatAttributes(options)} />`;
	this.parts.push(function() { return last });
	return this;
}

Speech.prototype.phoneme = function(options) {
	let last = `<phoneme ${formatAttributes(options)}> ${this.parts.pop()()} </phoneme>`;
	this.parts.push(function() { return last });
	return this;
}

Speech.prototype.pause = function(length) {
	// TODO support sec and ms
	this.parts.push(function() { return '<break time="' + length + 's"/>'; });
	return this;
}

Speech.prototype.spell = function(text) {
	this.parts.push(function() { return '<say-as interpret-as="spell-out">' + text + '</say-as>'; });
	return this;
}

Speech.prototype.cardinal = function(number) {
	this.parts.push(function() { return '<say-as interpret-as="cardinal">' + number + '</say-as>'; });
	return this;
}

Speech.prototype.ordinal = function(number) {
	this.parts.push(function() { return '<say-as interpret-as="ordinal">' + number + '</say-as>'; });
	return this;
}

Speech.prototype.digits = function(number) {
	this.parts.push(function() { return '<say-as interpret-as="digits">' + number + '</say-as>'; });
	return this;
}

Speech.prototype.approximateFactor = function(number) {
	var map = [ 1000000000000, 'trillion',
				1000000000,	   'billion',
				1000000, 	   'million',
				1000, 		   'thousand'
			  ];

    var approx;
    var label;
	for (var i = 0; i < map.length; i += 2) {
		if (number > map[i]) {
			approx = (number / map[i]).toFixed(1);
			label = map[i+1];
			break;
		}
	}

	this.parts.push(function() {
		var speech = '<say-as interpret-as="ordinal">';
		if (approx && label) {
			speech += approx + '</say-as> ' + label;
		} else {
			speech += number + '</say-as>';
		}

		return speech;
	});

	return this;
}

Speech.prototype.fraction = function(number) {
	this.parts.push(function() { return '<say-as interpret-as="fraction">' + number + '</say-as>'; });
	return this;
}

Speech.prototype.percent = function(number, precision) {
	var number = precision === undefined ? number : number.toFixed(precision);
	this.parts.push(function() { return '<say-as interpret-as="ordinal">' + number + '</say-as> percent'; });
	return this;
}

Speech.prototype.telephone = function(number) {
	this.parts.push(function() { return '<say-as interpret-as="telephone">' + number + '</say-as>'; });
	return this;
}

Speech.prototype.address = function(address) {
	this.parts.push(function() { return '<say-as interpret-as="address">' + address + '</say-as>'; });
	return this;
}

Speech.prototype.date = function(date) {
	this.parts.push(function() { return '<say-as interpret-as="date">' + date + '</say-as>'; });
	return this;
}

Speech.prototype.time = function(time) {
	this.parts.push(function() { return '<say-as interpret-as="time">' + time + '</say-as>'; });
	return this;
}

Speech.prototype.price = function(amount) {
	var whole = Math.floor(amount);
	var fract = ((amount.toFixed(3) - whole) * 100).toFixed(0);

	this.parts.push(function() {
		var response = '<say-as interpret-as="cardinal">' + whole + '</say-as> dollars';
		if (fract > 0) {
			response += ' and <say-as interpret-as="cardinal">' + fract + '</say-as> cents';
		}
		return response;
	});
	return this;
}

exports.Speech = Speech;
