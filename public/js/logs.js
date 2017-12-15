(function(){
	'use strict';
	let headers = new Headers();
	let endpoint = '/api/poops';
	headers.append('Authorization', 'Basic ' + window.btoa('admin' + ":" + 'birddog47'));

	$(() => {
		setupHistory();
	})

	function setupHistory() {
		fetch(endpoint, {headers: headers}).then(r => {
			if(r.status !== 200) return;

			r.json().then(data => {
				const tBody = document.getElementById('data');
				// r('#summary').text = `Last time ${new Date(data[0].date).toLocaleString()}`;
				if (data.length) {
					data.forEach(d => {
						console.log(d);
						let tr = document.createElement('tr');
						tr.setAttribute('id', d._id);

						let date = document.createElement('td');
						date.innerHTML = new Date(d.date).toLocaleString();

						let packLeader = document.createElement('td');
						packLeader.innerHTML = d.packLeader;

						let poop = document.createElement('td');
						poop.innerHTML = d.did.poop;

						let pee = document.createElement('td');
						pee.innerHTML = d.did.pee;

						let remove = document.createElement('td');
						let removeButton = document.createElement('button');
						let deleteIcon = document.createElement('i');
						removeButton.className = "btn btn-outline-danger";
						removeButton.setAttribute('style', 'width:100%;');
						removeButton.onclick = deleteRecord(d._id);

						deleteIcon.setAttribute('data-feather', 'trash-2');

						removeButton.appendChild(deleteIcon);
						remove.appendChild(removeButton);

						tr.appendChild(date);
						tr.appendChild(packLeader);
						tr.appendChild(poop);
						tr.appendChild(pee);
						tr.appendChild(remove);

						tBody.appendChild(tr);
					});
					// load icons
					feather.replace();
				}
			});
		});
	}

	function deleteRecord(id) {
		return function() {
			console.log(id);
			let doDelete = confirm('Do you really want to delete this?');
			if (doDelete) {
				fetch(`api/poop/${id}`, {headers: headers, method: 'delete'}).then(r => {
					console.log('good');
					window.location.reload(true);
				}).catch(err => {
					alert('Could not delete -- call Prasanth');
				});
			}
		};

	}
})();
