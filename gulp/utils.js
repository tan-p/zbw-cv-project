'use strict';

let config = require('../app/core/config');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
let browserSync;
let assets = {};

function getBrowserCompatibility() {
	return config.code.compatibility.browsers;
}

function getBrowserSyncInstance() {
	const name = 'Nitro' + config.server.port;
	if (!browserSync) {
		browserSync = require('browser-sync').create(name);
	}
	return browserSync;
}

function getSourcePatterns(ext) {
	const type = typeof ext === 'string' && ( ext === 'js' || ext === 'css' ) ? ext : null;

	if (!assets.hasOwnProperty('js') || !assets.hasOwnProperty('css')) {
		updateSourcePatterns();
	}

	return type ? assets[type] : assets;
}

function updateSourcePatterns() {
	let key, ext, type, asset, result, patternKey, patternPath;

	assets = {
		css: [],
		js: []
	};

	for (key in config.assets) {
		if (config.assets.hasOwnProperty(key)) {
			ext = path.extname(key);
			if (ext) {
				type = ext.replace(/[^a-z]/g, '');
				asset = config.assets[key];
				result = {
					name: key,
					deps: [],
					src: []
				};

				for (patternKey in asset) {
					if (asset.hasOwnProperty(patternKey)) {
						patternPath = asset[patternKey];
						if (patternPath.indexOf('+') === 0) {
							result.deps.push(patternPath.substr(1));
						}
						else {
							result.src.push(patternPath);
						}
					}
				}
				assets[type].push(result);
			}
		}
	}
}

function getTask(task) {
	return require('./' + task)(gulp, plugins);
}

function reloadConfig() {
	config = config.reload();
	return config;
}



function fileExistsSync(filename) {
	// Substitution for the deprecated fs.existsSync() method @see https://nodejs.org/api/fs.html#fs_fs_existssync_path
	try {
		fs.accessSync(filename);
		return true;
	}
	catch (ex) {
		return false;
	}
}

module.exports = {
	fileExistsSync,
	getBrowserCompatibility,
	getBrowserSyncInstance,
	getSourcePatterns,
	getTask,
	reloadConfig,
	updateSourcePatterns
};
