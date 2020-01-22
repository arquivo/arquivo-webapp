<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<script type="text/javascript">

  function getYearTs(ts){
    return ts.substring(0, 4);
  }

  function getMonthTs(ts){
    return ts.substring(4,6);
  }


  function getYearPosition(ts){
    return parseInt(getYearTs(ts)) - 1996;
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

  function createMatrixTable(versionsArray, versionsURL){
    var today = new Date();
    numberofVersions = yyyy - 1996;
    var yyyy = today.getFullYear();
    var numberofVersions = yyyy - 1996;
    var matrix = new Array(numberofVersions);
    for (var i = 0; i < matrix.length; i++) {
      matrix[i] = [];
      var yearStr = (1996+i).toString();
      // add the headers for each year
      $("#years").append('<th id="th_'+yearStr+'" class="thTV">'+yearStr+'</th>');
    }

    for (var i = 0; i < versionsArray.length; i++) {
      var timestamp = versionsArray[i];
      var timestampStr = timestamp.toString();
      var url = versionsURL[i];
      var pos = getYearPosition(timestampStr);
      var dateFormated = getDateSpaceFormated(timestampStr);
      var shortDateFormated= getShortDateSpaceFormated(timestampStr);
      var tdtoInsert = '<td class="tdTV"><a href="//<%=collectionsHost%>/'+timestampStr+'/'+url+'" title="'+dateFormated+'">'+shortDateFormated+'</a></td>';
      matrix[pos].push(tdtoInsert);
    }

    //find which is the biggest number of versions per year and create empty tds in the other years
    var maxLength = 0;
    var lengthi =0;
    for (var i = 0; i < matrix.length; i++) {
      lengthi = matrix[i].length;
      var yearStr = (1996+i).toString();
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

    //if($('#1 td:nth-child('+String(matrix.length)+')').html() ==='&nbsp;'){ /*If last year in the table doesn't have versions show embargo message*/
    //  $('#1 td:nth-child('+String(matrix.length)+')').attr('rowspan', '999');
    //  $('#1 td:nth-child('+String(matrix.length)+')').attr('class', 'td-embargo')
    //  $('#1 td:nth-child('+String(matrix.length)+')').html('<a href="'+Content.embargoUrl+'">'+Content.embargo+'</a>');
    //}
  }
  function resizeResultsPageHeight(){
        $('#resultados-lista').css('height', ($(window).height() - $('#resultados-lista').offset().top)*0.95 );
  }

  function createResultsTable(numberOfVersions, inputURL){
      scrollLeftPosition = 0;
      /*where the scroll should start in left of table*/
      scrollOffset = 200; /*distance in px of each scroll*/

      $('<div id="resultados-url"></div>'+
        '<div id="layoutTV">'+
          '<h4 class="leftArrow"><button onclick="scrollTableLeft()" class="clean-button-no-fill"><i class="fa fa-caret-left" aria-hidden="true"></i></ion-icon></button></h4>'+
          '<h4 class="text-bold"><i class="fa fa-table"></i> '+ Content.table +' </h4>'+
          '<button class="clean-button-no-fill anchor-color faded" onclick="redirectToTable(\'list\')"><h4><i class="fa fa-list"></i> '+ Content.list +'</h4></button>'+
          '<h4 class="rightArrow"><button onclick="scrollTableRight()" class="clean-button-no-fill"><i class="fa fa-caret-right" aria-hidden="true"></i></ion-icon></button></h4>'+
        '</div>'+
        '<div class="wrap">' +
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
               '</div>'        ).insertAfter("#headerSearchDiv");

      $( document ).ready(function() {
        resizeResultsPageHeight();
        $("table").on('mousedown touchstart', function (e) {
              e.stopPropagation();
         });

      });

      window.onresize = resizeResultsPageHeight;

  }

  function redirectToTable( valueParam ) {
    window.location.href = replaceUrlParam(window.location.href, 'typeShow', valueParam);
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


  function createMatrixList(versionsArray, versionsURL){
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

      var tdtoInsert = '<a onclick="ga(\'send\', \'event\', \'Versions List\', \'Version Click\', \'//<%=collectionsHost%>/'+timestampStr+'/'+url+'\');" class="day-version-div text-center" id="'+timestampStr+'" href="//<%=collectionsHost%>/'+timestampStr+'/'+url+'" title="'+dateFormated+'">'+getDateSpaceFormatedWithoutYear(timestampStr)+'</a>';

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
        $("#th_"+yearStr+" div:first-child").after('<div class="col-xs-6 numberVersions no-padding-left text-right"><h4>'+numberOfVersionsCurrentYear.toString() + ' '+Content.searchVersions+'    <i class="fa fa-caret-down iCarret yearCarret" aria-hidden="true"></i></h4></div>');
      }else if(numberOfVersionsCurrentYear === 1 ){
        $("#th_"+yearStr+" div:first-child").after('<div class="col-xs-6 numberVersions no-padding-left text-right"><h4>'+numberOfVersionsCurrentYear.toString() + ' '+Content.searchVersions+'    <i class="fa fa-caret-down iCarret yearCarret" aria-hidden="true"></i></h4></div>');
      }else{
        /*Year with no versions maybe delete if we don't want to present empty years?*/
        $("#th_"+yearStr+" div:first-child").after('<div class="numberVersions no-padding-left text-right"><h4>'+numberOfVersionsCurrentYear.toString() + ' '+Content.searchVersions+'    <i class="fa fa-caret-down iCarretDisabled yearCarret" aria-hidden="true"></i></h4></div>');
         $("#th_"+yearStr).addClass("noVersions");
      }
    }

  }



  function createResultsList(numberOfVersions, inputURL){

      $('<div id="resultados-url">'+Content.resultsQuestion+' \'<a href="searchMobile.jsp?query=%22'+inputURL+'%22">'+inputURL+'</a>\'</div>'+
        '<div id="layoutTV">'+
          '<button class="clean-button-no-fill anchor-color faded" onclick="redirectToTable(\'table\')"><h4><i class="fa fa-table"></i> '+Content.table+' </h4></button>'+
          '<h4 class="text-bold"><i class="fa fa-list"></i> '+Content.list+'</h4>'+
        '</div>'+
            '<div class="wrap">' +
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
        '</div>').insertAfter("#headerSearchDiv");
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

  function createErrorPage(){
    $('<div id="conteudo-resultado-url" class="container-fluid col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 col-xl-offset-4 col-xl-4">'+
             '  <div id="first-column">&nbsp;</div>'+
             '  <div id="second-column">'+
             '    <div id="search_stats"></div>'+
             '    <div id="conteudo-pesquisa-erro">'+
                  '<div class="alert alert-danger col-xs-12 my-alert break-word"><p>'+Content.noResultsFound+' <span class="text-bold"><%=urlQuery%></span></p></div>'+
                  '<div id="sugerimos-que" class="col-xs-12 no-padding-left suggestions-no-results">'+
                      '<p class="text-bold">'+Content.suggestions+'</p>'+
                    '<ul>'+
                      '<li>'+Content.checkSpelling+'</li>'+
                      '<li><a class="no-padding-left" href="'+Content.suggestUrl+'<%=urlQuery%>">'+Content.suggest+'</a> '+Content.suggestSiteArchived+'</li>'+
                      '<li><a class="no-padding-left" href="http://timetravel.mementoweb.org/list/1996/<%=urlQuery%>">'+Content.mementoFind+'</a>.</li>'+
                    '</ul>'+
                  '</div>'+
                  '</div>'+
                '</div>'+
             '</div>').insertAfter("#headerSearchDiv");
  }


      var urlsource = "<%=urlQuery%>" ;
      var startDate = "<%=dateStartString%>";
      var startYear = startDate.substring(6,10)
      var startMonth = startDate.substring(3,5);
      var startDay = startDate.substring(0,2);
      var startTs = startYear+startMonth+startDay+'000000';

      var endDate = "<%=dateEndString%>";
      var endYear = endDate.substring(6,10)
      var endMonth = endDate.substring(3,5);
      var endDay = endDate.substring(0,2);
      var endTs = endYear+endMonth+endDay+'000000';

      var requestURL = "//<%=collectionsHost%>/" + "cdx";
      var versionsArray = [];
      var versionsURL = [];

      var inputURL = document.getElementById('txtSearch').value;
      var notFoundURLSearch = false;

    loading = false;
    $( document ).ajaxStart(function() {
      loading = true;
      $( "#loadingDiv").show();
    });
    $( document ).ajaxStop(function() {
      loading = false;
      $( "#loadingDiv").hide();
    });
    $( document ).ajaxComplete(function() {
      loading = false;
      $( "#loadingDiv").hide();
    });

      $.ajax({
      // example request to the cdx-server api - 'http://arquivo.pt/pywb/replay-cdx?url=http://www.sapo.pt/index.html&output=json&fl=url,timestamp'
         url: requestURL,
         cache: true,
         data: {
            output: 'json',
            url: urlsource,
            fl: 'url,timestamp,status',
            filter: '!~status:4|5',
            from: startTs,
            to: endTs
         },
         error: function() {
           // Apresenta que não tem resultados!
           createErrorPage();
         },
         dataType: 'text',
         success: function(data) {
            versionsArray = []
            if( data ) {

              var tokens = data.split('\n')
              $.each(tokens, function(e){
                  if(this != ""){
                      var version = JSON.parse(this);
                      if( !version.status || version.status[0] === '4' || version.status[0] === '5'){ /*Ignore 400's and 500's*/
                        /*empty on purpose*/
                      }
                      else{
                        versionsArray.push(version.timestamp);
                        versionsURL.push(version.url);
                      }

                  }

              });

              var typeShow = $('#typeShow').val().toString();

              if(typeShow === "table") {
                  createResultsTable(tokens.length-1, inputURL);
                  createMatrixTable(versionsArray, versionsURL);
              } else {
                  createResultsList(tokens.length-1, inputURL);
                  createMatrixList(versionsArray, versionsURL);
              }
              attachClicks();

            } else {
                createErrorPage();
            }

         },

         type: 'GET'
      });

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
      }
    });

      $(".yearUl").click(function() {
        if(touched === false){
          $(this).children(".month-version-div").toggle();
          $(this).find(".yearCarret").toggleClass('fa-caret-up fa-caret-down');
          $(this).toggleClass("preventYear");
        }
        touched=false;
      });
  }

</script>