/* Written By - Tarun Gupta, VenturePact
* Script.js built to take csv file with following column
* @FullName, @EmailAddress
*
* Console agrgument : node script.js password nameOfTheCompany filename.csv
* argv[0] = node
* argv[1] = script.js
* argv[2] = password
* argv[3] = nameOfTheCompany 
* argv[4] = filename.csv
*
* npm used
* https://github.com/wdavidw/node-csv.git
*/

var csv = require('csv');
var fs = require('fs');
var crypto = require("crypto");
/*
var endpoints = require('./endpoints')
  , host = endpoints.resolveEndpoints({database: 'mongodb'});

module.exports = function(db){
  db.connect('mongodb://admin:lovers&madmen@' + host + '/firefly');
}


module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

 var representives = new Schema({
      Email             : {type : String, required : true, index: { unique: true }} 
    , salt              : {type: Number, set: generateSalt}
    , hashed_password   : {type: String, required: true}
    , FullName              : {type: String, required: true}
    , company_head      : {type: Boolean, default: false}
    , company_id        : {type: Schema.Types.ObjectId, required: true, ref: 'Company'} //{type: Schema.ObjectId, required: true}
    , confirmed         : {type: Boolean, default: true}
    , created_at        : {type : Date, default: Date.now}
  });
*/
// pattren for validations 
var passwordPattern = /^[a-z0-9]+$/i;
var companyNamePattern = /^[a-z0-9]+$/i;

//Command Line argument into an object
var allArgs = {};
allArgs.companyName =process.argv[3] ;
allArgs.userPassword = process.argv[2] ;
allArgs.csvFileName = process.argv[4];

//To collect all rows of the csv
var allrows=[];

//check if all arguments are available and having no errors
if (validateArguments(process.argv)) {
    var data = ConvertFileToArray(allArgs.csvFileName);
    console.error(data);
}

/*
 *
 *function defined for processign the csv
 *
*/

//Argument validation function
function validateArguments(args) {
  var errors;
  console.log(args.length);
  if (args.length == 5) {
    
    if (passwordPattern.test(allArgs.userPassword)) {
      errors+= "\n *Password is not Good.";
      
    }
    else if (companyNamePattern.test(allArgs.companyName)) {
      errors+= "\n *Company Name is not Good.";
      
    }else{
      // Need to write more validation code will do it later on 
    }
  }
  else{
    errors+= "\n *Invalid Arguments Supplied.";
  }
  return errors
}

// function to parse csv and put in global array
function ConvertFileToArray(csvFile) {
  
  csv()
    .from.path(__dirname+'/'+csvFile, { delimiter: ',', escape: '"' })
    .transform( function(row){
        row.unshift(row.pop());
        return row;
      })  
    .on('record', function(row,index)
      {
        var newRow ={ FullName : row[1], Email : row[0]} ;
        //console.log(newRow);
        try {
          allrows.push(newRow);
        }
        catch(e){
          console.error(e.stack);
        }
      })
    .on('close', function(count){
        // when writing to a file, use the 'close' event
        // the 'end' event may fire before the file has been written
        console.log('Number of lines: '+count);
      })
    .on('error', function(error){
        console.log(error.message);
      })
    .on('end',function(data){
      //console.log("data is array is "+allrow.length);
      //saving all data after async call
        saveData(allrows);
      
      });
   // return allrow;
  
}

// function to save data into database ** Not sure if it works , So created multiple version will do after discussion

function saveData(allrows)
{
  console.log("from callback "+JSON.stringify( allrows));
  /*db.representives.save(allrows, function(err, records) {
    if (err) throw err;
    console.log("record added");
  });
  */
  
  //we can uncomment them when we want to put code in Firefly
  
  /*Company.findOne({name: company}, function(err, company){
            attrs.company_id = company._id.toString();
            var rep = new Rep(allrows);
            rep.set('password.raw', req.body.password); // hash password as a virtual attribute
            rep.save(function(err){
              if (err){
                if (err.code === 11000){ // if mongodb returns a duplicate error
                  req.flash("error", "The email %s is already in use.", attrs.email);
                }
                res.render('reps/new');
              } else {
                req.flash("info", "You can now login.", attrs.email);
              }
            }
  });
  
  
    var attrs = allrow
    , company = req.subdomain;
    attrs.salt = '';
    Company.findOne({name: allArgs.companyName}, function(err, allArgs.companyName){
      attrs.company_id = company._id.toString();
      var rep = new Rep(attrs);
      rep.set('password.raw', allArgs.userPassword); // hash password as a virtual attribute
      rep.save(function(err){
        if (err){
          if (err.code === 11000){ // if mongodb returns a duplicate error
            //req.flash("error", "The email %s is already in use.", attrs.email);
            console.log("The email %s is already in use.", attrs.email);
          }
        } else {
          console.log("Saved all!!");
           
    
        }
      }); // end rep.save
    }); // end Company.findOne
    */
  
}

