/**
 * 
 * Sabbir Khan
 */
//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = 8225;
    var user = 'sri_khan';
var password = 'A00394768';
var database = 'sri_khan';
//#############################################


//These should not change, unless the server spec changes
var host = '127.0.0.1';
var port = '27017'; // Default MongoDB port



// Now create a connection String to be used for the mongo access
var connectionString = 'mongodb://' + user + ':' + password + '@' +
    host + ':' + port + '/' + database;


//#############################################
//the var for the university collections
var bankAccountCollection;
const NAME_OF_COLLECTION = 'bankAccounts';
//#############################################


//include express server and mongodb
    var express = require('express');
var mongodb = require('mongodb');


var app = express();//instantiate

//CORS Middleware, causes Express to allow Cross-Origin Requests
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',
        'Content-Type');

    next();
}
app.use(allowCrossDomain);


//needed for post operation to parse request.body
app.use(express.bodyParser());


//adding satic resource
app.use(express.static(__dirname));// __dirname current directory
app.use('/scripts', express.static(__dirname + '/scripts'));//subfolder
app.use('/css', express.static(__dirname + '/css'));




//now connect to the db
mongodb.connect(connectionString, function (error, db) {

    //if something is wrong, it'll crash
    //you could add a try-catch block to handle it, 
    //but not needed for the assignment
    if (error) {
        throw error;
    }//end if

    //#############################################
    bankAccountCollection = db.collection(NAME_OF_COLLECTION);
    //#############################################


    // Close the database connection and server when the application ends
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });


    //if everything is good, then start the application server
    var server = app.listen(SERVER_PORT, function () {
        console.log('Listening on port %d',
            server.address().port);
    });
});






//#############################################
app.post('/getTransactions', function (request, response) {

    bankAccountCollection.find({},
        function (err, result) {//use empty criteria to get all records
            if (err) {
                return response.send(400, 
                                    'An error occurred retrieving records.');
            }//end if

            //now result is expected to be an array of universities
            result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                            'An error occurred processing your records.');
                    }//end if

                    //if succeeded, send it back to the calling thread
                    return response.send(200, resultArray);
                }
            );
        });

});



//#############################################
app.post('/addRecord', function (request, response) {
//    console.log("Process being executed in " + __dirname);
//    console.log(request.body);


    // now insert the record.
    // it's easer than the case of a text file, since you do NOT have to read
    //the data first!
    bankAccountCollection.insert(request.body,
        function (err, result) {
            if (err) {
                console.log(err);
                return response.send(400, 'Error occurred syncing records');
            }//end if

            console.log(result.ops);

            //else success. Return the results ()
            return response.send(200, result.ops);
        });
});




app.post('/addRecordWithBalance', function (request, response) {
//    console.log("Process being executed in " + __dirname);
//    console.log(request.body);


    //there are better ways, but restricting to the methods I covered in class
    bankAccountCollection.find({},//use empty obj to get all records first
        function (err, result) {
            if (err) {
                return response.send(400, 
                                    'An error occurred retrieving records.');
            }//end if

            result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                            'An error occurred processing your records.');
                    }//end if

                    //now add the balance to the record and insert
                    var bal = 0;
                    if (resultArray.length < 1) {// if no record yet
                        bal = request.body.Amount;//the current amt will be bal
                    }
                    else {
                        bal = parseFloat(request.body.Amount)
                            + parseFloat(resultArray[resultArray.length - 1].Balance);
                    }//end if-else

                    request.body.Balance = bal;//add the new key/val

                    bankAccountCollection.insert(request.body,
                        function (err, result) {
                            if (err) {
                                console.log(err);
                                return response.send(400, 
                                            'Error occurred syncing records');
                            }//end if

                            console.log(result.ops);

                            //else success. Return the results ()
                            return response.send(200, result.ops);
                        });
                });
        });
});

