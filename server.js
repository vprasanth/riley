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
	console.log(req.body);
	const poopData = {
		did: processDid(req.body.did),
		packLeader: req.body.packleader,
		date: new Date(),
		location: {lat: req.body.lat, long: req.body.long}
	};

	insert(colName, poopData)
	.then(r => {
		res.redirect('/logs.html');
	})
	.catch(e => {
		console.log(e);
		res.send('somthing bad happenz');
	});

});

function myMiddleware(req, res, next) {
	console.log('comming through!');
	if (!req.signedCookies.user) {
		res.cookie('user', 'admin', {signed: true});
		res.cookie('password', 'birddog47', {signed: true});
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

app.get('/api/poops', (req, res) => {
	getAllFrom(colName, [['date', 'descending']])
	.then(r => {
		res.send(r);
	})
	.catch(e => {
		res.send('there was an errr');
		console.log(e);
	})
});


async function connect() {
	const url = 'mongodb://localhost:27017/riley';
	const dbName = 'poopytracker';
	let client;

	try {
		client = await MongoClient.connect(url);
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

