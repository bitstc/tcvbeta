'use strict';
angular.module('TCV1')
.service('UtilService', function UtilService($cordovaNetwork) {
	return {
		checkNetwork : function(callback) {
			var connectionType;
			if ($cordovaNetwork.isOnline() === true) {
	            connectionType = 'Online';
	        } else if ($cordovaNetwork.isOffline() === true) {
	            connectionType = 'Offline';
	        } else {
	            connectionType = 'Error getting isOffline / isOnline methods';
	        }
			callback({
				'networkType' : $cordovaNetwork.getNetwork(),
				'connectionType' : connectionType
			});	    
	    }
	}
});