const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const MongoClient = require('mongodb');
const app = express();

// connect to db
let db;
const colName = 'poops';
connect();

// shitty auth
app.use(helmet());
app.use(cookieParser('b74c1789-c2b3-49c5-9195-f25c96ab3094'));
app.use(myMiddleware);
app.use(basicAuth({
	challenge: true,
	realm: 'poopapp',
	users:{'admin': 'birddog47'}
}));

// static confis
app.use(compression());
app.use(express.static('public'));
app.use(express.static('node_modules'));

// configure middleware
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/poop', (req, res) => {
	// const date = req.body.date;
	// const time = req.body.time;
	// let now;

	// if (!date || !time) {
	// 	now = new Date();
	// } else {
	// 	now = new Date(Date.UTC(date.substring(0,4), +date.substring(5,7)-1, date.substring(8,10), time.substring(0,2), time.substring(3,5)));
	// 	console.log(now.toString());
	// }
	// console.log(req.body, date.substring(0,4), +date.substring(5,7)-1, date.substring(8,10), time.substring(0,2), time.substring(3,5));

	const poopData = {
		did: processDid(req.body.did),
		packLeader: req.body.packleader,
		date: new Date(),
		location: {lat: req.body.lat, long: req.body.long}
	};

	// res.send(poopData);

	insert(colName, poopData)
	.then(r => {
		res.redirect('/logs.html');
	})
	.catch(e => {
		console.log(e);
		res.send('somthing bad happenz');
	});

});

app.get('/api/poops', (req, res) => {
	getAllFrom(colName, [['date', 'descending']])
	.then(r => {
		res.send(r);
	})
	.catch(e => {
		res.status(400).send('there was an errr');
		console.log(e);
	})
});

app.delete('/api/poop/:id', (req, res) => {
	// console.log(req.params);
	deleteRecord(colName, req.params.id)
	.then(r => {
		console.log('done!');
		res.status(200).send(`Deleted ${req.params.id}!`);
	})
	.catch(e => {
		res.status(400).send('there was an errr');
		console.log(e);
	});
});

function myMiddleware(req, res, next) {
	console.log('comming through!');
	if (!req.signedCookies.user) {
		res.cookie('user', 'admin', {signed: true, secure: true});
		res.cookie('password', 'birddog47', {signed: true, secure: true});
	}
	next();
}

function processDid(did) {
	if (did === 'both') {
		return { poop: 'yes', pee: 'yes'};
	} else if (did === 'pee') {
		return { poop: 'no', pee: 'yes'};
	} else if (did === 'poo') {
		return { poop: 'yes', pee: 'no'};
	} else {
		return { poop: 'no', pee: 'no'};
	}
}

async function connect() {
	if (process.env.POOPDBSERVER) {
		console.log('using db env settings');
	} else {
		console.log('using default');
	}

	const url = process.env.POOPDBSERVER || 'mongodb://localhost:27017/riley';
	const dbName = process.env.POOPDBNAME || 'poopytracker';
	const dbOptions = {
		reconnectInterval: 10000 // 10 seconds
	};
	let client;

	try {
		client = await MongoClient.connect(url, dbOptions);
		db = client.db(dbName);
  		// start server
  		app.listen(3000, () => console.log('Poopy server running on 3000!'));
  	} catch (e) {
  		console.log(e.stack);
  	}
  }

  async function insert(collection, data) {
  	try {
  		console.log(`inserting ${data} in to ${collection}`);
  		let r = await db.collection(collection).insertOne(data);
  		return r;
  	} catch (e) {
  		console.log(e);
  		return e;
  	}
  }

  async function getAllFrom(collection, sort) {
  	try {
  		console.log(`getting all docs from ${collection}`);
  		let allDocs = await db.collection(collection).find({}, {sort: sort}).toArray();
  		console.log(`got`, allDocs);
  		return allDocs;
  	} catch (e) {
  		console.log(e);
  		return e;
  	}
  }

  async function deleteRecord(collection, id) {
  	try {
  		console.log(`deleting ${id} from ${collection}`);
  		let r = await db.collection(collection).deleteOne({_id: new MongoClient.ObjectID(id)});
  		return r;
  	} catch (e) {
  		console.log(e);
  		return e;
  	}
  }

