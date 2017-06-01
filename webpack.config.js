module.exports = {
	entry: './js/rezumeWrapper.js',
	output: {
		filename: './dist/rezume.js'
	},
	module:{
		loaders: [
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: [ 'es2015' ]
				}
			}
		]
	}
};
