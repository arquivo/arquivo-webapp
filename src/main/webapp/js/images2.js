 jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();


imageObjs = []; /*Global array containing images*/
noMoreResults = false; /*Global variable control if there are no more results*/

function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
}


function shortenURL( longURL ) {
    gapi.client.setApiKey('AIzaSyB7R8gTEu34CTfTBL8rolvjZOchKg2RyAA');
    gapi.client.load('urlshortener', 'v1', function() { 
        var request = gapi.client.urlshortener.url.insert({
            'resource': {
            'longUrl': longURL
            }
        });
        request.execute(function(response) {
            if (response.id != null) {
              $('#shortURL').html(response.id);
              addthis.update('share', 'url', $('#shortURL').html());
            }
            else {
                alert("Error: creating short url \n" + response.error);
            }
            return false;
        });
    });
}

/*When user presses enter submits the input text*/
$(function() {
    $("#txtSearch").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            $('#btnSubmit').click();
            return false;
        } else {
            return true;
        }
    });
}); 

/*Check if hash exists, if yes, hide the div. Logic for the browser back button.*/
var checkShowSlides = false;
setInterval(function() {
  var lastHash = window.location.hash || "nothing";
  if (lastHash != window.location.hash) {
    if( checkShowSlides ) {
      openImageViewer = false;
      $('#showSlides').hide();  
      checkShowSlides = false;
    }
  } else {
    checkShowSlides = true;
  }
}, 100);

function loadingFinished(showNextPageButton){
    if(showNextPageButton){
      $('#nextImage').css('display','inline-block');
    } else {
      $('#nextImage').attr("style","display:none!important");
    }
    $('#previousImage').css('display','inline-block');

    $('#loadingDiv').hide();

}

totalPosition = 0; //global variable
currentOffset= 0;

function doInitialSearch(){
    /*startPosition = 0;*/
    searchImages(startPosition);
}

lastImageViewedByUser = -1; /*Global var refers to the lastImage the user*/

function generateHash( position ){
  window.location.hash = "card";
}

function removeHash( ) {
  history.pushState(null, null, window.location.href.split('#')[0]);
  window.location.hash = ''; 
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function openImage(position){
  lastImageViewedByUser = parseInt(position);
  openImageViewer = true;
  //imageHref = getCurrentImageHref();
  $('#showSlides').show();
  var slides = document.querySelector('ion-slides');
  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  slides.options = {
    initialSlide: 1,
    speed: 400,
    noSwipingClass: 'hide-me-class-swiper'
  }
 
  openLazyLoadOriginalImage(position);

  $('ion-slides')[0].slideTo($('ion-slides')[0].slideTo($('#testViewer'+position).prevAll().length));
 
  sleep(500).then(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  
  // hide search results
  document.getElementById("headerSearchDiv").style.display = "none";
  sendOpenImageTrackingAsAjax(position);
}

function sendOpenImageTrackingAsAjax(position) {
  const imageElement = $('#testViewer'+position+ ' img');
  const imageTrackingURL = imageElement.attr('data-openImageTrackingURL');
  //console.log("Sending open image to url: " + imageTrackingURL);
  $.ajax({
       url: imageTrackingURL,
       dataType: 'text',
       type: 'GET',
       success: function(data) {
         console.log('Success sending open image.');
       }
     });
}

function openLazyLoadOriginalImage(position) {
  function loadImage(position) {
    // load original image src
    const imageElement = $('#testViewer'+position+ ' img');
    if (imageElement && !imageElement.attr('src')) {
      // set img src attribute with data-src attribute
      imageElement.attr('src', imageElement.attr('data-src'));
    }
  }
  loadImage(position); // current
  loadImage(position-1); // previous
  loadImage(position+1); // next
}

function closeImage(position){  
  openImageViewer = false;
  $('#showSlides').hide();

  // show again the search results
  document.getElementById("headerSearchDiv").style.display = "block";
}

function previousImage(){
    openImage(lastImageViewedByUser-1);
}
function nextImage(){
    openImage(lastImageViewedByUser+1);
}

async function slideChanged() {
  const idx = await document.querySelector('ion-slides').getActiveIndex();
  if (Number.isInteger(idx)) {
    lastImageViewedByUser = idx;
    openLazyLoadOriginalImage(idx);
  }
}

function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

function checkElement(selector) {
    if (document.querySelector(selector) === null) {
        return rafAsync().then(() => checkElement(selector));
    } else {
        return Promise.resolve(true);
    }
}

function insertInPosition(position, imageObj, imageHeight, expandedImageHeight, expandedImageWidth, currentResultGlobalPosition){
  const maxImageHeight = 200;
  const realImageHeight = imageHeight <= maxImageHeight ? imageHeight : maxImageHeight;
  const displayUrlMaxWidth = (expandedImageWidth * realImageHeight / expandedImageHeight ) + 20;
  const maxImageExpandHeight = 400;
  const maxImageDivWidth =  ( ($(window).width() * 0.6) -70 ) * 0.95 ;

  if( expandedImageHeight > maxImageExpandHeight ) {
    expandedImageHeight = maxImageExpandHeight;
  } 
  else if ( expandedImageWidth > maxImageDivWidth ) {
    //resize height in porportion to resized width
    const ratio = maxImageDivWidth/expandedImageWidth;
    expandedImageHeight = expandedImageHeight * ratio;
  }
  const urlToPresentation = ARQUIVO.formatURLForPresentation(imageObj.pageURL);

  var contentToInsert = ''+
  '<div  class="imageContent" position='+position+' id="imageResults'+position+'" onclick="ga(\'send\', \'event\', \'Search result\', \'Image search\', \'Result position\', '+currentResultGlobalPosition+'); openImage('+position+'); generateHash(\''+position+'\');">'+
  '   <img  height="'+realImageHeight.toString()+'" src="'+imageObj.src+'"/>'+
  '   <p class="green image-display-url" style="max-width: '+displayUrlMaxWidth+'px" title="'+urlToPresentation+'">→ '+urlToPresentation+'</p>'+
  '   <p class="date image-display-date" id="date'+position+'">'+ARQUIVO.formatTimestampToPresentation(imageObj.timestamp)+'</p>'+
  '   <div id="arrowWrapper'+position+'" class="arrowWrapper" >'+
  '       <div id="arrow'+position+'" class="arrow"/></div>' +
  '   </div>'+ 
  '</div>';

  if($("#expandedImageViewers > .swiper-wrapper") !== null){
    $('#expandedImageViewers > .swiper-wrapper').append(insertImageViewer(imageObj, position));  
  }
  else{
    console.log('unexpected error loading image viewer');      
  }

  imageObj.expandedImageWidth = expandedImageWidth;
  imageObj.expandedImageHeight = expandedImageHeight;
  imageObjs[position] = imageObj;

  var lengthofUL = $('#photos .imageContent').length;
  if(lengthofUL === 0){ /*list is empty only the hidden li*/
    $('#photos').prepend(contentToInsert);
  }
  else{
    var inserted = false;

    $('#photos .imageContent').each(function(i, obj) {
      if( position < i ){
        $( obj ).insertBefore(contentToInsert);
        /*add logic to new column layout*/
        inserted = true;
        return;
      }
    });

    if(inserted === false){
      $('#photos').append(contentToInsert);
    }
  }
}    

function  insertImageViewer(imageObj, position){
return ''+
//image-expanded-full-width
/*If landscaped image show it full width on small screens*/

  '<ion-slide id="testViewer'+position+'" class="height-vh image-mobile-expanded-div no-outline" tabindex="1">'+
      '<div onclick="closeImage('+position+',false); removeHash();" class="image-mobile-expanded-viewer-mask no-outline"></div>'+
      '<div class="row full-height no-outline">'+
          '<div id="insert-card-'+position+'" class="full-height text-right">'+
              '<ion-card id="card'+position+'" class="card-height">'+
                 '<a href="'+waybackURL+'/'+imageObj.pageTstamp+'/'+imageObj.pageURL+'">'+
                    '<img ' + (parseInt(imageObj.expandedWidth) >$( window ).width() ? 'class="image-expanded-viewer image-expanded-full-width" ' : 'class="image-expanded-viewer" ') + 'data-src="'+imageObj.currentImageURL+'" data-openImageTrackingURL="'+imageObj.openImageTrackingURL+'" />'+
                 '</a>'+
                 '<ion-row class="image-viewer-expanded-main-actions">'+
                      '<ion-col size="6" class="text-left"><a href="'+waybackURL+'/'+imageObj.pageTstamp+'/'+imageObj.pageURL+'"><ion-button size="small" class="visit-page border-mobile" fill="clear"><ion-icon name="globe" class="middle"></ion-icon><span class="middle"><h5>&nbsp;'+Content.images.viewer.visit+'</h5></span></ion-button></a></ion-col>'+
                      '<ion-col size="6" ><ion-button size="small" class="view-details border-mobile" onclick="viewDetails('+position+')" fill="clear" ><ion-icon name="information-circle-outline" class="middle"></ion-icon><span class="middle"><h5>&nbsp;'+Content.images.details.details+'</h5></span></ion-button></ion-col>'+
                  '</ion-row>'+
                  '<ion-row>'+
                      '<h4 class="text-left">'+Content.images.details.image+'</h4>'+                
                  '</ion-row>'+
                  '<ion-card-content>'+                
                      '<ion-list class="imageList selected">'+
      ( imageObj.title !== ""  ? ' <ion-item class="item-borderless image-viewer-img-title" lines="none" ><h5><em>'+ Content.images.details.title +' </em>&nbsp;<a class="imageHref" target="_blank" href="'+imageObj.currentImageURL+'">' +imageObj.title+'</a></h5></ion-item>':'') +
      ( imageObj.imgAlt !== "" &&  imageObj.title == ""  ? ' <ion-item id="imgTitleLabel'+position+'" lines="none"><a class="imageHref" target="_blank" href="'+imageObj.currentImageURL+'">' +imageObj.imgAlt+'</a></ion-item>':'') +  
                          '<ion-item lines="none" class="image-viewer-img-src"><h5><em>'+ Content.images.details.url +' </em> ' +ARQUIVO.formatURLForPresentation(imageObj.imgSrc)+'</h5></ion-item>'+
                          '<ion-item lines="none" class="image-viewer-img-mime-type-resolution"><h5><em>'+ Content.images.details.resolution +' </em> '+imageObj.imgMimeType+' '+parseInt(imageObj.expandedWidth)+' x '+parseInt(imageObj.expandedHeight)+'</h5></ion-item>'+
                          '<ion-item lines="none" class="image-viewer-img-timestamp"><h5><em>'+ Content.images.details.timestamp +' </em> '+ARQUIVO.formatTimestampToPresentation(imageObj.timestamp)+'</h5></ion-item>'+
                      '</ion-list>'+
                  '</ion-card-content>'+  
                  '<ion-row>'+
                      '<h4 class="text-left">'+Content.images.details.page+'</h4>'+                
                  '</ion-row>'+
                  '<ion-card-content>'+                
                      '<ion-list>'+
      '                       <ion-item class="item-borderless image-viewer-page-title" lines="none" ><h5><em>'+ Content.images.details.title +' </em>&nbsp;<a target="_blank" href="'+waybackURL+'/'+imageObj.pageTstamp+'/'+imageObj.pageURL+'">'+imageObj.pageTitle+'</a></h5></ion-item>'+
      '                       <ion-item lines="none" class="image-viewer-page-url"><h5><em>'+ Content.images.details.url +' </em> '+ARQUIVO.formatURLForPresentation(imageObj.pageURL)+'</h5></ion-item>'+
      '                       <ion-item lines="none" class="image-viewer-page-timestamp"><h5><em>'+ Content.images.details.timestamp +' </em> '+ARQUIVO.formatTimestampToPresentation(imageObj.pageTstamp)+'</h5></ion-item>'+
                      '</ion-list>'+
                  '</ion-card-content>'+                                
              '</ion-card> '+
           /*  (parseInt(imageObj.expandedWidth) > $( window ).width() ? ''+
             '<ion-icon id="close'+position+'" name="close" class="closeCard" size="large" onclick = "closeImage('+position+',false)"></ion-icon>' : '' +*/
             '<ion-icon id="close'+position+'" name="close" class="closeIt" size="large" onclick = "closeImage('+position+',false); removeHash();"></ion-icon>' +              /*change to closeIt*/
          '</div>'+
      '</div>'+    
  '</ion-slide>'; 
}

function viewDetails(position){
  imageObj = imageObjs[position];

  if($('#detailsCard'+position).length == 0) {
    var detailsCard = ''+
    '<ion-card id="detailsCard'+position+'" class="card-height">'+
      '<ion-row>'+
        '<h3 class="text-left">'+Content.images.details.details+'</h4>'+                
      '</ion-row>'+            
      '<ion-row>'+
        '<h4 class="text-left">'+Content.images.details.page+'</h4>'+                
      '</ion-row>'+      
      '<ion-card-content>'+
        '<ion-list>'+
         '<ion-item class="item-borderless" lines="none" ><h5><em>'+Content.images.details.url+'</em>&nbsp;<a href="'+waybackURL+'/'+imageObj.pageTstamp+'/'+imageObj.pageURL+'">'+imageObj.pageURL+'</a></h5></ion-item>'+
          '<ion-item lines="none" ><h5><em>'+Content.images.details.timestamp+'</em> '+imageObj.pageTstamp+'</h5></ion-item>'+
          '<ion-item lines="none" ><h5><em>'+Content.images.details.title+'</em> '+imageObj.pageTitle+'</h5></ion-item>'+
        '</ion-list>'+
      '</ion-card-content>'+
      '<ion-row>'+      
        '<h4 class="text-left">'+Content.images.details.image+'</h4>'+                
      '</ion-row>'+      
      '<ion-card-content>'+
        '<ion-list>'+
          '<ion-item class="item-borderless" lines="none" ><h5><em>'+Content.images.details.url+'</em>&nbsp;<a href="'+waybackURL+'/'+imageObj.timestamp+'im_/'+imageObj.imgSrc+'">'+imageObj.imgSrc+'</a></h5></ion-item>'+
          '<ion-item lines="none" ><h5><em>'+Content.images.details.timestamp+'</em> '+imageObj.timestamp+'</h5></ion-item>'+
          (imageObj.titleFull != "" ? '<ion-item lines="none" ><h5><em>'+Content.images.details.title+'</em> '+imageObj.titleFull+'</h5></ion-item>': '') +
          (imageObj.imgAltFull != "" ? '<ion-item lines="none" ><h5><em>'+Content.images.details.alt+'</em> '+imageObj.imgAltFull+'</h5></ion-item>': '') +
          '<ion-item lines="none" ><h5><em>'+Content.images.details.resolution+'</em> '+parseInt(imageObj.expandedWidth)+' x '+parseInt(imageObj.expandedHeight)+' pixels</h5></ion-item>'+
          '<ion-item lines="none" ><h5><em>'+Content.images.details.mimetype+'</em> '+imageObj.imgMimeType+'</h5></ion-item>'+
          '<ion-item lines="none" ><h5><em>'+Content.images.details.safesearch+'</em> '+imageObj.safe+'</h5></ion-item>'+
        '</ion-list>'+
      '</ion-card-content>'+      
      '<ion-row>'+      
        '<h4 class="text-left">'+Content.images.details.collection+'</h4>'+                
      '</ion-row>'+      
      '<ion-card-content>'+
        '<ion-list>'+
          '<ion-item class="item-borderless" lines="none" ><h5><em>'+Content.images.details.name+'</em> '+imageObj.collection+'</h5></ion-item>'+
        '</ion-list>'+
      '</ion-card-content>'+      
    '</ion-card>'+
    '<ion-icon id="closeCard'+position+'" name="close" class="closeItAbsolute" size="large" onclick="closeDetails('+position+')"></ion-icon>';

    $('#insert-card-'+position).append(detailsCard);
    $('#card'+position).hide();
    $('#closeCard'+position).show();
  }
  else{
    $('#card'+position).hide();
    $('#detailsCard'+position).show()
    $('#closeCard'+position).show();
  }

}

function swipeRightViewer(position){
  console.log('swiping right' + position);
  var previous = $('#testViewer'+position).prev()
  if(previous[0] != null){
    $('#testViewer'+position).fadeOut("slow");
    previous.fadeIn("slow");
  }
}

function swipeLeftViewer(position){
  console.log('swiping left' + position);
  var next = $('#testViewer'+position).next()
  if(next[0] != null){
    $('#testViewer'+position).fadeOut("slow");
    next.fadeIn("slow");
  }
}

function detectTouchElement(selector){
  console.log('position: ' + selector);

  window.addEventListener('load', function(){
      console.log('loaded position ' + selector);
      var touchsurface = document.getElementById('insert-card-'+selector),
          startX,
          startY,
          dist,
          threshold = 10, //required min distance traveled to be considered swipe
          allowedTime = 400, // maximum time allowed to travel that distance
          elapsedTime,
          startTime
   
      function handleswipeRight(isrightswipe){
          if (isrightswipe){
             swipeRightViewer(selector);
          }
      }
      function handleswipeLeft(isleftswipe){
          if (isleftswipe){
             swipeLeftViewer(selector);  
          }
      }      
   
      touchsurface.addEventListener('touchstart', function(e){
          var touchobj = e.changedTouches[0]
          dist = 0
          startX = touchobj.pageX
          startY = touchobj.pageY
          startTime = new Date().getTime() // record time when finger first makes contact with surface
          e.preventDefault()
      }, false)
   
      touchsurface.addEventListener('touchmove', function(e){
          e.preventDefault() // prevent scrolling when inside DIV
      }, false)
   
      touchsurface.addEventListener('touchend', function(e){
          var touchobj = e.changedTouches[0]
          dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
          elapsedTime = new Date().getTime() - startTime // get time elapsed
          // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
          if(dist >= 0){
            var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 200)
            handleswipeRight(swiperightBol)
          }
          else{
            var swiperleftBol = (elapsedTime <= allowedTime && Math.abs(dist) >= threshold && Math.abs(touchobj.pageY - startY) <= 200)
           handleswipeLeft(swiperleftBol) 
          }
          e.preventDefault()
      }, false)
   
  }, false) // end window.onload
}


/*Closes the Details Card and Opens Image viewer card*/
function closeDetails(position){
  $('#detailsCard'+position).hide();
  $('#closeCard'+position).hide();
  $('#card'+position).show();
}

function searchImagesJS(dateStartWithSlashes, dateEndWithSlashes, safeSearchOption,startIndex){
    var client_id = ARQUIVO.getClientId(20);
    var search_id = ARQUIVO.generateId(20);
    var trackingId = client_id + '_' + search_id;

    if( safeSearchOption == "null"){
        safeSearchOption = "on";
    }
    var query;
    var input = $('#txtSearch').val();

    var dateStart=$('#dateStart_top').val().substring($('#dateStart_top').val().length - 4) +''+  $('#dateStart_top').val().substring(3,5) +''+ $('#dateStart_top').val().substring(0,2)+ '000000' ;
    
    var dateEnd= $('#dateEnd_top').val().substring($('#dateEnd_top').val().length - 4) +''+  $('#dateEnd_top').val().substring(3,5) +''+ $('#dateEnd_top').val().substring(0,2)+'235959';
    currentStart = startIndex;
    
    var extractedQuery = ARQUIVO.extractQuerySpecialParameters(input);

    // Add information to export SERP functionality with query arguments
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.queryArgument, Content.exportSERP.imageSearch.queryValue);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.query, extractedQuery.query);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.from, dateStart);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.to, dateEnd);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.offset, startIndex);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.maxItems, numrows);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.siteSearch, extractedQuery.site);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.type, extractedQuery.type);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.imageSearch.collection, extractedQuery.collection);
    ARQUIVO.exportSERPSaveLine(); // Add an empty line after all the arguments

    $.ajax({
       url: imageSearchAPI,      
       data: {
          q: extractedQuery.query,
          from: dateStart,
          to: dateEnd,
          offset: startIndex,
          maxItems: numrows,
          more: "imgDigest,pageProtocol,pageHost,pageImages,safe",
          siteSearch: extractedQuery.site,
          type: extractedQuery.type,
          collection: extractedQuery.collection,
          trackingId: trackingId
       },
           
       timeout: 300000,
       error: function() {
       },
       dataType: 'text',
       success: function(data) {
        $('#imagesDefaultTextDiv').hide(); /*Hiding default message*/

        var responseJson = $.parseJSON(data);

        startIndex = parseInt(startIndex)
        numrows = parseInt(numrows)
        var totalResults = responseJson.totalItems;
        var totalResultsShowTop = totalResults;
        var showNextPageButton = ((startIndex + numrows) >= totalResults) ? false: true;
        

        if ( totalResults === 0 || startIndex >= totalResults){
            createErrorPage();
            noMoreResults=true;
            loadingFinished(showNextPageButton);
        } else{
            
            var currentResults
            if(totalResults > numrows){
              currentResults = responseJson.numberOfResponseItems;
            }else{
              currentResults = totalResults;
              noMoreResults=true;
            }
            var resultsToLoad = currentResults;

            // add headers to export SERP
            ARQUIVO.exportSERPSaveLine("Results");

            ARQUIVO.exportSERPSaveLine(
                Content.exportSERP.imageSearch.year,
                Content.exportSERP.imageSearch.month,
                Content.exportSERP.imageSearch.day,
                Content.exportSERP.imageSearch.imgTstamp,
                Content.exportSERP.imageSearch.imgHeight,
                Content.exportSERP.imageSearch.imgWidth,
                Content.exportSERP.imageSearch.imgSrc,
                Content.exportSERP.imageSearch.imgLinkToArchive,
                Content.exportSERP.imageSearch.collection,
                Content.exportSERP.imageSearch.imgMimeType,
                Content.exportSERP.imageSearch.imgAlt,
                Content.exportSERP.imageSearch.imgTitle,
                Content.exportSERP.imageSearch.pageTstamp,
                Content.exportSERP.imageSearch.pageURL,
                Content.exportSERP.imageSearch.pageLinkToArchive,
                Content.exportSERP.imageSearch.pageTitle
            );
            
            for (var i=0; i< currentResults; i++){
                var currentDocument = responseJson.responseItems[i];
                if (typeof currentDocument === 'undefined' || !currentDocument || typeof currentDocument.imgTstamp === 'undefined' || !currentDocument.imgTstamp){                    
                    continue;
                }
                var currentResultGlobalPosition = parseInt(startIndex) + i + 1;

                // check https://github.com/arquivo/pwa-technologies/issues/978
                var fixedImgSrc = new URL(currentDocument.imgSrc)
                currentDocument.imgSrc = fixedImgSrc.href

                var currentImageURL = waybackURL +'/' + currentDocument.imgTstamp +'im_/'+currentDocument.imgSrc;
                var imageDigest = currentDocument.imgDigest;
                
                var pageURL = currentDocument.pageURL;
                // var thumbnail = currentImageURL;

                
                imageObj = new Image();
                imageObj.timestamp = currentDocument.imgTstamp.toString();
                
                imageObj.pageURL = pageURL.toString();
                imageObj.currentImageURL = currentImageURL.toString();
                
                imageObj.position = totalPosition;
                
                imageObj.expandedHeight = currentDocument.imgHeight;
                imageObj.expandedWidth = currentDocument.imgWidth;
                imageObj.imgMimeType= currentDocument.imgMimeType.substring(6,currentDocument.imgMimeType.length);

                if (typeof imageObj.imgAlt === 'undefined' || !imageObj.imgAlt) {
                  imageObj.imgAlt ='';
                } else {
                  imageObj.imgAlt = currentDocument.imgAlt[0];
                }
                imageObj.imgAltFull = imageObj.imgAlt;
                if(imageObj.imgAlt.length > 40) {imageObj.imgAlt = imageObj.imgAlt.substring(0,37) + "...";}

                if (typeof imageObj.title === 'undefined' || !imageObj.title) {
                  imageObj.title ='';
                } else {
                  imageObj.title = currentDocument.imgTitle[0];
                }
                imageObj.titleFull = imageObj.title;
                if(imageObj.title.length > 40) {imageObj.title = imageObj.title.substring(0,37) + "...";}

                imageObj.safe = currentDocument.safe;
                imageObj.pageTstamp = currentDocument.pageTstamp.toString();
                imageObj.pageTitle = currentDocument.pageTitle;

                if (typeof imageObj.pageTitle === 'undefined' || !imageObj.pageTitle) {
                  imageObj.pageTitle ='';
                }
                imageObj.collection = currentDocument.collection;
                imageObj.imgSrc = currentDocument.imgSrc;

                totalPosition = totalPosition + 1;

                if(currentDocument.imgThumbnailBase64) {
                  imageObj.src = "data:" + currentDocument.imgMimeType + ";base64," + currentDocument.imgThumbnailBase64;
                } else if (resizeURL){
                  imageObj.src = resizeURL + "/" + encodeURIComponent(currentImageURL)
                } else {
                  imageObj.src = currentImageURL;
                }

                imageObj.currentResultGlobalPosition = currentResultGlobalPosition;
                imageObj.openImageTrackingURL = "/image/view/" + trackingId + "_" + (i+1) + '/' + currentDocument.imgTstamp + '/' +currentDocument.imgSrc;

                totalResults --;
                resultsToLoad --;

                var insertPosition = (parseInt(imageObj.position)+parseInt(currentStart));

                insertInPosition(insertPosition, imageObj, imageObj.height, imageObj.expandedHeight, imageObj.expandedWidth, imageObj.currentResultGlobalPosition);

                if(resultsToLoad <= 0){
                    loadingFinished(showNextPageButton);
                }

                // append result so it can be exported
                var year = parseInt(currentDocument.imgTstamp.toString().substring(0,4));
                var month = Content.months[currentDocument.imgTstamp.toString().substring(4,6)];
                var day = parseInt(currentDocument.imgTstamp.toString().substring(6,8));

                ARQUIVO.exportSERPSaveLine(
                  year,
                  month,
                  day,
                  currentDocument.imgTstamp,
                  currentDocument.imgHeight,
                  currentDocument.imgWidth,
                  currentDocument.imgSrc,
                  currentDocument.imgLinkToArchive,
                  currentDocument.collection,
                  currentDocument.imgMimeType,
                  currentDocument.imgAlt,
                  currentDocument.imgTitle,
                  currentDocument.pageTstamp,
                  currentDocument.pageURL,
                  currentDocument.pageLinkToArchive,
                  currentDocument.pageTitle
                );
            }
            ARQUIVO.displayEstimatedResults(totalResultsShowTop);
        }
        ARQUIVO.exportSERPFinishSearch('image_search', totalResultsShowTop);
       },
       type: 'GET'
    });

}

$(document).ready(function() {     
    $(document).on('click', '#dButton', function() {
      var position =  $(this).attr('position');
      var imageObj = imageObjs[position]; /*get Current Image Object*/
      
      $("#dialog").dialog('open');

      /*If click anywhere outside modal lets close it*/
      $(document).on('click', function(e) {
            if (e.target.id !== 'dialog'  && !$(e.target).parents("#dialog").length) {
                $("#dialog").dialog('close');
                $(this).off(e);
            }
            return false;            
        });      
      return false;
    });
    $(document).on('click', '#dialogClose', function() {
      $("#dialog").dialog('close'); 
      return false;
    });
    removeHash();
});

function createErrorPage(){
  $(ARQUIVO.getSearchNoResultsHtml()).insertBefore("#photos");    
}

document.addEventListener('keydown', function(evt) {
  evt = evt || window.event;
  
  // When pressing escape key close image
  var isEscape = false;
  if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
  } else {
      isEscape = (evt.keyCode === 27);
  }
  if (isEscape) {
      closeImage();
  }

  // When pressing left key go to previous image
  var isArrowLeft = false;
  if ("key" in evt) {
      isArrowLeft = (evt.key === "Left" || evt.key === "ArrowLeft");
  } else {
      isArrowLeft = (evt.keyCode === 37);
  }
  if (isArrowLeft && $('#showSlides').is(":visible")) {
      previousImage();
  }

  // When pressing rigth image go to next image
  var isArrowRigth = false;
  if ("key" in evt) {
      isArrowRigth = (evt.key === "Right" || evt.key === "ArrowRight");
  } else {
      isArrowRigth = (evt.keyCode === 39);
  }
  if (isArrowRigth && $('#showSlides').is(":visible")) {
      nextImage();
  }
});
