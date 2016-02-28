var srcBasePath = 'app'
	, distBasePath = 'dist';

module.exports = exports = {
	src: {
		basePath: srcBasePath,
		client: srcBasePath + '/client',
		server: srcBasePath + '/server'
	},
	dist: {
		basePath: distBasePath,
		client: distBasePath + '/public',
		server: distBasePath + '/server'
	}
}
