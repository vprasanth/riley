(function(){
	'use strict';
	let headers = new Headers();
	headers.append('Authorization', 'Basic ' + window.btoa('admin' + ":" + 'birddog47'));

	$(() => {
		fetch('/api/poops', {headers: headers}).then(r => {
			if(r.status !== 200) return;

			r.json().then(data => {
				const tBody = document.getElementById('data');
				// r('#summary').text = `Last time ${new Date(data[0].date).toLocaleString()}`;
				data.forEach(d => {
					// console.log(d);

					let tr = document.createElement('tr');

					let date = document.createElement('td');
					date.innerHTML = new Date(d.date).toLocaleString();

					let packLeader = document.createElement('td');
					packLeader.innerHTML = d.packLeader;

					let poop = document.createElement('td');
					poop.innerHTML = d.did.poop;

					let pee = document.createElement('td');
					pee.innerHTML = d.did.pee;

					// let remove = document.createElement('td');
					// remove.innerHTML = "x";

					tr.appendChild(date);
					tr.appendChild(packLeader);
					tr.appendChild(poop);
					tr.appendChild(pee);
					// tr.appendChild(remove);

					tBody.appendChild(tr);
				});
			});
		});
	})
})();
