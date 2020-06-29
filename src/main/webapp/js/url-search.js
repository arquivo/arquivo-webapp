/**
 * When using iframe it will send the following events has a call to other function.
 * 
 * Events:
 *    resizeIframe 
 *    urlSearchClickOnVersion 
 */ 

function getYearTs(ts){
  return ts.substring(0, 4);
}

function getMonthTs(ts){
  return ts.substring(4,6);
}

function getYearPosition(firstVersionYear, ts){
  return parseInt(getYearTs(ts)) - firstVersionYear;
}

function getDateSpaceFormatedWithoutYear(ts){
  var month = ts.substring(4, 6);
  month = Content.months_alt[month];
  var day = ts.substring(6, 8);
  if( day[0] === '0'){
    day = day[1];
  }
  var hours = ts.substring(8,10);
  var minutes = ts.substring(10,12);

  return day + " "+ month + " " + Content.at + " " + hours+":"+minutes;
}

function getDateSpaceFormated(ts){
  var year = ts.substring(0, 4);
  var month = ts.substring(4, 6);
  month = Content.months_alt[month];
  var day = ts.substring(6, 8);
  if( day[0] === '0'){
    day = day[1];
  }
  var hours = ts.substring(8,10);
  var minutes = ts.substring(10,12);

  return day + " "+ month + " " +year+ " " +" " + Content.at + " " + hours+":"+minutes;
}

function getShortDateSpaceFormated(ts){
  var year = ts.substring(0, 4);
  var month = ts.substring(4, 6);
  month = Content.shortMonths[month];
  var day = ts.substring(6, 8);
  if(day.charAt(0) == '0'){
    day = day.charAt(1);
  }
  return day + " "+ month;
}

function createMatrixTable(waybackURL, versions, insertOnElementId){

  const firstVersionYear = versions.map(function(t) { return parseInt(t.timestamp.substring(0,4)); }).reduce( function(a, b) { return Math.min(a, b); });
  var today = new Date();
  var yyyy = today.getFullYear();
  var yearsCount = yyyy - firstVersionYear +1;
  
  // defined matrix variable that holds the table to be printed
  var matrix = new Array(yearsCount);
  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = [];
  }

  // insert each version to correct position
  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    var timestamp = version.timestamp;
    var timestampStr = timestamp.toString();
    var url = version.url;
    var pos = getYearPosition(firstVersionYear, timestampStr);
    var dateFormated = getDateSpaceFormated(timestampStr);
    var shortDateFormated= getShortDateSpaceFormated(timestampStr);
    var tdtoInsert = '<td><a id="'+timestampStr+'" onclick="return callUrlSearchClickOnVersionOnParent(this);" href="'+waybackURL+'/'+timestampStr+'/'+url+'" title="'+dateFormated+'">'+shortDateFormated+'</a></td>';
    matrix[pos].push(tdtoInsert);
  }

  //find which is the biggest number of versions per year and create empty tds in the other years
  var maxLength = 0;
  var additionalYearClassArray = [matrix.length];
  for (var i = 0; i < matrix.length; i++) {
    var lengthi = matrix[i].length;
    var yearStr = (firstVersionYear+i).toString();
    var c = lengthi == 0 ? "inactive" : '';
    additionalYearClassArray[i]=c;

    if(lengthi > maxLength){
      maxLength = lengthi;
    }
  }

  // create table header
  var tHeaderContent = '';
  for (var i = 0; i < matrix.length; i++) {
    var yearStr = (firstVersionYear+i).toString();
    var addYearClass = additionalYearClassArray[i];
    // add the headers for each year
    tHeaderContent += ('<th id="th_'+yearStr+'" class="'+addYearClass+'">'+yearStr+'</th>');
  }
  
  //iterate again to create empty tds
  for (var i = 0; i < matrix.length; i++) {
    var lengthi = matrix[i].length;
    if(maxLength > lengthi){
      for(var j=0; j<(maxLength - lengthi); j++){
        matrix[i].push('<td><span class="empty">&nbsp;</span></td>');
      }
    }
  }

  //create each row of the table
  var tbodyContent = '';
  for (var i=0; i<maxLength; i++){
    rowString ="";
    for (var j = 0; j < matrix.length; j++) {
      rowString+= matrix[j][i];
    }
    var rowId = (i+1).toString()
    tbodyContent += ('<tr class="trTV" id="'+rowId+'">'+rowString+'<tr>');
  }

  var table =
    '<div id="tablePresentation" class="tablePresentation">'+
      '<table>'+
        '<thead>'+
          '<tr>'+
            tHeaderContent+
          '</tr>'+
        '</thead>'+
        '<tbody>'+
          tbodyContent+
        '</tbody>'+
      '</table>';
  return table;
}

function createResultsHeader(typeShow){
  var addTableAttr = typeShow == 'list' ? '' : 'disabled';
  var addListAttr = typeShow == 'list' ? 'disabled' : '';
  var resultsHeader =
    '<div class="resultsHeader">'+
      '<button class="previous" onclick="scrollTableLeft()"></button>'+
      '<button class="showHasTableButton" onclick="changeTypeShow(\'table\'); callResizeIframeOnParent();" '+addTableAttr+'>'+ Content.table +'</button>'+
      '<button class="showHasListButton" onclick="changeTypeShow(\'list\'); callResizeIframeOnParent();" '+addListAttr+'>'+ Content.list +'</button>'+
      '<button class="next" onclick="scrollTableRight()"></button>'+
    '</div>';
  return resultsHeader;
}

function replaceUrlParam( url, paramName, paramValue ) {
  if (paramValue == null) {
    paramValue = '';
  }
  var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
  if (url.search(pattern)>=0) {
    return url.replace(pattern,'$1' + paramValue + '$2');
  }
  url = url.replace(/[?#]$/,'');
  return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
}

function scrollTableLeft(){
  $('#tablePresentation').animate({scrollLeft: '-='+(window.innerWidth/2)}, 800, "easeOutQuad");
}
function scrollTableRight(){
  $('#tablePresentation').animate({scrollLeft: '+='+(window.innerWidth/2)}, 800);
}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// Send message 'urlSearchClickOnVersion' meaning the user have selected/clicked one of the versions.
function callUrlSearchClickOnVersionOnParent(anchorClickedOfArchivedVersion) {
  if (inIframe()) {
    const waybackURLClicked = anchorClickedOfArchivedVersion.getAttribute('href');

    window.parent.postMessage({
        'func': 'urlSearchClickOnVersion',
        'message': waybackURLClicked
    }, "*");

    const timestamp = anchorClickedOfArchivedVersion.getAttribute('id'); // id is also the timestamp
    openTimestamp(timestamp);

    return false; // prevent the change page of the anchor
  } else {
    return true;
  }
}

// Send message to parent window that inform that the user have interact with the UI.
// Important to inform the parent window so resize iframe.
function callResizeIframeOnParent() {
  if (inIframe()) {
    window.parent.postMessage({
        'func': 'resizeIframe',
    }, "*");
  }
}

function createMatrixList(waybackURL, versions){
  // append to years id element each year element
  var today = new Date();
  var yyyy = today.getFullYear();
  var yearsCount = yyyy - 1996 +1;
  var yearsToTimestampsMatrix = new Array(yearsCount);
  var yearsMonthsVersionsMatrix = new Array(yearsCount);
  
  // initialize matrix
  for (var i = 0; i < yearsToTimestampsMatrix.length; i++) {
    // initialize each year
    yearsToTimestampsMatrix[i] = [];
    yearsMonthsVersionsMatrix[i] = new Array(12).fill([]); 

    for (var j = 0 ; j < 12; j++) {
      //yearsMonthsVersionsMatrix[i].push(new Array(12));
      yearsMonthsVersionsMatrix[i][j] = [];
    }
  }

  for (var i = 0; i < versions.length; i++) {
    const version = versions[i];
    var timestamp = version.timestamp;
    var matrixPos = getYearPosition(1996,timestamp);
    yearsToTimestampsMatrix[matrixPos].push(timestamp);
    var currentMonth = getMonthTs(timestamp);
    yearsMonthsVersionsMatrix[matrixPos][parseInt(currentMonth)-1].push(version);
  }

  var h = '';

  // insert initial list presentation strategy
  h +=
    '<div id="listPresentation" class="listPresentation">'+
      '<ul id="list_years" class="years">';
  

  for (var i = 0; i < yearsMonthsVersionsMatrix.length; i++) {
    var yearStr = (1996+i).toString();
    const yearArray = yearsToTimestampsMatrix[i];
    const yearTimestampsCount = yearArray.length;
    const yearVersionsCountMessage = yearTimestampsCount + ' ' + (yearTimestampsCount > 1 ? Content.searchVersions : Content.searchVersion );
    const additionalYearClass = yearTimestampsCount == 0 ? 'noVersions' : '';

    h +=
      '<li id="list_'+yearStr+'" class="year close '+additionalYearClass+'">'+
        '<h4 class="yearHeader" onclick="$(this).parent().toggleClass(\'open close\'); callResizeIframeOnParent();">'+
          '<span class="yearText">'+yearStr+'</span>'+
          '<span class="yearVersionsCount versionsCount">'+yearVersionsCountMessage+'</span>'+
          '<span class="interactionStatus"></span>'+
        '</h4>'+
        '<ul class="months">';
    for (var j = 0 ; j < 12; j++) {
      var monthVersions = yearsMonthsVersionsMatrix[i][j];
      const monthCountVersions = monthVersions.length;
      const monthMessage = monthCountVersions + ' ' + ( monthCountVersions == 1 ?  Content.searchVersion : Content.searchVersions );
      var currentYear = yearStr;
      var currentMonth = (j+1).toString().padStart(2,'0');
      var currentYearMonth = 'list_'+currentYear+'_'+currentMonth;
      const additionalMonthClass = monthCountVersions == 0 ? 'noVersions' : '';
      h +=
          '<li id="'+currentYearMonth+'" class="month close '+additionalMonthClass+'">'+
            '<h4 class="monthHeader" onclick="$(this).parent().toggleClass(\'open close\'); callResizeIframeOnParent();">'+
              '<span class="monthText">'+Content.months_alt[currentMonth]+'</span>'+
              '<span class="monthVersionsCount versionsCount" id="monthVersionsCount_'+currentYearMonth+'">'+monthMessage+'</span>'+
              '<span class="interactionStatus"></span>'+
            '</h4>'+
            '<ul class="versions">';

      for (var k = 0 ; k < monthCountVersions ; k++) {
        var version = monthVersions[k];
        var timestamp = version.timestamp;
        var url = version.url;
        var dateFormated = getDateSpaceFormated(timestamp);
        var versionWaybackUrl = waybackURL+'/'+timestamp+'/'+url;
        h += 
              '<li class="version"><a onclick="return callUrlSearchClickOnVersionOnParent(this);" id="'+timestamp+'" href="'+versionWaybackUrl+'" title="'+dateFormated+'">'+getDateSpaceFormatedWithoutYear(timestamp)+'</a></li>';
      }
      h +=
            '</ul>'+ // close versions
          '</li>'; // close specific month
    }
    h+=
        '</ul>'+ // close months
      '</li>'; //close specific year
  }
  return h;
}

function createErrorPage(urlQuery){
  return 
    '<div id="conteudo-resultado-url" class="container-fluid col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 col-xl-offset-4 col-xl-4">'+
    '  <div id="first-column">&nbsp;</div>'+
    '  <div id="second-column">'+
    '    <div id="search_stats"></div>'+
    '    <div id="conteudo-pesquisa-erro">'+
    '<div class="alert alert-danger col-xs-12 my-alert break-word"><p>'+Content.noResultsFound+' <span class="text-bold">'+urlQuery+'</span></p></div>'+
    '<div id="sugerimos-que" class="col-xs-12 no-padding-left suggestions-no-results">'+
    '<p class="text-bold">'+Content.suggestions+'</p>'+
    '<ul>'+
    '<li>'+Content.checkSpelling+'</li>'+
    '<li><a class="no-padding-left" target="_top" href="'+Content.suggestUrl+urlQuery+'">'+Content.suggest+'</a> '+Content.suggestSiteArchived+'</li>'+
    '<li><a class="no-padding-left" target="_top" href="http://timetravel.mementoweb.org/list/1996/'+urlQuery+'">'+Content.mementoFind+'</a>.</li>'+
    '</ul>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>';
}

// Global variables
var arquivo_waybackURL;
var arquivo_urlQuery;
var arquivo_startTs;
var arquivo_endTs;
var arquivo_insertOnElementId;
var arquivo_loadingElementId;

function initializeUrlSearch(waybackURL, urlQuery, startTs, endTs, insertOnElementId, loadingElementId, typeShow, timestampToOpen) {
  arquivo_waybackURL = waybackURL;
  arquivo_urlQuery = urlQuery;
  arquivo_startTs = startTs;
  arquivo_endTs = endTs;
  arquivo_insertOnElementId = insertOnElementId;
  arquivo_loadingElementId = loadingElementId;
  arquivo_timestampToOpen = timestampToOpen;
  startUrlSearch(waybackURL, urlQuery, startTs, endTs, insertOnElementId, loadingElementId, typeShow);
}

function changeTypeShow(typeShow) {
  $("#"+arquivo_insertOnElementId).empty();
  startUrlSearch(arquivo_waybackURL, arquivo_urlQuery, arquivo_startTs, arquivo_endTs, arquivo_insertOnElementId, arquivo_loadingElementId, typeShow);
}

function scroll(e) {
  var el = $( e );
  var elOffset = el.offset().top;
  var offset = elOffset - (window.innerHeight / 2);
  console.log("scroll offset " + offset);
  $('html, body').animate({scrollTop:offset}, 700);
  //document.getElementById("urlSearchContainer").scrollTop = offset;
}

function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

function openTimestamp(timestampToOpen){
  // remove other viewing version timestamp
  $(".viewingVersion").each(function() {
    $(this).removeClass("viewingVersion");
  });

  const year = timestampToOpen.substring(0,4);
  if (year) {
    // click on that year if not already opened
    const yearEle = $("#list_"+year)
    if (! yearEle.hasClass("preventYear")) {
      yearEle.removeClass('close').addClass('open');
    }
    if (timestampToOpen.length >= 6) {
      // click on month if that month not already opened
      const month = timestampToOpen.substring(4,6);
      const monthEle = $("#list_"+year+"_"+month);
      if (! monthEle.hasClass("preventMonth")){
        monthEle.removeClass('close').addClass('open');
      }

      const timestampEle = document.getElementById(timestampToOpen);
      if (typeof(timestampEle) != 'undefined' && timestampEle != null) { // exits ?
        timestampEle.classList.add("viewingVersion");
        // scrollIntoView didn't work because it scrolls the parent windows instead of inner iframe creating strange effects.
        if (!isScrolledIntoView(timestampEle)) {
          scroll(timestampEle);
        }
      }
    }
  }
}

function startUrlSearch(waybackURL, urlQuery, startTs, endTs, insertOnElementId, loadingElementId, typeShow) {
  var insertOn = $('#'+insertOnElementId);
  var requestURL = waybackURL + ( waybackURL.endsWith("/") ? "" : "/" ) + "cdx";
  var inputURL = urlQuery;
  var notFoundURLSearch = false;

  loading = false;
  const loadEleJQ = $( "#"+loadingElementId);
  $( document ).ajaxStart(function() {
    loading = true;
    loadEleJQ.show();
  });
  $( document ).ajaxStop(function() {
    loading = false;
    loadEleJQ.hide();
  });
  $( document ).ajaxComplete(function() {
    loading = false;
    loadEleJQ.hide();
  });

  $.ajax({
    // example request to the cdx-server api - 'http://arquivo.pt/pywb/replay-cdx?url=http://www.sapo.pt/index.html&output=json&fl=url,timestamp'
    url: requestURL,
    cache: true,
    type: 'GET',
    dataType: 'text',
    data: {
      output: 'json',
      url: urlQuery,
      fields: 'url,timestamp,status',
      filter: '!~status:4|5',
      from: startTs,
      to: endTs
    },
    error: function() {
      // Apresenta que não tem resultados!
      insertOn.append(createErrorPage(urlQuery));
    },
    success: function(data) {
      versions = []
      if( data ) {
        var tokens = data.split('\n')

        var previousVersion = null;
        const deltaToRemoveDuplicatedEntries = 3600; // remo
        $.each(tokens, function(e){
          if(this != ""){
            var version = JSON.parse(this);
            if( version.status && ( version.status[0] === '4' || version.status[0] === '5') ){ /*Ignore 400's and 500's*/
              /*empty on purpose*/
            } else {
              if (previousVersion != null && isRemovePreviousVersion(previousVersion, version, deltaToRemoveDuplicatedEntries)) {
                versions.pop();
              } 
              if (previousVersion == null || !isRemoveCurrentVersion(previousVersion, version, deltaToRemoveDuplicatedEntries)) {
                versions.push(version);
                previousVersion = version;
              }
            }
          }
        });

        const totalResults = versions.length;
        document.getElementById("estimatedResultsValue").innerHTML = totalResults.toLocaleString(language);
        document.getElementById("estimatedResults").style.display = totalResults > 0 ? 'block' : 'none';

        insertOn.append(createResultsHeader(typeShow));

        if (typeShow == 'list') {
          insertOn.append(createMatrixList(waybackURL, versions));
          insertOn.removeClass('table').addClass('list');
        } else {
          insertOn.append(createMatrixTable(waybackURL, versions));
          insertOn.removeClass('list').addClass('table');
        }
      
      } else {
        insertOn.append(createErrorPage(urlQuery));
      }
      
      openTimestamp(arquivo_timestampToOpen);
      callResizeIframeOnParent();
    }
  });
}

function isRemovePreviousVersion(previousVersion, currentVersion, delta) {
  return previousVersion.status && currentVersion.status && previousVersion.status[0] === '3' && currentVersion.status[0] === '2' && timestampDifferenceInSeconds(previousVersion.timestamp, currentVersion.timestamp) <= delta;
}

function isRemoveCurrentVersion(previousVersion, currentVersion, delta) {
  return previousVersion.status && currentVersion.status && previousVersion.status[0] === '2' && currentVersion.status[0] === '3' && timestampDifferenceInSeconds(previousVersion.timestamp, currentVersion.timestamp) <= delta;
}

function getDateFromTimestamp(ts) {
  var y = parseInt(ts.substring(0,4));
  var M = parseInt(ts.substring(4,6))-1;
  var d =  parseInt(ts.substring(6,8));
  var h = parseInt(ts.substring(8,10));
  var m = parseInt(ts.substring(10,12));
  var s = parseInt(ts.substring(12,14));
  return new Date(y, M, d, h, m, s);
}
function timestampDifferenceInSeconds(ts1, ts2) {
  var tsd1 = getDateFromTimestamp(ts1);
  var tsd2 = getDateFromTimestamp(ts2);
  return (tsd2.getTime() - tsd1.getTime()) /1000 ;
}

// function to be called on wayback parent iframe to update the displayed page and/or highligh specific timestamp
function replacePageAndHighlightTimestamp(url, timestamp) {
  let urlSearchFunctionalityUrl = "/url/search";
  function getContextPath() {
     return window.location.pathname.substring(0, window.location.pathname.indexOf(urlSearchFunctionalityUrl));
  }
  // normalize URLs like pywb wayback does
  const newUrlNormalized     = url.replace(/^(http(s)?\:\/\/(www\.)?)?/, '');
  const currentUrlNormalized = arquivo_urlQuery.replace(/^(http(s)?\:\/\/(www\.)?)?/, '');

  const alreadySameURL = newUrlNormalized === currentUrlNormalized;
  if (alreadySameURL) {
    openTimestamp(timestamp);
  } else {
    // replace location to prevent the back browser button to back
    window.location.replace(getContextPath() + urlSearchFunctionalityUrl + '/' + timestamp + '/' + url);
  }
}
