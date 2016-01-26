var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 8080;
var mongo_url = 'mongodb://localhost:27017/test';

var insertData = function (data, db, callback) {
	//var key = data["name"];
	//db.collection('descriptions').insertOne ( {key:data}, function (err, result) {
	db.collection('descriptions').insertOne(data, function (err, result) {
		assert.equal(null, err);
		console.log("Data inserted");
		callback (result);
	});
};

var retrieveData = function (db, callback) {
	var cursor = db.collection('descriptions').find();
	var data = {};
	cursor.each(function (err, doc) {
		assert.equal(null, err);
		if (doc != null) {
			data[doc["_id"]] = doc;
		}
		else
			callback(data);
	});
};

io.on('connection', function (client) {
	client.on('submit', function (data) {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null, err);
			console.log('Connected to database');
			insertData(data, db, function() {
				db.close();
			});
		});
	});
	client.on('retrieve', function() {
		MongoClient.connect(mongo_url, function (err, db) {
			assert.equal(null, err);
			retrieveData(db, function (result) {
				client.emit('data_retrieved', result);
				db.close();
			});
		});
	});
});

server.listen(port);