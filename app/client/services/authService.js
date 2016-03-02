'use strict';

angular.module('authService', [])
	.factory('AuthToken', AuthTokenFactory)
	.factory('Auth', AuthFactory)
	.factory('AuthInterceptor', AuthInterceptorFactory);

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
 * Create Auth factory.
 *
 * @param  object $http Angular $http service
 * @param  object $q    Angular $q promise service
 * @return object       Auth factory
 */
function AuthFactory($http, $q, AuthToken) {
	var authFactory = {};

	// Login.
	authFactory.login = function (email, password) {
		return $http.post('/authenticate', {
			email: email,
			password: password
		}).success(function (data) {
			AuthToken.setToken(data.token);
			return data;
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

	// Get current user.
	authFactory.getUser = function () {
		if (AuthToken.getToken()) {
			return $http.get('/api/me');
		} else {
			return $q.reject({message: 'No authenticated user'});
		}
	};

	return authFactory;
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
