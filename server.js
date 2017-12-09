const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb');
const app = express();

// connect to db
let db;
const colName = 'poops';
connect();

// static confis
app.use(express.static('public'));

// configure middleware
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/poop', (req, res) => {
	const poopData = {
		poop: req.body.poop === "on" ? true : false,
		pee: req.body.pee === "on" ? true : false,
		date: Date.now().toString()
	};

	insert(colName, poopData)
	.then(r => {
		res.send(r);
	})
	.catch(e => {
		console.log(e);
		res.send('somthing bad happenz');
	});
});

app.get('/api/poops', (req, res) => {
	getAllFrom(colName)
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

  async function getAllFrom(collection) {
  	try {
  		console.log(`getting all docs from ${collection}`);
  		let allDocs = await db.collection(collection).find().toArray();
  		console.log(`got`, allDocs);
  		return allDocs;
  	} catch (e) {
  		console.log(e);
  		return e;
  	}
  }
