(function(){
	'use strict'

	$(() => {
		if (navigator.geolocation) {
			console.log('location services available');
			navigator.geolocation.getCurrentPosition(setLocation);
		} else {
			console.log('no location services available');
		}

		// set date and time to now
		let now = new Date();
		$('#time').val(`${now.toLocaleTimeString('en-US', {hour12: false}).substring(0,5)}`);
		$('#date').val(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`);
	});

	function setLocation(position) {
		console.log('got location', position);
		$('#lat').val(position.coords.latitude);
		$('#long').val(position.coords.longitude);
	}

})();
