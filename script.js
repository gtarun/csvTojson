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
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;


 var representives = new Schema({
      email             : {type : String, required : true, index: { unique: true }} 
    , salt              : {type: Number, set: generateSalt}
    , hashed_password   : {type: String, required: true}
    , name              : {type: String, required: true}
    , company_head      : {type: Boolean, default: false}
    , company_id        : {type: Schema.Types.ObjectId, required: true, ref: 'Company'} //{type: Schema.ObjectId, required: true}
    , confirmed         : {type: Boolean, default: true}
    , created_at        : {type : Date, default: Date.now}
  });


var passwordPattern = /^[a-z0-9]+$/i;
var companyNamePattern = /^[a-z0-9]+$/i;

var allArgs = {};
allArgs.companyName =process.argv[3] ;
allArgs.userPassword = process.argv[2] ;
allArgs.csvFileName = process.argv[4];
var allrows=[];

//console.log(allArgs.companyName);
//check if all arguments are available and having no errors
if (validateArguments(process.argv)) {
    var data = ConvertFileToArray(allArgs.csvFileName);
    
}
/*
 *function defined for processign the csv
*/
//Argument validation function
function validateArguments(args) {
  var errors;
  if (args.length == 5) {
    
    if (passwordPattern.test(args[2])  ) {
      errors+= "\n *Password is not Good.";
      
    }
    else if (args) {
      //code
    }else{
      
    }
  }
  else{
    errors+= "\n *Invalid Arguments Supplied.";
    console.log("Error in arguments!");
  }
  return errors
}

function ConvertStringToArray(csvData) {
  //code
  csv()
      .from.string(csvData )
      .to.array(function(data){
        console.log(data)
      });
}

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

function saveData(allrows)
{
  console.log("from callback "+JSON.stringify( allrows));
  representives.save(allrows, function(err, records) {
    if (err) throw err;
    console.log("record added");
  });
  
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

