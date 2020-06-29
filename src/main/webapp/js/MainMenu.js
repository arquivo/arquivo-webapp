
var MENU = MENU || (function(){
    function replaceAll(str, needle, replacement ) {
        return str.split(needle).join(replacement);
    }
    function getImageHref(position){
        return $('ion-slide:nth-child('+(position)).find('.imageHref').attr('href');
    }
    function getSlidePosition(){
        console.log('slides length:' + $('ion-slide').length);
        for(i=0; i< $('ion-slide').length; i++){
            console.log('element i: ' + i);
            console.log('element left offset: ' + $('ion-slide:nth-child('+(i+1)+')').offset().left);
            if($('ion-slide:nth-child('+(i+1)+')').offset().left >= -10  && $('ion-slide:nth-child('+(i+1)+')').offset().left <= 10){
                console.log('found posistion: ' + i);
                return i+1
            }
        }
        return -1
    }
    function menuNewAdvancedSearch(path) {
        var newURL = path;
        var txtSearchInput = document.getElementById('txtSearch');
        if (txtSearchInput) {
            var searchValue = txtSearchInput.value.toString();
            if(searchValue !='' && searchValue != undefined){
                newURL += "&query="+ARQUIVO.encodeHtmlEntities( searchValue );
            }
        }
        window.location.href = newURL;
    }

    return {
        init : function() {
            document.write(''+
                '<div class="swiper-container">'+
                    '<div id="menuWrapper" class="swiper-wrapper">'+
                        '<div class="swiper-slide content"><div id="mainMask"></div>');     
            this.attachMask();
        },
        close: function(){
            document.write( '</div></div></div>');
            $('.swiper-wrapper').prepend(
                            '<div id="menuSwiperSlide" class="swiper-slide menu swiper-slide-prev">' +       
                                '<div class="main-menu-top-div">'+
                                    '<h4>&nbsp;</h4>'+
                                    '<button href="#" onclick="MENU.goToContent()" class="close-functions clean-button-no-fill">&#10005;</button>' +
                                '</div>'+
                                '<button class="clean-button" id="changeLanguage" onclick="MENU.changeLanguage();" ><h4><i class="fa fa-flag padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.otherLanguage+'</h4></button>'+
                                '<button id="cp-link" class="clean-button" onclick="MENU.copyLink();"><h4><i class="fa fa-link padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.copy+'</h4></button>' +
                                '<button class="clean-button" id="pagesMenu" onclick="MENU.pagesClick();"><h4><i class="fa fa-globe padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.pages+'<i id="pagesCarret" class="fa fa-caret-down iCarret shareCarret pull-right" aria-hidden="true"></i></h4></button>'+      
                                '<div id="pageOptions">'+                                                           
                                    '<a href="/page/search?l='+language+'" onclick=""><h4 class="submenu"><i class="fa fa-search padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.home+'</h4></a>' +
                                    '<button class="clean-button" id="advancedSearch" onclick="MENU.advancedPagesClick();"><h4 class="submenu"><i class="fa fa-search-plus padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.advanced+'</h4></button>' +                          
                                '</div>'+
                                '<button class="clean-button" id="imagesMenu" onclick="MENU.imagesClick();"><h4><i class="fa fa-image padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.images+'<i id="imagesCarret" class="fa fa-caret-down iCarret shareCarret pull-right" aria-hidden="true"></i></h4></button>'+
                                '<div id="imageOptions">'+                                                          
                                    '<a href="/image/search?l='+language+'" onclick=""><h4 class="submenu"><i class="fa fa-search padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.home+'</h4></a>' +
                                    '<button class="clean-button" id="advancedImages" onclick="MENU.advancedImagesClick();"><h4 class="submenu"><i class="fa fa-search-plus padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.advanced+'</h4></button>' +             
                                '</div>'+                                                                               
                                '<a href="//sobre.arquivo.pt/'+language+'" onclick=""><h4><i class="fa fa-info-circle padding-right-menu-icon" aria-hidden="true"></i> '+Content.topbar.menu.about+'</h4></a>'+                           
                            '</div>');
            this.attachKeyBoardEvent();

            $('.swiper-wrapper').append(''+
                '<div class="swiper-slide replayMenu swiper-slide-next">'+
                    '<div class="main-menu-top-div">'+
                        '<h4>&nbsp;</h4>'+
                        '<button href="#" onclick="MENU.goToContent()" class="close-functions clean-button-no-fill">&#10005;</button>' +
                    '</div>'+
                    '<a class="exportSERPOptionsMenuButton" id="exportSERPOptionsMenuButtonXLSX" href="javascript:void(0)"><h4><i class="export-serp-icon"></i>'+Content.topbar.optionsMenu.exportSERPXLSX+'</h4></a>'+
                    '<a class="exportSERPOptionsMenuButton" id="exportSERPOptionsMenuButtonCSV" href="javascript:void(0)"><h4><i class="export-serp-icon"></i>'+Content.topbar.optionsMenu.exportSERPCSV+'</h4></a>'+
                    '<a class="exportSERPOptionsMenuButton" id="exportSERPOptionsMenuButtonTXT" href="javascript:void(0)"><h4><i class="export-serp-icon"></i>'+Content.topbar.optionsMenu.exportSERPTXT+'</h4></a>'+
                '</div>'
            );

        },
        toggleLanguage: function() {
            localStorage.setItem("language", Content.topbar.OtherLanguageShort.toUpperCase() );
            key="l";
            sourceURL = window.location.href;
            var rtn = sourceURL.split("?")[0],
                param,
                params_arr = [],
                queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
            if (queryString !== "") {
                params_arr = queryString.split("&");
                for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                    param = params_arr[i].split("=")[0];
                    if (param === key) {
                        params_arr.splice(i, 1);
                    }
                }
                rtn += "?" + params_arr.join("&");
                rtn += "&";
            } else {
                rtn += "?";
            }
            rtn += "l="+Content.topbar.OtherLanguageShort;
            return rtn;
        },  
        changeLanguage: function(){                 
                    window.location = MENU.toggleLanguage(); 
                    return false; 
        },
        advancedPagesClick: function(){
            menuNewAdvancedSearch("/page/advanced/search?l=" + language);
        },
        advancedImagesClick: function(){
            menuNewAdvancedSearch("/image/advanced/search?l=" + language);
        },          
        reportBug: function(){
                window.location = Content.topbar.menu.bug + replaceAll(window.location.href, '&', '%26');
        },                          
        attachMask: function(){       
          $('#mainMask').on('click', function(e){
            document.querySelector('.swiper-container').swiper.slideNext();
          });               
        },   
        copyLink: function(){                   
            var urlToCopy;
            if (typeof openImageViewer !== 'undefined' && openImageViewer === true){ 
                $('#mainMask').click();     
                
                /*const sleep = (milliseconds) => {
                  return new Promise(resolve => setTimeout(resolve, milliseconds))
                }               
                sleep(500).then(() => {
                    console.log('href: ' + getImageHref(getSlidePosition()));
                    MENU.copyURL(getImageHref(getSlidePosition()));
                });*/
                /*imageHref.then(MENU.copyURL());*/
                console.log('href: ' + getImageHref(getSlidePosition()));
                MENU.copyURL(getImageHref(getSlidePosition()));
            }
            else{ /*Default case copy current url*/
                urlToCopy = window.location.href;
                MENU.copyURL(urlToCopy);
            }
        },
        copyURL: function(urlToCopy){           
            console.log("urlToCopy: " + urlToCopy);
            var dummy = document.createElement('input')     
            document.body.appendChild(dummy);
            dummy.value = urlToCopy;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            $('body').append('<div id="alertCopy" class="alert alert-success alertCopy"><strong>'+Content.topbar.link.copied+'</strong></div>');
            $('#alertCopy').show().delay(1500).fadeOut();
            setTimeout(function(){
            $('#alertCopy').remove();
            }, 2000); /*time to show the notification plus the time to do the fadeout effect*/

            // aditionally if browser has the web share api, share the link
            if (navigator.share) {
              navigator.share({
                url: urlToCopy,
              })
              ;
              //.then(() => console.log('Successful share'))
              //.catch((error) => console.log('Error sharing', error));
            }
        },
        pagesClick: function(){
            $('#pagesCarret').toggleClass('fa-caret-up fa-caret-down');
            $('#pageOptions').slideToggle( "fast", "linear" );
        },      
        imagesClick: function(){
            $('#imagesCarret').toggleClass('fa-caret-up fa-caret-down');
            $('#imageOptions').slideToggle( "fast", "linear" );
        },                                              
        goToContent: function(){
            const swiper = document.querySelector('.swiper-container').swiper;
            swiper.slideTo(1);
            swiper.allowSlidePrev = false;
            swiper.allowSlideNext = false;
        },
        attachKeyBoardEvent: function() {
            document.addEventListener('keydown', function(evt) {
              // When pressing escape key close image
              var isEscape = false;
              if ("key" in evt) {
                  isEscape = (evt.key === "Escape" || evt.key === "Esc");
              } else {
                  isEscape = (evt.keyCode === 27);
              }
              if (isEscape) {
                  MENU.goToContent();
              }
            });
        },
    };
}());   
