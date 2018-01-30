'use strict';

const Karma = require('karma').Server;
const path = require('path');

module.exports = (gulp, plugins) => {
	return (done) => {
		new Karma({
			configFile: path.join(__dirname, '..', 'karma.conf.js'),
			singleRun: true,
			autoWatch: false
		}, done).start();
	};
};

