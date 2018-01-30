'use strict';

let config = require('../app/core/config');
const utils = require('./utils');
const globby = require('globby');

module.exports = (gulp, plugins) => {
	return () => {
		const browserSync = utils.getBrowserSyncInstance();
		const isDependentStyleSource = (file) => {
			let isDependent = false;
			const cssAssets = utils.getSourcePatterns('css');
			cssAssets.forEach((asset) => {
				globby.sync(asset.deps).forEach((path) => {
					if ( file.replace(/\\/g, '/').endsWith(path) ) {
						isDependent = true;
					}
				});
			});

			return isDependent;
		};
		const clearCache = (e) => {
			if (
				'unlink' === e.event ||
				'add' === e.event ||
				e.path.endsWith('config.json') ||
				isDependentStyleSource(e.path)
			) {
				// forget all
				plugins.cached.caches = {};
				const cssAssets = utils.getSourcePatterns('css');
				cssAssets.forEach((asset) => {
					if (plugins.remember.cacheFor(asset.name)) {
						plugins.remember.forgetAll(asset.name);
					}
				});
				const jsAssets = utils.getSourcePatterns('js');
				jsAssets.forEach((asset) => {
					if (plugins.remember.cacheFor(asset.name)) {
						plugins.remember.forgetAll(asset.name);
					}
				});
			}
		};

		plugins.watch([
			'config.json'
		], (e) => {
			config = utils.reloadConfig();
			clearCache(e);
			utils.updateSourcePatterns();
			gulp.start('compile-css');
			gulp.start('compile-js');
		});

		plugins.watch([
			'assets/css/**/*.scss',
			'patterns/**/css/**/*.scss'
		], (e) => {
			clearCache(e);
			gulp.start('compile-css');
		});

		plugins.watch([
			'assets/js/**/*.js',
			'patterns/**/js/**/*.js'
		], () => {
			gulp.start('compile-js');
		});

		plugins.watch([
			'views/**/*.' + config.nitro.view_file_extension,
			config.nitro.view_data_directory + '/**/*.json',
			'patterns/**/*.' + config.nitro.view_file_extension,
			'patterns/**/_data/*.json'
		], () => {
			browserSync.reload();
		});

		plugins.watch([
			'assets/img/**/*'
		], () => {
			gulp.start('minify-img');
		});

		plugins.watch([
			'assets/font/**/*'
		], () => {
			gulp.start('copy-assets');
		});
	};
};
