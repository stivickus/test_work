var webpack = require('webpack');
var path    = require('path');
var util    = require('gulp-util');
var config  = require('./gulp/config');

function createConfig(env) {
	var isProduction, webpackConfig;

	if (env === undefined) {
		env = process.env.NODE_ENV;
	}

	isProduction = env === 'production';

	webpackConfig = {
		context: path.join(__dirname, config.src.js),
		entry: {
			app: './app.js'
		},
		resolve: {
			modulesDirectories: ["node_modules"],
			extensions: ["", ".js"]
		},
		resolveLoader: {
			modulesDirectories: ["node_modules"],
			moduleTemplates: ["*-loader", "*"],
			extensions: ["", ".js"]
		},
		output: {
			path: path.join(__dirname, config.dest.js),
			filename: '[name].js',
			publicPath: 'js/'
		},
		devtool: isProduction
			? '#source-map'
			: '#cheap-module-eval-source-map',
		plugins: [
			new webpack.optimize.DedupePlugin(),
			new webpack.NoErrorsPlugin(),
		],
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel',
					query: {
						presets: ['es2015', 'stage-0']
					}
				}
			]
		}
	};

	if (isProduction) {
		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					drop_console: true
				}
			})
		);
	}

	return webpackConfig;
}

module.exports = createConfig();
module.exports.createConfig = createConfig;
