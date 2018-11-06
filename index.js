var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var mysql = require('mysql');
var app = express();
var session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('views'));
app.use(sessions({
    secret: '&^%*&*^&hgvdshvcjs',
    resave: false,
    saveUninitialized: true
}));

app.get('/', function(req, res) {
    res.sendFile('./files/login.html', {root: __dirname});
});

app.get('/login', function(req, res) {
    res.sendFile('./files/login.html', {root: __dirname});
});

app.post('/login', function(req, res) {
    session = req.session;
    if(req.body.username == 'user' && req.body.password == 'user') {
        session.uniqueID = req.body.username;
        res.sendFile('./files/neworder.html', {root: __dirname});
    } else {
        res.send('Wrong Username or Password! Please try again...');
    }
});

app.get('/admin', function(req, res) {
    session = req.session;
    res.sendFile('./files/admin.html', {root: __dirname});
});

app.post('/admin', function(req, res) {
    session = req.session;
    if(req.body.username == 'admin' && req.body.password == 'admin') {
        session.uniqueID = req.body.username;
        //res.sendFile('./files/login.html', {root: __dirname});
        res.redirect('/showorders');
    } else {
        res.send('Wrong Username or Password! Please try again...');
    }
});

app.get('/about', function(req, res) {
    session = req.session;
    res.sendFile('./files/about.html', {root: __dirname});
});

app.post('/neworder', function(req, res) {
    session = req.session;
    var cust_id = req.body.cid;
    var sale_id = req.body.sid;
    var prod_id = req.body.pid;
    var date = req.body.date;
    var quan = req.body.quantity;
    var amount = 0;

    var con = mysql.createConnection({
        host: "localhost",
        user: "yrj98",
        password: "Y@sh98R@j"
    });

    con.connect(function(err) {
        if (err) throw err;
        sql = "USE Project";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
        });

        sql = "SELECT Price FROM PRODUCT WHERE Prod_ID='" + prod_id + "'";
        con.query(sql, function(err, result, fields) {
            if (err) throw err;
            result = JSON.parse(JSON.stringify(result));
            curr = result[0];
            amount = quan * curr.Price;
            sql = "INSERT INTO ORDERS (Cust_ID, Salesman_ID, Prod_ID, Quantity, Order_Date, Amount)";
            sql += "VALUES ('" + cust_id + "', '" + sale_id + "', '" + prod_id + "', '" + quan + "', '" + date + "', '" + amount + "')";
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
            });
        });
    });
});

app.get('/showorders', function(req, res) {
    session = req.session;

    var con = mysql.createConnection({
        host: "localhost",
        user: "yrj98",
        password: "Y@sh98R@j"
    });

    con.connect(function(err) {
        if(err) throw err;
        sql = "USE Project";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
        });

        sql = "SELECT * FROM ORDERS";
        con.query(sql, function(sql, r, fields) {
            if(err) throw err;
            result = JSON.parse(JSON.stringify(r));
            var l = result.length;
            txt = "";
            result.forEach(myFunction);
            function myFunction(value, index, array) {
                for(var i in value) {
                    if(i == "Order_Date") {
                        txt += value[i].substring(0,10);
                    } else {
                        txt += value[i];
                    }
                    txt += " ";
                }
                txt += "\n"
            }
            console.log(txt);
        });
    });
});

app.listen(1337, function() {
    console.log('Listening to Port 1337...')
});
