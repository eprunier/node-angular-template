'use strict';

angular.module('app', [
	'ui.router',
	'mainController',
	'accountController',
	'authService'
]).config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});