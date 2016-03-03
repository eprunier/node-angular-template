'use strict';

angular.module('authService', [])
	.factory('Auth', AuthFactory)
	.factory('AuthToken', AuthTokenFactory)
	.factory('AuthInterceptor', AuthInterceptorFactory);

/**
 * Create Auth factory.
 *
 * @param  object $http Angular $http service
 * @param  object $q    Angular $q promise service
 * @return object       Auth factory
 */
function AuthFactory($http, $q, AuthToken) {
	var authFactory = {};

	// Get current user.
	authFactory.getUser = function () {
		return $http.get('/api/me', {cache: true}).then(function (response) {
			return $q.resolve(response.data.token);
		});
	};

	// Login.
	authFactory.login = function (email, password) {
		return $http.post('/authenticate', {
			email: email,
			password: password
		}).then(function (response) {
			AuthToken.setToken(response.data.token);
		});
	};

	// Logout.
	authFactory.logout = function () {
		AuthToken.setToken();
	};

	// Test if there is a logged in user.
	authFactory.isLoggedIn = function () {
		if (AuthToken.getToken()) {
			return true;
		} else {
			return false;
		}
	};

	// Create a user.
	authFactory.createUser = function (userData) {
		return $http.post('/api/users', userData);
	};

	// Update user.
	authFactory.updateUser = function (userId, userData) {
		return $http.put('/api/users/' + userId, userData);
	};

	return authFactory;
}


/**
 * Create AuthToken factory.
 *
 * @param  object $window Angular $window service
 * @return object         AuthToken factory
 */
function AuthTokenFactory($window) {
	var authTokenFactory = {};

	// getToken.
	authTokenFactory.getToken = function () {
		return $window.localStorage.getItem('authToken');
	};

	// setToken.
	authTokenFactory.setToken = function (token) {
		if (token) {
			$window.localStorage.setItem('authToken', token);
		} else {
			$window.localStorage.removeItem('authToken');
		}
	};

	return authTokenFactory;
}


/**
 * Create AuthInterceptor factory.
 *
 * @param  object $q        Angular $q promise service
 * @param  object $location Angular $location service
 * @return object           AuthInterceptor factory
 */
function AuthInterceptorFactory($q, $location, AuthToken) {
	var authInterceptorFactory = {};

	// Add token in 'authorization' request header when calling backend API.
	authInterceptorFactory.request = function (config) {
		var token = AuthToken.getToken();
		if (token) {
			config.headers.authorization = 'Bearer ' + token;
		}

		return config;
	};

	// Process backend error response.
	authInterceptorFactory.responseError = function (response) {
		if (response.status === 403) {
			AuthToken.setToken();
			$location.path('/login');
		}

		return $q.reject(response);
	};

	return authInterceptorFactory;
}
