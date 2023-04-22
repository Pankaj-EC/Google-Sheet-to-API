var activity = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1ePenupZR-gNx2ZJSQi8TyumZ2yuL_jFGhwdl7pyLWE4/edit?usp=sharing')
var sheet = activity.getSheetByName('Sheet1')
var users = activity.getSheetByName('Users')

function doPost(e)
{
 var action = e.parameter.action;
 if(action == 'addData'){
   return addUser(e);
 }
 if (action == 'getData') {
    return getData();
  }
 if (action == 'getDataByuid') {
    return getDataByuid(e);
  }
  if (action == 'updateDataByuid') {
    return updateDataByuid(e);
  }


   if (action == 'getUserByEid') {
    return getUserByEid();
  }
}

// Add Data
function addUser(e){
  var user = JSON.parse(e.postData.contents);
  sheet.appendRow([user.uid, user.data]);
return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

// Get Data
function getData() {
  var range = sheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var data = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
 return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

//Get  Data By Uid

function getDataByuid(e) {
  var uid = e.parameter.uid;
  var range = sheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var data = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[0] == uid) {
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      data.push(obj);
    }
  }
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getUserByEid(e) {
  var Eid = e.parameter.Eid;
  var range = users.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var data = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[0] == Eid) {
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      data.push(obj);
    }
  }
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  // if(data == null)
  // {
  //  return ContentService.createTextOutput("User not found").setMimeType(ContentService.MimeType.TEXT);
  // }
  // else{
    
  // }
}

function updateDataByuid(e) {
  var requestData = JSON.parse(e.postData.contents);
  var uid = requestData.uid;
  var newData = requestData.data;
  var range = sheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[0] == uid) {
      for (var j = 0; j < headers.length; j++) {
        if (headers[j] == 'data') {
          row[j] = newData;
          break;
        }
      }
      range.setValues(values);
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    }
  }
  return ContentService.createTextOutput("User not found").setMimeType(ContentService.MimeType.TEXT);
}
