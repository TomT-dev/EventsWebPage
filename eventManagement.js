function doGet(e) {
  var name = Session.getActiveUser().getEmail();
  var params = JSON.stringify(e);
  var action = e.parameter.action;
  if (action == 'ppt') {
    // return ContentService.createTextOutput(getEventsData());
    return ContentService.createTextOutput(resetEventsDataInCache()).setMimeType(ContentService.MimeType.JSON);
  } else if (action == 'refreshCache') {
    resetEventsDataInCache();
    return ContentService.createTextOutput('The events on the web site have been refreshed');
  } else if (action == 'getUrl') {
    return ContentService.createTextOutput(getUrl());
  } else {
    return HtmlService.createHtmlOutputFromFile('websiteListPaged').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

function testGetEventsData() {
  Logger.log('////////////////////////////////////////')
  let z = JSON.parse(getEventsData())[1];

}

function saveUrl() {
  PropertiesService.getScriptProperties()
    .setProperty("WEB_APP_URL", "https://script.google.com/a/macros/goringgapu3a.org.uk/s/AKfycbxFOVtjnxUDWbBsBEpmAENsR4RZx3IpKVRJ3ZMXgbz5KGvzKpOvReFQwSacprM8AdA2cQ/exec");

}

function getUrl() {
  const url = PropertiesService.getScriptProperties().getProperty("WEB_APP_URL");
  return url;
}

function resetEventsDataInCache() {
  clearCache();
  let z = getEventsData();
  Logger.log('got //////////////////////////////////////////////////////////////////////////////');
  Logger.log(z);
  return z;
}

function resetEventsDataInProperties() {
  const cache = PropertiesService.getScriptProperties()
  const cacheKey = 'eventsData';
  cache.deleteProperty(cacheKey);
}


function getEventsDataFromScript() {
  const cache = PropertiesService.getScriptProperties()
  const cacheKey = 'eventsData';
  let cachedData = cache.getProperty(cacheKey);

  if (cachedData) {
    Logger.log('Returning cached events data from script properties');
    Logger.log(cachedData);
    return cachedData;
  }

  logCacheMiss('eventsData from properties');
  Logger.log('Cache miss. Fetching data from the spreadsheet.');

  const sortbyDate = (a, b) => {
    if (a[0] === b[0]) return 0;
    return a[0] < b[0] ? -1 : 1;
  };

  const SS = SpreadsheetApp.openById(getEventMgtSpreadsheetId());
  const eventsWs = SS.getSheetByName('Events');
  const numEvents = eventsWs.getLastRow() - 1;
  Logger.log(numEvents);

  let d = new Date();
  const events = eventsWs
    .getRange(2, 1, numEvents, eventsWs.getLastColumn())
    .getValues()
    .filter(value => value[4].toLowerCase() === 'open')
    .filter(value => value[0] >= d)
    .filter(value => value[0] != null)
    .sort(sortbyDate);

  Logger.log(events);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = [, 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st']
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  //              


  const eventsData = events.map(event => {
    return {
      eventDate: event[0],
      dateString: event[0].toLocaleString('en-GB').slice(0, event[0].toLocaleString('en-GB').length - 3),
      dayInMonth: event[0].getDate(),
      weekDay: weekdays[event[0].getDay()],
      superscript: days[event[0].getDate()],
      monthInYear: months[event[0].getMonth()],
      fullYear: event[0].getFullYear().toString(),
      friendlyDate: `${event[0].getHours().toString().padStart(2, "0")}:${event[0].getMinutes().toString().padStart(2, "0")} ${event[0].getDate()} ${months[event[0].getMonth()]} '${event[0].getFullYear().toString().slice(2)}`,
      eventTitle: `${months[event[0].getMonth()]} '${event[0].getFullYear().toString().slice(2)}, ${event[1]}, ${event[2]}`,
      presenter: `${event[2]}`,
      eventTopic: `${event[1]}`,
      synopsis: event[3],
      eventStatus: event[4],
      eventType: event[5],
      eventColour: getEventColour(event[5]),
      eventBookable: event[6],
      eventCost: event[7],
      eventCode: event[8],
      zoomLink: event[9],
      joinTime: event[10],
      moreDetailsUrl: event[12]
    };
  });

  const eventsDataJson = JSON.stringify(eventsData);

  cache.setProperty(cacheKey, eventsDataJson)

  Logger.log('eventsData');
  Logger.log(eventsData);


  return eventsDataJson;

}


function getEventsData() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'eventsData';
  let cachedData = cache.get(cacheKey);

  if (cachedData) {
    Logger.log('Returning cached events data.');
    Logger.log(cachedData);
    return cachedData;
  }

  logCacheMiss('eventsData');
  Logger.log('Cache miss. Fetching data from the spreadsheet.');

  const sortbyDate = (a, b) => {
    if (a[0] === b[0]) return 0;
    return a[0] < b[0] ? -1 : 1;
  };

  const SS = SpreadsheetApp.openById(getEventMgtSpreadsheetId());
  const eventsWs = SS.getSheetByName('Events');
  const numEvents = eventsWs.getLastRow() - 1;
  Logger.log(numEvents);

  let d = new Date();
  const events = eventsWs
    .getRange(2, 1, numEvents, eventsWs.getLastColumn())
    .getValues()
    .filter(value => value[4].toLowerCase() === 'show')
    .filter(value => value[0] >= d)
    .filter(value => value[0] != null)
    .sort(sortbyDate);

  Logger.log(events);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = [, 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st']
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  //              


  const eventsData = events.map(event => {
    return {
      eventDate: event[0],
      dateString: event[0].toLocaleString('en-GB').slice(0, event[0].toLocaleString('en-GB').length - 3),
      dayInMonth: event[0].getDate(),
      weekDay: weekdays[event[0].getDay()],
      superscript: days[event[0].getDate()],
      monthInYear: months[event[0].getMonth()],
      fullYear: event[0].getFullYear().toString(),
      friendlyDate: `${event[0].getHours().toString().padStart(2, "0")}:${event[0].getMinutes().toString().padStart(2, "0")} ${event[0].getDate()} ${months[event[0].getMonth()]} '${event[0].getFullYear().toString().slice(2)}`,
      eventTitle: `${event[0].toLocaleDateString('en-gb', { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' })}, ${event[1]}, ${event[2]}`,
      presenter: `${event[2]}`,
      eventTopic: `${event[1]}`,
      synopsis: event[3],
      eventStatus: event[4],
      eventType: event[5],
      eventColour: getEventColour(event[5]),
      eventBookable: event[6],
      eventCost: event[7],
      eventCode: event[8],
      zoomLink: event[9],
      joinTime: event[10],
      moreDetailsUrl: event[12],
      moreDetailsText: event[13]
    };
  });

  const eventsDataJson = JSON.stringify(eventsData);

  cache.put(cacheKey, eventsDataJson, 21600); // Cache data for the maximum 6 hours

  Logger.log('eventsData');
  Logger.log(eventsData);


  return eventsDataJson;

}

function logCacheMiss(cacheKey) {
  const SS = SpreadsheetApp.openById(getEventMgtSpreadsheetId());
  const cacheMissesWs = SS.getSheetByName('cacheMisses');
  if (!cacheMissesWs) {
    Logger.log('Cache misses worksheet not found. Creating it.');
    const newWs = SS.insertSheet('cacheMisses');
    newWs.appendRow(['Timestamp', 'Cache Key']);
  }

  const ws = SS.getSheetByName('cacheMisses');
  ws.appendRow([new Date(), cacheKey]);
  Logger.log(`Logged cache miss for key: ${cacheKey}`);
}

function cacheEventMgtSpreadsheetId() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('eventMgtSSId', '1GzTrJ_T_Tyyikh7F2Uezf5Zjx7eNhoXZaSymLjRFJ2E'); // Event Management 2025
  Logger.log(getEventMgtSpreadsheetId());
}

function getEventMgtSpreadsheetId() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('eventMgtSSId');
}

function getEventColour(eventType) {
  const eventTypes = getEventColours();
  const index = eventTypes[0].indexOf(eventType);
  const eventColour = eventTypes[1][index];
  return eventColour || '#005ab8';
}

function getEventColours() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'eventColours';
  let cachedColours = cache.get(cacheKey);

  if (cachedColours) {
    Logger.log('Returning cached event colours.');
    return JSON.parse(cachedColours);
  }

  logCacheMiss('eventColours');
  Logger.log('Cache miss for event colours. Fetching from spreadsheet.');

  const SS = SpreadsheetApp.openById(getEventMgtSpreadsheetId());
  const ws = SS.getSheetByName('eventColours');
  const numEventTypes = ws.getLastRow() - 1;
  const data = ws.getRange(2, 1, numEventTypes, 2).getValues();
  const eventTypes = [
    data.map(value => value[0]),
    data.map(value => value[1])
  ];

  cache.put(cacheKey, JSON.stringify(eventTypes), 86400); // Cache data for 1 day

  return eventTypes;
}

function setupDailyCacheRefresh() {
  ScriptApp.newTrigger('refreshCache')
    .timeBased()
    .everyDays(1)
    .atHour(0)
    .create();
}

function periodicCacheRefresh() {

  try {
    logCacheMiss('periodic cache refresh follows');
    clearCache();
    refreshCache()

  } catch (e) {

    Logger.log(e.name);
    Logger.log(e.message);
    Logger.log(e.stack);
    let response = `<p>Name: ${e.name}</p><p>Message: ${e.message}</p><p>Stack:${e.stack}</p>`;

    GmailApp.sendEmail('webmaster@goringgapu3a.org.uk', 'ERROR in periodic events caching', 'ERROR in periodic events caching', {
      htmlBody: response
    });


  }
}


function refreshCache() {
  Logger.log('Refreshing cache.');

  // Refresh events data
  const eventsData = getEventsData();
  const cache = CacheService.getScriptCache();
  cache.put('eventsData', eventsData, 21500); // Refresh cache for another day

  // Refresh event colours
  const eventColours = getEventColours();
  cache.put('eventColours', JSON.stringify(eventColours), 21500); // Refresh cache for another day
}

function clearCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('eventsData');
  cache.remove('eventColours');
  Logger.log('Cleared caches: eventsData and eventColours.');
}

function getEventsForPpt() { //checked, now produces ame output as old version

  const events = JSON.parse(getEventsData());
  Logger.log(events);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // var inPersonEvents =temp.map(value => [value[0].getTime(),value[0].toLocaleString('en-gb', { weekday: 'long', year:'numeric', month: 'long',day:'2-digit',hour: '2-digit', minute: '2-digit'}).replace(/,/g, "|") ,value[1].replace(/,/g, "|"),value[2].replace(/,/g, "|"),value[3].replace(/,/g, "|"),value[8].replace(/,/g, "|"),value[0].toLocaleString('en-gb', { year:'numeric', month: '2-digit',day:'2-digit',hour: '2-digit', minute: '2-digit'}).replace(/,/g, "|")]).filter(value => value != null);

  const eventsForPpt = events.map(value =>
    [new Date(value.eventDate).getTime(),
    new Date(value.eventDate).toLocaleString('en-gb', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/,/g, "|"),
    value.eventTopic.replace(/,/g, "|"),
    value.presenter.replace(/,/g, "|"),
    value.synopsis.replace(/,/g, "|"),
    value.eventCode.replace(/,/g, "|"),
    value.eventTitle.replace(/,/g, "|")
    ]);

  Logger.log(eventsForPpt)
  return

  // eventDate: event[0],
  // dateString: event[0].toLocaleString('en-GB').slice(0, event[0].toLocaleString('en-GB').length - 3),
  // eventTitle: `${months[event[0].getMonth()]} ${event[0].getFullYear().toString().slice(2)}, ${event[1]}, ${event[2]}`,
  // synopsis: event[3],
  // eventStatus: event[4],
  // eventType: event[5],
  // eventColour: getEventColour(event[5]),
  // eventBookable: event[6],
  // eventCost: event[7],
  // eventCode: event[8],
  // zoomLink: event[9],
  // joinTime: event[10]


  // var response = [];
  // response.push(inPersonEvents.length.toString());
  // response.push(inPersonEvents);


  Logger.log(inPersonEvents);

  return JSON.stringify(inPersonEvents);



}

function zz() {
  const d = new Date().toLocaleDateString('en-gb', { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' });
  Logger.log(d)
}
