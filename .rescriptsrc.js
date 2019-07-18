const path = require('path')
const { removeWebpackPlugin } = require('@rescripts/utilities')

module.exports = config => {
	// modify webpack config for sunburst cdn
	config.entry = './src/index-sunburst.js'

	config.output = {
		// ...config.output,
		path: path.resolve(__dirname, 'build-sunburst'),
		filename: 'index.js',
		library: 'sunburst',
		libraryTarget: 'umd',
	}

	config.devtool = false

	// config.optimization = { minimize: false }
	delete config.optimization.splitChunks
	delete config.optimization.runtimeChunk

	let removedPlugins = config
	removedPlugins = removeWebpackPlugin('HtmlWebpackPlugin', removedPlugins) // don't copy html from public
	removedPlugins = removeWebpackPlugin('MiniCssExtractPlugin', removedPlugins) // no css
	removedPlugins = removeWebpackPlugin('GenerateSW', removedPlugins) // no service worker
	removedPlugins = removeWebpackPlugin('ManifestPlugin', removedPlugins) // no manifest file

	// console.log(config.plugins.find(item => item === 'GenerateSW'))
	// console.log(removedPlugins)

	return removedPlugins
}
