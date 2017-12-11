(function(){
	document.addEventListener('DOMContentLoaded', () => {
		fetch('/api/poops').then(r => {
			if(r.status !== 200) return;

			r.json().then(data => {
				const tBody = document.getElementById('data');
				data.forEach(d => {
					let tr = document.createElement('tr');

					let date = document.createElement('td');
					date.innerHTML = Date(parseInt(date));

					let packLeader = document.createElement('td');
					packLeader.innerHTML = d.packLeader;

					let poop = document.createElement('td');
					poop.innerHTML = d.poop;

					let pee = document.createElement('td');
					pee.innerHTML = d.pee;

					let remove = document.createElement('td');
					remove.innerHTML = "x";

					tr.appendChild(date);
					tr.appendChild(packLeader);
					tr.appendChild(poop);
					tr.appendChild(pee);
					tr.appendChild(remove);

					tBody.appendChild(tr);
				});
			});
		});
	})
})();
