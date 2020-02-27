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
  month = Content.months[month];
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
  month = Content.months[month];
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

function createMatrixTable(waybackURL, firstVersionYear, versionsArray, versionsURL){
  var today = new Date();
  var yyyy = today.getFullYear();
  var numberofVersions = yyyy - firstVersionYear;
  var matrix = new Array(numberofVersions);
  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = [];
    var yearStr = (firstVersionYear+i).toString();
    // add the headers for each year
    $("#years").append('<th id="th_'+yearStr+'" class="thTV">'+yearStr+'</th>');
  }

  for (var i = 0; i < versionsArray.length; i++) {
    var timestamp = versionsArray[i];
    var timestampStr = timestamp.toString();
    var url = versionsURL[i];
    var pos = getYearPosition(firstVersionYear, timestampStr);
    var dateFormated = getDateSpaceFormated(timestampStr);
    var shortDateFormated= getShortDateSpaceFormated(timestampStr);
    var tdtoInsert = '<td class="tdTV"><a id="'+timestampStr+'" onclick="if(inIframe()) { callUrlSearchClickOnVersionOnParent(this.href); return false;}" href="'+waybackURL+'/'+timestampStr+'/'+url+'" title="'+dateFormated+'">'+shortDateFormated+'</a></td>';
    matrix[pos].push(tdtoInsert);
  }

  //find which is the biggest number of versions per year and create empty tds in the other years
  var maxLength = 0;
  var lengthi =0;
  for (var i = 0; i < matrix.length; i++) {
    lengthi = matrix[i].length;
    var yearStr = (firstVersionYear+i).toString();
    if(lengthi == 0){
      $("#th_"+yearStr).addClass("inactivo");
    }

    if(lengthi > maxLength){
      maxLength = lengthi;
    }
  }
  //iterate again to create empty tds
  for (var i = 0; i < matrix.length; i++) {
    lengthi = matrix[i].length;
    if(maxLength > lengthi){
      for(var j=0; j<(maxLength - lengthi); j++){
        matrix[i].push('<td class="tdTV">&nbsp;</td>');
      }
    }
  }
  //create each row of the table
  for (var i=0; i<maxLength; i++){
    rowString ="";
    for (var j = 0; j < matrix.length; j++) {
      rowString+= matrix[j][i];
    }
    var rowId = (i+1).toString()
    $("#tableBody").append('<tr class="trTV" id="'+rowId+'">'+rowString+'<tr>');
  }
}

function resizeResultsPageHeight(){
  // do not resize because it was hidding on type show table some versions
  //$('#resultados-lista').css('height', ($(window).height() - $('#resultados-lista').offset().top)*0.95 );
}

function createResultsTable(numberOfVersions, inputURL, insertOnElementId){
  scrollLeftPosition = 0;
  /*where the scroll should start in left of table*/
  scrollOffset = 200; /*distance in px of each scroll*/

  $("#"+insertOnElementId).append('<div id="resultados-url"></div>'+
    '<div id="layoutTV">'+
    '<h4 class="leftArrow"><button onclick="scrollTableLeft()" class="clean-button-no-fill"><i class="fa fa-caret-left" aria-hidden="true"></i></ion-icon></button></h4>'+
    '<h4 class="text-bold"><i class="fa fa-table"></i> '+ Content.table +' </h4>'+
    '<button class="clean-button-no-fill anchor-color faded" onclick="changeTypeShow(\'list\')"><h4><i class="fa fa-list"></i> '+ Content.list +'</h4></button>'+
    '<h4 class="rightArrow"><button onclick="scrollTableRight()" class="clean-button-no-fill"><i class="fa fa-caret-right" aria-hidden="true"></i></ion-icon></button></h4>'+
    '</div>'+
    '<div>' +
    '  <div id="intro">' +
    '    <h4 class="texto-1" style="text-align: center;padding-bottom: 15px;">'+ formatNumberOfVersions(numberOfVersions.toString()) +' '+
    (numberOfVersions===1 ?  Content.versionPage : Content.versionsPage )+
    ' '+ inputURL+
    '</h4>' +
    '  </div>' +
    '</div>' +
    '<div id="conteudo-versoes" class="swiper-no-swiping">'+
    '  <div id="resultados-lista" class="swiper-no-swiping" style="overflow: hidden; min-height: 200px!important;">'+
    '    <table id="resultsTable" class="tabela-principal swiper-no-swiping">'+
    '      <tbody id="tableBody" class="swiper-no-swiping">'+
    '<tr id="years" class="swiper-no-swiping trTV"></tr>'+
    '      </tbody>'+
    '    </table>'+
    '  </div>'+
    '</div>'        );

  $( document ).ready(function() {
    resizeResultsPageHeight();
    $("table").on('mousedown touchstart', function (e) {
      e.stopPropagation();
    });

  });

  window.onresize = resizeResultsPageHeight;

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

  scrollLeftPosition -= scrollOffset;
  if(scrollLeftPosition <= 0) {scrollLeftPosition = 0;}
  $('#resultados-lista').animate({scrollLeft: scrollLeftPosition}, 800);

}
function scrollTableRight(){
  scrollLeftPosition += scrollOffset;
  /*Verify if scrollOffset+scrollLeftPosition is bigger than width of table*/
  if(scrollOffset+scrollLeftPosition >  $('#resultsTable').width() ){
    /*Maximum scroll right*/
    scrollLeftPosition = $('#resultsTable').width() - scrollOffset;
  }

  $('#resultados-lista').animate({scrollLeft: scrollLeftPosition}, 800);

}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// Send message 'urlSearchClickOnVersion' meaning the user have selected/clicked one of the versions.
function callUrlSearchClickOnVersionOnParent(waybackURLClicked) {
  if (inIframe()) {
    window.parent.postMessage({
        'func': 'urlSearchClickOnVersion',
        'message': waybackURLClicked
    }, "*");
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

function createMatrixList(waybackURL, versionsArray, versionsURL){
  var today = new Date();
  numberofVersions = yyyy - 1996;
  var yyyy = today.getFullYear();
  var numberofVersions = yyyy - 1996;
  var matrix = new Array(numberofVersions);
  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = [];
    var yearStr = (1996+i).toString();
    // add the headers for each year
    $("#years").append('<div class="yearUl row" id="th_'+yearStr+'"><div class="col-xs-6 text-left yearText"><h4>'+yearStr+'</h4></div></div>');
  }

  for (var i = 0; i < versionsArray.length; i++) {
    var timestamp = versionsArray[i];
    var timestampStr = timestamp.toString();
    var currentYear = getYearTs(timestampStr);
    var currentMonth = getMonthTs(timestampStr);
    var currentMonthVersions = 0;
    var url = versionsURL[i];

    var dateFormated = getDateSpaceFormated(timestampStr);
    var versionWaybackUrl = waybackURL+'/'+timestampStr+'/'+url;

    var tdtoInsert = '<a onclick="if(inIframe()) { callUrlSearchClickOnVersionOnParent(this.href); return false;} " class="day-version-div text-center" id="'+timestampStr+'" href="'+versionWaybackUrl+'" title="'+dateFormated+'">'+getDateSpaceFormatedWithoutYear(timestampStr)+'</a>';

    if(! $('#'+currentYear+'_'+currentMonth).length )  /*Add month if it doesn't exist already*/
    {
      $("#th_"+currentYear.toString()).append('<div class="month-version-div row" id="'+currentYear+'_'+currentMonth+'"><h4 class="month-left month-margins col-xs-6 text-left">'+Content.months[currentMonth]+'</h4><h4 class="month-margins col-xs-6 text-right month-right" ><span id="month_'+currentYear+'_'+currentMonth+'">1 '+ Content.searchVersion +'</span> <i class="fa fa-caret-down iCarret monthCarret" aria-hidden="true"></i></h4></div>');
      currentMonthVersions = 1;
    }
    $("#"+currentYear+'_'+currentMonth).append(tdtoInsert);

    if(currentMonthVersions === 0 ){
      currentMonthVersions = $('#'+currentYear+'_'+currentMonth + '> a').length;
      $('#month_'+currentYear+'_'+currentMonth).html(currentMonthVersions + ' ' + Content.searchVersions);

    }

  }

  //find which is the biggest number of versions per year and create empty tds in the other years
  var lengthi =0;
  for (var i = 0; i < matrix.length; i++) {
    lengthi = matrix[i].length;
    var yearStr = (1996+i).toString();
    var numberOfVersionsCurrentYear = $("#th_"+yearStr+" .day-version-div").length;
    if(numberOfVersionsCurrentYear > 1){
      $("#th_"+yearStr+" div:first-child").after('<div class="col-xs-6 numberVersions no-padding-left text-right"><h4><span>'+numberOfVersionsCurrentYear.toString() + ' '+Content.searchVersions+'</span>    <i class="fa fa-caret-down iCarret yearCarret" aria-hidden="true"></i></h4></div>');
    }else if(numberOfVersionsCurrentYear === 1 ){
      $("#th_"+yearStr+" div:first-child").after('<div class="col-xs-6 numberVersions no-padding-left text-right"><h4><span>'+numberOfVersionsCurrentYear.toString() + ' '+Content.searchVersions+'</span>    <i class="fa fa-caret-down iCarret yearCarret" aria-hidden="true"></i></h4></div>');
    }else{
      /*Year with no versions maybe delete if we don't want to present empty years?*/
      $("#th_"+yearStr+" div:first-child").after('<div class="numberVersions no-padding-left text-right"><h4><span>'+numberOfVersionsCurrentYear.toString() + ' '+Content.searchVersions+'</span>    <i class="fa fa-caret-down iCarretDisabled yearCarret" aria-hidden="true"></i></h4></div>');
      $("#th_"+yearStr).addClass("noVersions");
    }
  }

}

function createResultsList(numberOfVersions, inputURL, insertOnElementId){
  $("#"+insertOnElementId).append('<div id="resultados-url">'+Content.resultsQuestion+' \'<a href="searchMobile.jsp?query=%22'+inputURL+'%22">'+inputURL+'</a>\'</div>'+
    '<div id="layoutTV">'+
    '<button class="clean-button-no-fill anchor-color faded" onclick="changeTypeShow(\'table\')"><h4><i class="fa fa-table"></i> '+Content.table+' </h4></button>'+
    '<h4 class="text-bold"><i class="fa fa-list"></i> '+Content.list+'</h4>'+
    '</div>'+
    '<div>' +
    '<div id="intro">' +
    '<h4 class="texto-1" style="text-align: center;padding-bottom: 15px;">'+ formatNumberOfVersions(numberOfVersions.toString()) +' '+
    (numberOfVersions===1 ?  Content.versionPage : Content.versionsPage )+
    ' '+ inputURL+
    '</h4>' +
    '</div>' +
    '</div>' +
    '<div id="years" class="container-fluid col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 col-xl-offset-4 col-xl-4 ">' +
    '</div>' +
    '</div>' +
    '</div>');
}

function isList(){
  if( $(window).width() < 1024 ){
    return true /*show horizontal list of versions for small screens*/
  }
};

function formatNumberOfVersions( numberofVersionsString){
  formatedNumberOfVersionsString = '';
  for (var i = 0, len = numberofVersionsString.length; i < len; i++) {
    if( (len-i)%3 === 0 ){
      formatedNumberOfVersionsString+= ' ';
    }
    formatedNumberOfVersionsString+= numberofVersionsString[i];
  }
  return formatedNumberOfVersionsString;
}

function createErrorPage(urlQuery, insertOnElementId){
  $("#"+insertOnElementId).append('<div id="conteudo-resultado-url" class="container-fluid col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 col-xl-offset-4 col-xl-4">'+
    '  <div id="first-column">&nbsp;</div>'+
    '  <div id="second-column">'+
    '    <div id="search_stats"></div>'+
    '    <div id="conteudo-pesquisa-erro">'+
    '<div class="alert alert-danger col-xs-12 my-alert break-word"><p>'+Content.noResultsFound+' <span class="text-bold">'+urlQuery+'</span></p></div>'+
    '<div id="sugerimos-que" class="col-xs-12 no-padding-left suggestions-no-results">'+
    '<p class="text-bold">'+Content.suggestions+'</p>'+
    '<ul>'+
    '<li>'+Content.checkSpelling+'</li>'+
    '<li><a class="no-padding-left" href="'+Content.suggestUrl+urlQuery+'">'+Content.suggest+'</a> '+Content.suggestSiteArchived+'</li>'+
    '<li><a class="no-padding-left" href="http://timetravel.mementoweb.org/list/1996/'+urlQuery+'">'+Content.mementoFind+'</a>.</li>'+
    '</ul>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>');
}

function attachClicks(){
  /*Action to show/hide versions on click*/
  touched = false;
  $(".day-version-div").click(function() {
    touched = true;
  });

  $(".month-version-div").click(function() {
    if(touched === false){
      $(this).children(".day-version-div").toggleClass("show-day-version");
      $(this).find(".monthCarret").toggleClass('fa-caret-up fa-caret-down');
      $(this).toggleClass("preventMonth");
      touched = true;
      callResizeIframeOnParent();
    }
  });

  $(".yearUl").click(function() {
    if(touched === false){
      $(this).children(".month-version-div").toggle();
      $(this).find(".yearCarret").toggleClass('fa-caret-up fa-caret-down');
      $(this).toggleClass("preventYear");
      callResizeIframeOnParent();
    }
    touched=false;
  });
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

function openTimestamp(timestampToOpen){
  // remove other viewing version timestamp
  $(".viewing-version").each(function() {
    $(this).removeClass("viewing-version");
  });

  const year = timestampToOpen.substring(0,4);
  if (year) {
    // click on that year if not already opened
    const yearEle = $("#th_"+year)
    if (! yearEle.hasClass("preventYear")) {
      yearEle.click();
    }
    if (timestampToOpen.length >= 6) {
      // click on month if that month not already opened
      const month = timestampToOpen.substring(4,6);
      const monthEle = $("#"+year+"_"+month);
      if (! monthEle.hasClass("preventMonth")){
        monthEle.click();
      }

      const timestampEle = $("#"+timestampToOpen);
      if (timestampEle) {
        timestampEle.addClass("viewing-version");
        document.getElementById(timestampToOpen).scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
      }
    }
  }
}

function startUrlSearch(waybackURL, urlQuery, startTs, endTs, insertOnElementId, loadingElementId, typeShow) {

  var requestURL = waybackURL + ( waybackURL.endsWith("/") ? "" : "/" ) + "cdx";
  var versionsArray = [];
  var versionsURL = [];

  //var inputURL = document.getElementById('txtSearch').value;
  var inputURL = urlQuery;

  var notFoundURLSearch = false;

  loading = false;
  $( document ).ajaxStart(function() {
    loading = true;
    $( "#"+loadingElementId).show();
  });
  $( document ).ajaxStop(function() {
    loading = false;
    $( "#"+loadingElementId).hide();
  });
  $( document ).ajaxComplete(function() {
    loading = false;
    $( "#"+loadingElementId).hide();
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
      fl: 'url,timestamp,status',
      filter: '!~status:4|5',
      from: startTs,
      to: endTs
    },
    error: function() {
      // Apresenta que não tem resultados!
      createErrorPage(urlQuery, insertOnElementId);
    },
    success: function(data) {
      versionsArray = []
      if( data ) {
        var tokens = data.split('\n')

        var previousVersion = null;
        const deltaToRemoveDuplicatedEntries = 3600; // remo
        $.each(tokens, function(e){
          if(this != ""){
            var version = JSON.parse(this);
            if( !version.status || version.status[0] === '4' || version.status[0] === '5'){ /*Ignore 400's and 500's*/
              /*empty on purpose*/
            } else {
              if (previousVersion != null && isRemovePreviousVersion(previousVersion, version, deltaToRemoveDuplicatedEntries)) {
                versionsArray.pop();
                versionsURL.pop();
              } 
              if (previousVersion == null || !isRemoveCurrentVersion(previousVersion, version, deltaToRemoveDuplicatedEntries)) {
                versionsArray.push(version.timestamp);
                versionsURL.push(version.url);
                previousVersion = version;
              }
            }
          }
        });

        if(typeShow === "table") {
          const firstVersionYear = versionsArray.map(t => parseInt(t.substring(0,4))).reduce((a, b) => Math.min(a, b));
          createResultsTable(tokens.length-1, inputURL, insertOnElementId);
          createMatrixTable(waybackURL, firstVersionYear, versionsArray, versionsURL);
        } else {
          createResultsList(tokens.length-1, inputURL, insertOnElementId);
          createMatrixList(waybackURL, versionsArray, versionsURL);
        }
        attachClicks();
      } else {
        createErrorPage(urlQuery, insertOnElementId);
      }

      openTimestamp(arquivo_timestampToOpen);
      callResizeIframeOnParent();
    }
  });
}

function isRemovePreviousVersion(previousVersion, currentVersion, delta) {
  return previousVersion.status[0] === '3' && currentVersion.status[0] === '2' && timestampDifferenceInSeconds(previousVersion.timestamp, currentVersion.timestamp) <= delta;
}

function isRemoveCurrentVersion(previousVersion, currentVersion, delta) {
  return previousVersion.status[0] === '2' && currentVersion.status[0] === '3' && timestampDifferenceInSeconds(previousVersion.timestamp, currentVersion.timestamp) <= delta;
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
  const alreadySameURL = url === arquivo_urlQuery;
  if (alreadySameURL) {
    openTimestamp(timestamp);
  } else {
    // replace location to prevent the back browser button to back
    window.location.replace(getContextPath() + urlSearchFunctionalityUrl + '/' + timestamp + '/' + url);
  }
}
