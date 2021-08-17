/**
 * A shared javascript module file with a couple of utility functions used by arquivo.pt frontend.
 */
var ARQUIVO = ARQUIVO || (function(){

    const _exportSERPNewLine = "\r\n";
    const _exportSERPTextSeparator = "\"";

    // If changed also change the _exportSERPInfo initial value.
    const _exportSERPColumnSeparator = ",";

    // variable to store the export search engine result page information
    // initialized with information that tells the Ms excel that the file use
    // the TAB char has column separator.
    //var _exportSERPInfo = "sep=," + _exportSERPNewLine;
    var _exportSERPInfo = [];

    // private methods
    function _inputmaskConfiguration () {
        return { regex: "[0-3][0-9]\/[0-1][0-9]\/[1-2][0-9][0-9][0-9]", insertMode: false };
    }

    function _monthsToArray(obj) {
        var array = new Array(12);
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                array[parseInt(prop)-1] = obj[prop];
            }
        }
        return array;
    }

    function defineReplaceAllOnString() {
        String.prototype.replaceAll = function(searchStr, replaceStr) {
            var str = this;

            // no match exists in string?
            if(str.indexOf(searchStr) === -1) {
                // return string
                return str;
            }

            // replace and remove first match, and do another recursirve search/replace
            return (str.replace(searchStr, replaceStr)).replaceAll(searchStr, replaceStr);
        }
    }

    // public methods
    return {
        removeZeroInDay: function(dayStr) {
            if(dayStr.length == 2 && dayStr.charAt(0) === "0"){
                return dayStr.charAt(1);
            }
            return dayStr;
        },
        convertIonDateToJSDate: function(ionDate) {
            /*ionic uses the date format 1996-01-31T00:00:00+01:00  , we need to convert the date to our own date format i.e.  31/01/1996 */
            var newDate = $(ionDate).val();
            var newDateTokens = newDate.split('-');
            //var newDateFormated =  newDateTokens[2].split('T')[0] + "/" + newDateTokens[1]+ "/"+ newDateTokens[0];
            return new Date(newDateTokens[0], parseInt(newDateTokens[1])-1, parseInt(newDateTokens[2].split('T')[0]) );
        },
        /**
         * Returns current timestamp in short form such as '2 Nov 10:24, 2015'
         */
        formatTimestampToPresentation: function(timestamp){
            var year = timestamp.substring(0, 4);
            var month = timestamp.substring(4, 6);
            var day = timestamp.substring(6, 8);
            if(day.charAt(0) === '0'){
                day = day.charAt(1);
            }
            var hour = timestamp.substring(8,10);
            var minute = timestamp.substring(10,12);
            return day+" "+Content.months[month]+" " +year
              + " " + Content.at+" "+hour+":"+minute;
        },
        formatJSDateToPresentation: function(date) {
            const d = new Date(date);
            var sdate = [
              ('0' + d.getDate()).slice(-2),
              ('0' + (d.getMonth() + 1)).slice(-2),
              d.getFullYear()
            ].join('/');
            return sdate;
        },
        convertJsDateToIonDate : function(jsDate) {
            var sdate = [
              jsDate.getFullYear(),
              ('0' + (jsDate.getMonth() + 1)).slice(-2),
              ('0' + jsDate.getDate()).slice(-2)
            ].join('-');
            return sdate;
        },
        convertIonDateToPresentation: function(ionDate) {
            return this.formatJSDateToPresentation(this.convertIonDateToJSDate(ionDate));
        },
        createDateJsFormat: function( _date ){
            var day = _date.split('/')[0];
            var month = _date.split('/')[1];
            var year = _date.split('/')[2];
            return month + '/' + day + '/' + year;
        },

        // adapted from https://stackoverflow.com/a/11381730/2239848 http://detectmobilebrowsers.com/
        // to test it on chrome dev tools change the user agent on the network conditions panel
        isMobileOrTablet: function() {
            var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        },
        monthShortNamesArray: function() {
            // convert Content.shortMonths to an array of ["jan", "fev", "mar", ...]
            return _monthsToArray(Content.shortMonths);
        },
        monthNamesArray: function() {
            // convert Content.shortMonths to an array of ["jan", "fev", "mar", ...]
            return _monthsToArray(Content.months);
        },
        // encode some char of str has html
        encodeHtmlEntities: function(str) {
            defineReplaceAllOnString();

            return str.toString()
                     .replaceAll('ç','%26ccedil%3B')
                     .replaceAll('Á','%26Aacute%3B')
                     .replaceAll('á','%26aacute%3B')
                     .replaceAll('À','%26Agrave%3B')
                     .replaceAll('Â','%26Acirc%3B')
                     .replaceAll('à','%26agrave%3B')
                     .replaceAll('â','%26acirc%3B')
                     .replaceAll('Ä','%26Auml%3B')
                     .replaceAll('ä','%26auml%3B')
                     .replaceAll('Ã','%26Atilde%3B')
                     .replaceAll('ã','%26atilde%3B')
                     .replaceAll('Å','%26Aring%3B')
                     .replaceAll('å','%26aring%3B')
                     .replaceAll('Æ','%26Aelig%3B')
                     .replaceAll('æ','%26aelig%3B')
                     .replaceAll('Ç','%26Ccedil%3B')
                     .replaceAll('Ð','%26Eth%3B')
                     .replaceAll('ð','%26eth%3B')
                     .replaceAll('É','%26Eacute%3B')
                     .replaceAll('é','%26eacute%3B')
                     .replaceAll('È','%26Egrave%3B')
                     .replaceAll('è','%26egrave%3B')
                     .replaceAll('Ê','%26Ecirc%3B')
                     .replaceAll('ê','%26ecirc%3B')
                     .replaceAll('Ë','%26Euml%3B')
                     .replaceAll('ë','%26euml%3B')
                     .replaceAll('Í','%26Iacute%3B')
                     .replaceAll('í','%26iacute%3B')
                     .replaceAll('Ì','%26Igrave%3B')
                     .replaceAll('ì','%26igrave%3B')
                     .replaceAll('Î','%26Icirc%3B')
                     .replaceAll('î','%26icirc%3B')
                     .replaceAll('Ï','%26Iuml%3B')
                     .replaceAll('ï','%26iuml%3B')
                     .replaceAll('Ñ','%26Ntilde%3B')
                     .replaceAll('ñ','%26ntilde%3B')
                     .replaceAll('Ó','%26Oacute%3B')
                     .replaceAll('ó','%26oacute%3B')
                     .replaceAll('Ò','%26Ograve%3B')
                     .replaceAll('ò','%26ograve%3B')
                     .replaceAll('Ô','%26Ocirc%3B')
                     .replaceAll('ô','%26ocirc%3B')
                     .replaceAll('Ö','%26Ouml%3B')
                     .replaceAll('ö','%26ouml%3B')
                     .replaceAll('Õ','%26Otilde%3B')
                     .replaceAll('õ','%26otilde%3B')
                     .replaceAll('Ø','%26Oslash%3B')
                     .replaceAll('ø','%26oslash%3B')
                     .replaceAll('ß','%26szlig%3B')
                     .replaceAll('Þ','%26Thorn%3B')
                     .replaceAll('þ','%26thorn%3B')
                     .replaceAll('Ú','%26Uacute%3B')
                     .replaceAll('ú','%26uacute%3B')
                     .replaceAll('Ù','%26Ugrave%3B')
                     .replaceAll('ù','%26ugrave%3B')
                     .replaceAll('Û','%26Ucirc%3B')
                     .replaceAll('û','%26ucirc%3B')
                     .replaceAll('Ü','%26Uuml%3B')
                     .replaceAll('ü','%26uuml%3B')
                     .replaceAll('Ý','%26Yacute%3B')
                     .replaceAll('ý','%26yacute%3B')
                     .replaceAll('ÿ','%26yuml%3B')
                     .replaceAll('©','%26copy%3B')
                     .replaceAll('®','%26reg%3B')
                     .replaceAll('™','%26trade%3B')
                     .replaceAll('&','%26amp%3B')
                     .replaceAll('<','%26lt%3B')
                     .replaceAll('>','%26gt%3B')
                     .replaceAll('€','%26euro%3B')
                     .replaceAll('¢','%26cent%3B')
                     .replaceAll('£','%26pound%3B')
                     .replaceAll('\"','%26quot%3B')
                     .replaceAll('‘','%26lsquo%3B')
                     .replaceAll('’','%26rsquo%3B')
                     .replaceAll('“','%26ldquo%3B')
                     .replaceAll('”','%26rdquo%3B')
                     .replaceAll('«','%26laquo%3B')
                     .replaceAll('»','%26raquo%3B')
                     .replaceAll('—','%26mdash%3B')
                     .replaceAll('–','%26ndash%3B')
                     .replaceAll('°','%26deg%3B')
                     .replaceAll('±','%26plusmn%3B')
                     .replaceAll('¼','%26frac14%3B')
                     .replaceAll('½','%26frac12%3B')
                     .replaceAll('¾','%26frac34%3B')
                     .replaceAll('×','%26times%3B')
                     .replaceAll('÷','%26divide%3B')
                     .replaceAll('α','%26alpha%3B')
                     .replaceAll('β','%26beta%3B')
                     .replaceAll('∞','%26infin%3B')
                     .replaceAll(' ','+');
        },

        inputMaskAnInput: function(input) {
            $(input).inputmask( _inputmaskConfiguration() );
        },

        removeParams: function(urlSearch, searchParamsToRemove) {
            // Replace URLSearchParam to MS Edge support
            // https://stackoverflow.com/a/26257722
            function removeURLParameter(url, parameter) {
                //prefer to use l.search if you have a location/link object
                var urlparts= url.split('?');
                if (urlparts.length>=2) {

                    var prefix= encodeURIComponent(parameter)+'=';
                    var pars= urlparts[1].split(/[&;]/g);

                    //reverse iteration as may be destructive
                    for (var i= pars.length; i-- > 0;) {
                        //idiom for string.startsWith
                        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                            pars.splice(i, 1);
                        }
                    }

                    url= urlparts[0]+'?'+pars.join('&');
                    return url;
                } else {
                    return url;
                }
            }

            var url = urlSearch;
            for (i = 0; i < searchParamsToRemove.length ; i++) {
                url = removeURLParameter(urlSearch, searchParamsToRemove[i]);
            }
            return url;
        },

        focusInputIfEmpty: function(input) {
            const i = $(input);
            const v = i.val();
            if (v.length == 0) {
                i.focus();
            }
        },

        getSearchNoResultsHtml: function() {
            return ''+
                '<div class="noResultsFound">'+
                  '<p>'+Content.search.noResults.title+'<span class="text-bold"> '+$('#txtSearch').attr("value")+'</span></p>'+
                '</div>'+
                '<div class="noResultsFoundSuggestions">'+
                    '<p class="text-bold">'+Content.search.noResults.suggestions.intro+'</p>'+
                  '<ul>'+
                    '<li>'+Content.search.noResults.suggestions.timeInterval+'</li>'+
                    '<li>'+Content.search.noResults.suggestions.genericWords+'</li>'+
                    '<li>'+Content.search.noResults.suggestions.advancedSearch+'</li>'+
                  '</ul>'+
                '</div>'+
                '';
        },

        getSearchErrorHtml: function() {
            return ''+
              '<div class="noResultsFound">'+
              '<p>'+Content.search.error.title+'<span class="text-bold"> '+$('#txtSearch').attr("value")+'</span></p>'+
              '</div>'+
              '<div class="noResultsFoundSuggestions">'+
              '<p class="text-bold">'+Content.search.error.suggestions.intro+'</p>'+
              '<ul>'+
              '<li>'+Content.search.error.suggestions.tryAgain+'</li>'+
              '<li>'+Content.search.error.suggestions.genericWords+'</li>'+
              '<li>'+Content.search.error.suggestions.contactUs+'</li>'+
              '</ul>'+
              '</div>'+
              '';
        },

        closeModalUglipop: function() {
            $('#uglipop_overlay_wrapper').fadeOut();
            $('#uglipop_overlay').fadeOut();
            $('#uglipop_content_fixed').fadeOut('fast');
        },

        initializeIonDateTimeComponent: function(ionDateTimeComponent) {
            ionDateTimeComponent.cancelText = Content.picker.cancel;
            ionDateTimeComponent.doneText = Content.picker.ok;
            ionDateTimeComponent.monthShortNames = ARQUIVO.monthShortNamesArray();
            ionDateTimeComponent.monthNames = ARQUIVO.monthNamesArray();
        },

        // present url without protocol neither www.
        formatURLForPresentation: function(url) {
            return url.replace(/^(http(s)?\:\/\/)?(www\.)?/,'').replace(/\/$/,'');
        },

        replaceUrlParam: function(url, paramName, paramValue) {
            // Replace URL javascript class with this function so it works on MS Edge

            // https://stackoverflow.com/a/20420424
            if (paramValue == null) {
                paramValue = '';
            }
            var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
            if (url.search(pattern)>=0) {
                return url.replace(pattern,'$1' + paramValue + '$2');
            }
            url = url.replace(/[?#]$/,'');
            return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
        },

        // returns an object with query and the extracted special parameters
        extractQuerySpecialParameters: function(inputQuery) {
            var words = [];
            var collection = [];
            var site = [];
            var type = [];

            inputQuery.split(' ').forEach(function(item) {
                var special = false;
                var pair = item.split(':');
                if (pair.length == 2) {
                    var key = pair[0];
                    var value = pair[1];
                    if (key === 'site') {
                        site.push(value);
                        site.push('*.' + value);
                        special = true;
                    } else if (key === 'type') {
                        type.push(value);
                        special = true;
                    } else if (key === 'collection') {
                        collection.push(value);
                        special = true;
                    }
                }
                if (!special) {
                    words.push(item);
                }
            });
            const query = words.join(' ');

            return {
                query: query,
                site: site.join(','),
                type: type.join(','),
                collection: collection.join(',')
            };
        },

        // pass any size of arguments
        exportSERPSaveLine: function() {
            let line = [];
            for (var i=0; i < arguments.length; i++) {
                var a = arguments[i];
                line.push( a );
            }
            _exportSERPInfo.push( line );
            return line;
        },

        addZero: function(i) {
          if (i < 10) {
            i = "0" + i;
          }
          return i;
        },

        jsDateToTimetamp: function(d = new Date()) {
            const sdate = [
                d.getFullYear(),
                ('0' + (d.getMonth() + 1)).slice(-2) +
                ('0' + d.getDate()).slice(-2),
                this.addZero(d.getHours()),
                this.addZero(d.getMinutes()),
                this.addZero(d.getSeconds()),
            ].join('');
            return sdate;
        },

        // Load a JavaScript file from the server using a GET HTTP request, then execute it.
        // Also use cache it.
        // adaptaion of cachedScript jQuery example on getScript
        // https://api.jquery.com/jquery.getscript/
        cachedScript : function(url, callback, options) {

            // Allow user to set any option except for dataType, cache, and url
            options = $.extend( options || {}, {
                dataType: "script",
                cache: true,
                url: url
            });

            // Use $.ajax() since it is more flexible than $.getScript
            // Return the jqXHR object so we can chain callbacks
            jQuery.ajax( options ).done(function( script, textStatus ) {
                jQuery.globalEval(script);
                callback();
            });
        },

        // Export the search engine result page.
        // type: image or page
        // outputFileExtension: csv or xlsx
        exportSERP: function(type, outputFileExtension) {
            this.cachedScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.2/xlsx.full.min.js", function() {
                const wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: "Arquivo.pt search "+type+" export",
                    Subject: "Arquivo.pt search "+type+" export",
                    Author: "Arquivo.pt",
                    CreatedDate: new Date()
                };
                const sheetName = type+" export";
                wb.SheetNames.push(sheetName);
                const ws = XLSX.utils.aoa_to_sheet(_exportSERPInfo);
                wb.Sheets[sheetName] = ws;
                const filename = "arquivo_pt_"+type+"_"+ARQUIVO.jsDateToTimetamp(new Date())+"."+outputFileExtension;
                XLSX.writeFile(wb, filename);

                ARQUIVO.sendEventToAnalytics('exportSERP', type, outputFileExtension);
            });
        },

        // To be called after a search have been finished.
        exportSERPFinishSearch : function(type, totalResults) {
            document.getElementById("replayMenuButton").style.display = totalResults > 0 ? 'block' : 'none';
            document.getElementById("exportSERPOptionsMenuButtonXLSX").onclick = function () { ARQUIVO.exportSERP(type, 'xlsx'); return false; };
            document.getElementById("exportSERPOptionsMenuButtonCSV").onclick = function () { ARQUIVO.exportSERP(type, 'csv'); return false; };
            document.getElementById("exportSERPOptionsMenuButtonODS").onclick = function () { ARQUIVO.exportSERP(type, 'ods'); return false; };
            document.getElementById("exportSERPOptionsMenuButtonTXT").onclick = function () { ARQUIVO.exportSERP(type, 'txt'); return false; };
        },

        // Show the estimated results of the search
        displayEstimatedResults : function(totalResults) {
            document.getElementById("estimated-results-value").innerHTML = totalResults.toLocaleString(language);
            document.getElementById("estimated-results").style.display = totalResults > 0 ? 'block' : 'none';
        },

        // Generate random string/characters
        // len is optional
        generateId : function (len) {
          function dec2hex (dec) {
            return ('0' + dec.toString(16)).substr(-2)
          }
          var arr = new Uint8Array((len || 40) / 2)
          window.crypto.getRandomValues(arr)
          return Array.from(arr, dec2hex).join('')
        },

        /*
         * Get the client identification. If it didn't have any, generate a new one
         * and save it to a cookie.
         */
        getClientId : function() {
          function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          }
          function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          }
          const clientIdCookieName = "client_id";
          let client_id = getCookie(clientIdCookieName);
          if (client_id.length == 0) {
              client_id = this.generateId(20);
              setCookie(clientIdCookieName, client_id, 1);
          }
          return client_id;
        },

        submitSearchFormTo  : function( action) {
          $('#searchForm').attr('action', action).submit();
        },

        getContameHistoriasLink : function () {
            var queryStringCleaned = $("#txtSearch")[0].value
            return 'http://contamehistorias.pt/arquivopt/search?query='+queryStringCleaned+'&'+contaQueryLanguage;
        },
        attachClosePopup: function(){
          $('#cancelPopup').on('click', function(e){
            ARQUIVO.closeUglipop();
          });
        },
        closeUglipop: function(){
          $('#uglipop_content_fixed').fadeOut();
          $('#uglipop_overlay').fadeOut('fast');
        },
        submitSearchContameHistorias: function() {
            var queryStringCleaned = $("#txtSearch")[0].value
            ARQUIVO.sendEventToAnalytics('contameHistorias', 'Pressed', queryStringCleaned ? queryStringCleaned: "<empty>");
            uglipop({
              class:'modalReplay noprint', //styling class for Modal
              source:'html',
              content: '<h4 class="modalTitleLinkToContameHistorias">'+Content.leavingArquivoToSearchContameHistorias+'</h4>' +
                      '<div class="row"><a id="okLinkToContameHistorias" class="col-xs-6 text-center leftAnchor modalOptions">OK</a><a id="cancelPopup" class="col-xs-6 text-center modalOptions">'+Content.cancel+'</a></div>'});
            this.attachSearchContameHistorias();
            this.attachClosePopup();
        },
        attachSearchContameHistorias: function() {
            var queryStringCleaned = $("#txtSearch")[0].value
            $('#okLinkToContameHistorias').on('click', function(e) {
                ARQUIVO.sendEventToAnalytics('contameHistorias', 'Searched', queryStringCleaned ? queryStringCleaned: "<empty>");
                window.open( ARQUIVO.getContameHistoriasLink() );
                ARQUIVO.closeUglipop();
            });
        },

        // Get the search buttons HTML and optionally the advanced search button if its action is passed as argument
        // advancedSearchAction : optional
        getSearchButtonsHTML : function(advancedSearchAction) {
          var queryStringCleaned = ARQUIVO.removeParams( new URL(window.location.href).search.slice(1), ["start"] );
          queryStringCleaned = queryStringCleaned.length > 0 ? "?"+queryStringCleaned : "";

          var additionalClassForPage = window.location.pathname.startsWith("/page") ? 'selected-button' : '';
          var additionalClassForImage = window.location.pathname.startsWith("/image") ? 'selected-button' : '';

          var html =
            '<a id="PageButton" class="pageLink advancedSearch" href="/page/search'+queryStringCleaned+'" onclick="ARQUIVO.submitSearchFormTo(\'/page/search\'); return false;"><span>'+Content.pageSearchButton+'</span></a>'+
            '<a id="ImageButton" class="imageLink advancedSearch" href="/image/search'+queryStringCleaned+'" onclick="ARQUIVO.submitSearchFormTo(\'/image/search\'); return false;"><span>'+Content.imageSearchButton+'</span></a>';

          if (showContameHistoriasButton) {
            html +=
              '<a id="ContameHistoriasButton" class="contameHistoriasLink advancedSearch" href="'+ARQUIVO.getContameHistoriasLink()+'" onclick="ARQUIVO.submitSearchContameHistorias(); return false;"><span>'+Content.contameHistoriasButton+'</span></a>';
          }

          if (advancedSearchAction) {
            html +=
              '<a id="advancedSearchButton" class="advancedSearch" href="'+advancedSearchAction+queryStringCleaned+'" onclick="ARQUIVO.submitSearchFormTo(\''+advancedSearchAction+'\'); return false;"><span>'+Content.topbar.menu.advanced+'</span></a>';
          }

          return html;
        },

        /**
         * Send event to google analytics where the eventLabel by default is like arquivo.pt/<timestamp>/<url>
         */
        sendEventToAnalytics: function(eventCategory, eventAction, eventLabel) {
            eventLabel = eventLabel || ( _ts && _url ? "arquivo.pt/" + _ts + '/' +_url : '' );
            ga("send", "event", eventCategory, eventAction, eventLabel );
        },

    };
}());
