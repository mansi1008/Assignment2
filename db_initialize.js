const { MongoClient } = require('mongodb');

var mongo = require('mongodb').MongoClient;
var url = "mongodb+srv://mansi:bliss@assignments.eva7o.mongodb.net/";

MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo=db.db("assignments");
	
	var myobj1={
		name:"Mansi Mehindru",
		email:"mansimehindru9002@gmail.com",
		phone:4377233244,
		address:"Brampton,ON"
	};
	
    var myobj2 = [
		{name:"Kriti",   number:"1251364525",email:"kriti@example.com"},
    {name:"David",number:"5236234124",email:"david@hotmail.com"},
    {name:"Felix",   number:"4124125677",email:"felix@gmail.com"},
    {name:"Mohit",number:"9986456345",email:"mohit@hotmail.com"},
    {name:"Arshpreet",   number:"3474834635",email:"arshpreet@gmail.com"}
	];
	
		dbo.collection("user_accounts").insert(myobj1, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
      });
		
      dbo.collection("contact_list").insert(myobj2, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
      });
});