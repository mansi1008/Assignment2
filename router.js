/*
	Name: Mansi Mehindru
	Student ID: 301108725
	Date: 2020-10-26
*/

const { MongoClient, ObjectId } = require('mongodb');
var mongo = require('mongodb').MongoClient;
var mongoUrl = "mongodb+srv://mansi:bliss@assignments.eva7o.mongodb.net/";

var express = require('express');
var router = express.Router();
var myname="Mansi Mehindru";

//Middleware to check for login
function authCheck(req,res,next){
    if (req.session.user) {
        next();
    }
    else res.redirect('/login');
}

router.get('/', function(req, res) {
    res.render('pages/index',{page_title:`${myname} - Web Developer`});
});

router.get('/services', function(req, res) {
    res.render('pages/services',{page_title:`${myname} - Services`});
});

router.get('/projects', function(req, res) {
    res.render('pages/projects',{page_title:`${myname} - Projects`});
});

router.get('/aboutme', function(req, res) {
    res.render('pages/aboutme',{page_title:`${myname} - About Me`});
});

router.get('/register', function(req, res) {
        res.render('pages/register',{page_title:`${myname} - Register`, auth_status:(req.query.auth_status)?req.query.auth_status:""});
});

router.get('/contact', function(req, res) {
    res.render('pages/contact',{page_title:`${myname} - Contact`});
});

//Update contact using id in the url
router.get('/update/:id', authCheck,function(req, res) {

    var _id=req.params.id;
    var name=req.query.name;
    var number=req.query.number;
    var email=req.query.email;

    async function handleUpdate(){
        if(name || number || email){
            await MongoClient.connect(mongoUrl, function(err,db){
                dbo=db.db("assignments");

                if(name)
                    dbo.collection("contact_list").findOneAndUpdate({"_id": ObjectId(_id)}, {
                        $set:{name:name}
                    });

                if(number)
                    dbo.collection("contact_list").findOneAndUpdate({"_id": ObjectId(_id)}, {
                        $set:{number:number}
                });

                if(email)
                    dbo.collection("contact_list").findOneAndUpdate({"_id": ObjectId(_id)}, {
                        $set:{email:email}
                });
            });
            return res.redirect('/admin');
        }
    }

    handleUpdate();

    res.render('pages/update',{page_title:`${myname} - Update Contact`});
});

//This function deletes a contact with a given ID
router.get('/delete/:id', authCheck, function(req, res) {
    var _id=req.params.id;

    MongoClient.connect(mongoUrl, function(err,db){
        dbo=db.db("assignments");
        dbo.collection("contact_list").deleteOne({"_id": ObjectId(_id)});
        res.redirect('/admin');
    });
});

//Available only to logged in users, gives access to contact list
router.get('/admin', authCheck, function(req, res) {
    var contact_list=[];
    MongoClient.connect(mongoUrl, function(err,db){
        dbo=db.db("assignments");
        dbo.collection("contact_list").find().toArray(function(err,results){
            for(let i=0;i<results.length;i++){
                contact_list.push(results[i]);
            }

            console.log(contact_list);
            res.render('pages/admin',{page_title:`${myname} - Manage Contacts`, contact_list:contact_list});
        });
    });
});

router.get('/login', function(req, res) {
    res.render('pages/login',{page_title:`${myname} - Login`, auth_status:(req.query.status)?req.query.status:""});
});

router.get('/logout',function(req,res){
    req.session.user=null;
    res.redirect('/login');
});

//Handing login and send back response if credentials are incorrect
router.get('/login/auth',function(req,res){
    var username=req.query.username;
    var password=req.query.password;
    var isLoggedIn=null;

    MongoClient.connect(mongoUrl, function(err,db){
        dbo=db.db("assignments");
        dbo.collection("user_accounts").find({}).toArray(function(err,results){
            for(let i=0;i<results.length;i++)
                if(username==results[i].username && password==results[i].password)
                    isLoggedIn=true;

            if(isLoggedIn){
                req.session.user=username;
                console.log("Logged in as "+username);
                res.redirect('/admin');
            }
            else res.redirect('/login?status=Invalid Credentials');
        });
    });
});

module.exports = router;