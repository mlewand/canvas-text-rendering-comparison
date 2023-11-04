module.exports = function( config ) {
	config.set( {
		frameworks: [ 'mocha', 'chai' ],
		files: [
			// 'src/**/*.js',
			'js/common.js',
			'tests/**/*.js'
		],
		reporters: [ 'progress' ],
		port: 9876,  // karma web server port
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: [ 'ChromeHeadless', 'Firefox', 'Safari' ],
		concurrency: Infinity,
		customLaunchers: {
			// FirefoxHeadless: {
			// 	base: 'Firefox',
			// 	flags: [ '-headless' ],
			// },
		},
	} )
}