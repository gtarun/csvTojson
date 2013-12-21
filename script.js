/*************************************************
* Written By - Tarun Gupta, VenturePact
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
* Open source npm used
* https://github.com/wdavidw/node-csv.git
***************************************************/

var csv = require('csv');
var fs = require('fs');
var crypto = require("crypto");

// pattren for validations 
var passwordPattern = /^[a-z0-9]+$/i;
var companyNamePattern = /^[a-z0-9]+$/;

//Command Line argument into an object
var allArgs = {};
allArgs.companyName =process.argv[3] ;
allArgs.userPassword = process.argv[2] ;
allArgs.csvFileName = process.argv[4];

//To collect all rows of the csv
var allrows=[];

//check if all arguments are available and having no errors
var errors = validateArguments(process.argv);
var isErrors = errors == false ? false : true ;
if (!isErrors) {
    var data = ConvertFileToArray(allArgs.csvFileName);
    console.error(data);
}
else{
  console.error("==>There are some errors: " +errors);
}

/***************************************
 *
 *function defined for proces sign the csv
 *
****************************************/

//Argument validation function
function validateArguments(args) {
  var isErrors=false,
  errorList="";
  if (args.length == 5) {
    if (!passwordPattern.test(process.argv[2])) {
      errorList+= "\n *Password is not Good.";
      isErrors = true;
    }
    if (!companyNamePattern.test(allArgs.companyName)) {
      errorList+= "\n *Company Name is not Good.";
      isErrors = true;
    }else{
      // Need to write more validation code will do it later on 
    }
  }
  else{
    errorList = "\n *Invalid Arguments Supplied.";
    isErrors = true;
  }
  return isErrors == true ? errorList : isErrors;
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
      //saving all data after async call
        saveData(allrows);
      
      });
}

// function to save data into database 

function saveData(allrows)
{
  console.log("from callback "+JSON.stringify( allrows));
  
  //Need to write the mongodb conncection and create a collection with above data
  
}

