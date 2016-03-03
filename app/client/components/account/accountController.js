'use strict';

angular.module('accountController', [])
	.controller('AccountController', function (Auth) {
		var vm = this;

		Auth.getUser().then(function (user) {
			vm.updateData = _.pick(user, ['email', 'username']);
			vm.userId = user.id;
		});

		vm.updateAccount = function () {
			Auth.updateUser(vm.userId, vm.updateData);
		};
	});