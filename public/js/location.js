(function(){
	'use strict'

	$(() => {
		if (navigator.geolocation) {
			console.log('location services available');
			navigator.geolocation.getCurrentPosition(setLocation);
		} else {
			console.log('no location services available');
		}

	});

	function setLocation(position) {
		console.log('got', position);
		$('#lat').val(position.coords.latitude);
		$('#long').val(position.coords.longitude);
	}

})();
