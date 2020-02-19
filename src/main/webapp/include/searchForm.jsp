<div class="row">
  <div class="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">

    <script>
      var ARQUIVO_SEARCH_DATES = ARQUIVO_SEARCH_DATES || (function(){
        return {
          openDatePicker : function(type) {
            const dateElementId = "modalDateContent"+ type;
            const datePickerId = "modalDatePicker" + type;
            const dateInputId =  "modalDateInput" + type;
            const dateInputVal = $("#date"+type+"_top").val();
            
            // delete modal content if already exits
            if ($("#"+dateElementId).length > 0) {
              $("#"+dateElementId).remove();
            }

            // create new modal content and append it to bottom of the body DOM
            $( "body" ).append(`
              <div id="${dateElementId}" title="Select ${type}" class="dateModal dateModal${type}">
                <input size="10" type="text" id="${dateInputId}" value="${dateInputVal}" class="dateInput dateInput${type}" />
                <div id="${datePickerId}">
              </div>
            `);
            
            // open date picker div
            $("#"+datePickerId).datepicker({
              defaultDate: dateInputVal, // Set the date to highlight on first opening if the field is blank.
              inline: true,
              altField: '#'+dateInputId,
              dateFormat: "dd/mm/yy",
              changeMonth: true, // Whether the month should be rendered as a dropdown instead of text.
              changeYear: true, // Whether the year should be rendered as a dropdown instead of text
              yearRange: minYear+":"+maxYear, // The range of years displayed in the year drop-down - minYear and maxYear are a global javascript variables
              minDate: minDate, // The minimum selectable date - minDate is a global javascript variable
              maxDate: maxDate, // The maximum selectable date - maxDate is a global javascript variable
            });

            // connect the input and the datepicker
            $('#'+dateInputId).change(function(){
                $('#'+datePickerId).datepicker('setDate', $(this).val());
            });

            // open modal
            $( "#"+dateElementId ).dialog({
              modal: true,
              buttons: {
                Cancel: function() {
                  $( this ).dialog( "close" );
                },
                Ok: function() {
                  // on ok button pressed
                  const newDate = $('#'+datePickerId).datepicker( "getDate" );
                  ARQUIVO_SEARCH_DATES.updateCalendarCard(type, newDate );

                  // close the modal dialog
                  $( this ).dialog( "close" );
                }
              }
            });
          },
          updateCalendarCard: function(type, dateToPutOnCard) {
            // type: like 'Start or 'End
            // date: a date javascript object

            $('#date'+type+'_top').attr("value", this.formatJSDateToPresentation(dateToPutOnCard) );

            function removeZeroInDay(dayStr){
              if(dayStr.length == 2 && dayStr.charAt(0) === "0"){
                return dayStr.charAt(1);
              }
              return dayStr;
            }
            const d = removeZeroInDay( dateToPutOnCard.getDate() ); // get the day of the month
            $('#calendarDay'+type).text( d );
            
            const m = this.monthShortNamesArray()[ dateToPutOnCard.getMonth() ];
            $('#calendarMonth'+type).text( m );

            $('#calendarYear'+type).text( dateToPutOnCard.getFullYear() );
          },
          convertIonDateToJSDate: function(ionDate) {
            /*ionic uses the date format 1996-01-31T00:00:00+01:00  , we need to convert the date to our own date format i.e.  31/01/1996 */
            var newDate = $(ionDate).val();
            var newDateTokens = newDate.split('-');
            //var newDateFormated =  newDateTokens[2].split('T')[0] + "/" + newDateTokens[1]+ "/"+ newDateTokens[0];
            return new Date(newDateTokens[0], parseInt(newDateTokens[1])-1, parseInt(newDateTokens[2].split('T')[0]) );
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
          monthShortNamesArray: function() {
            if(typeof language !== 'undefined' && language.toUpperCase() === 'EN') {
              monthShortNamesArray = ["<fmt:message key='smonth.0'/>".charAt(0).toUpperCase() + "<fmt:message key='smonth.0'/>".slice(1),
              '<fmt:message key='smonth.1'/>'.charAt(0).toUpperCase()  + '<fmt:message key='smonth.1'/>'.slice(1),
              '<fmt:message key='smonth.2'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.2'/>'.slice(1) ,
              '<fmt:message key='smonth.3'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.3'/>'.slice(1) ,
              '<fmt:message key='smonth.4'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.4'/>'.slice(1),
              '<fmt:message key='smonth.5'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.5'/>'.slice(1),
              '<fmt:message key='smonth.6'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.6'/>'.slice(1),
              '<fmt:message key='smonth.7'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.7'/>'.slice(1),
              '<fmt:message key='smonth.8'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.8'/>'.slice(1),
              '<fmt:message key='smonth.9'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.9'/>'.slice(1),
              '<fmt:message key='smonth.10'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.10'/>'.slice(1),
              '<fmt:message key='smonth.11'/>'.charAt(0).toUpperCase() + '<fmt:message key='smonth.11'/>'.slice(1)];
            } else {
               monthShortNamesArray = ["<fmt:message key='smonth.0'/>",'<fmt:message key='smonth.1'/>','<fmt:message key='smonth.2'/>','<fmt:message key='smonth.3'/>','<fmt:message key='smonth.4'/>','<fmt:message key='smonth.5'/>','<fmt:message key='smonth.6'/>','<fmt:message key='smonth.7'/>','<fmt:message key='smonth.8'/>','<fmt:message key='smonth.9'/>','<fmt:message key='smonth.10'/>','<fmt:message key='smonth.11'/>'];
            }
            return monthShortNamesArray;
          },
          initializeIonDateTimeComponent: function(ionDateTimeComponent) {
            const i = $(ionDateTimeComponent);
            i.cancelText = "<fmt:message key='picker.cancel'/>";
            i.doneText = "<fmt:message key='picker.ok'/>";
            i.monthShortNames = this.monthShortNamesArray();
          },
          mobileAndTabletcheck: function() {  
            // adapted from https://stackoverflow.com/a/11381730/2239848 http://detectmobilebrowsers.com/
            // to test it on chrome dev tools change the user agent on the network conditions panel
            var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
          },
          getCalendarDate: function(type) {
            function createDateJsFormat( _date ){
              var day = _date.split('/')[0];
              var month = _date.split('/')[1];
              var year = _date.split('/')[2];
              return month + '/' + day + '/' + year;
            }
            var input = $( '#date'+type+'_top' ).val().trim();
            var t = new Date( createDateJsFormat( input ) );
            t.setHours(0,0,0,0);
            return t;
          }
        };
      }());
    </script>

    <script type="text/javascript">
      document.write('<ion-datetime id="ionDateStart" class="display-none" display-format="D/MMM/YYYY" min="'+minYear+'-01-01" max="'+maxYear+'-12-31" value="<%=dateStartStringIonic%>"></ion-datetime>');
      ARQUIVO_SEARCH_DATES.initializeIonDateTimeComponent($('#ionDateStart'));
      document.write('<ion-datetime id="ionDateEnd" class="display-none" display-format="D/MMM/YYYY" min="'+minYear+'-01-01" max="'+maxYear+'-12-31" value="<%=dateEndStringIonic%>"></ion-datetime>');
      ARQUIVO_SEARCH_DATES.initializeIonDateTimeComponent($('#ionDateEnd'));
    </script>
    <form id="searchForm" action='<%= formAction %>'>
      <div id="form_container">
        <script type="text/javascript">
          function submitForm() {
            $('.search-button').click();
          }

          $('#searchForm').submit(function() {
            const startTime = ARQUIVO_SEARCH_DATES.getCalendarDate("Start");
            const endTime = ARQUIVO_SEARCH_DATES.getCalendarDate("End");

            if(startTime > endTime) {
              modalErrorDates();
              return false;
            }
            return true;
          });

          function modalErrorDates(){
            uglipop({
              class:'modalReplay noprint', //styling class for Modal
              source:'html',
              content:'<h4 class="modalTitle"><i class="fa" aria-hidden="true"></i> <fmt:message key='datepicker.error.date'/></h4>'+
                      '<div class="row"><a id="errorDates" onclick="closeModalErrorDates()" class="col-xs-6 text-center leftAnchor modalOptions">OK</a></div>'});
          }

          function closeModalErrorDates() {
            $('#uglipop_content_fixed').fadeOut();
            $('#uglipop_overlay').fadeOut('fast');
          }

        </script>
        <div id="searchBarBlock" class="input-group stylish-input-group">
          <input name="query" id="txtSearch" value="<c:out value = "${htmlQueryString}"/>" type="search" class="form-control no-radius search-input swiper-no-swiping" placeholder="<fmt:message key='home.search.placeholder'/>" autocapitalize="off" autocomplete="off" autocorrect="off">
          <script type="text/javascript">
            $('#txtSearch').keydown(function (e){
              if(e.keyCode == 13){
                  submitForm();
              }
            })
          </script>
          <input type="hidden" id="l" name="l" value="<%=language%>">
        </div>
        <!-- starts search lupe and "x" close button -->
        <div>
          <span class="clear-text"><i class="fa fa-close"></i></span>
            <span id="buttonSearch" class="input-group-addon no-radius search-button-span">
             <button class="search-button" type="submit">
              <span class="glyphicon glyphicon-search white"></span>
            </button>
          </span>

					<!-- force to have at least some height to make the DOM more fixed to user when loading -->
          <div style="min-height: 135px">
            <!-- starts history range slider -->
            <ion-item class="ion-no-padding hidden" id="ionSlider" lines="none">
              <script>
               document.write('<ion-range ion-padding-start id="dual-range" dual-knobs pin color="dark" min="'+minYear+'" max="'+maxYear+'" step="1">');
              </script>
                <input size="10" class="display-none" type="text" id="dateStart_top" name="dateStart" value="<%=dateStartString%>" />
                <input size="10" class="display-none" type="text" id="dateEnd_top" name="dateEnd" value="<%=dateEndString%>" />

                <button type="button" class="clean-button-no-fill" id="sliderCircleEnd" onclick="openDateEnd();" slot="end">
                  <span id="calendarDayEnd"></span>
                  <br/>
                  <span id="calendarMonthEnd"></span>
                  <br/>
                  <span id="calendarYearEnd"></span>
                  <script>
                    ARQUIVO_SEARCH_DATES.updateCalendarCard('End', dateEnd);
                  </script>
                </button>

                <button type="button" class="clean-button-no-fill" id="sliderCircleStart" slot="start" onclick="openDateStart()">
                  <span id="calendarDayStart"></span>
                  <br/>
                  <span id="calendarMonthStart"></span>
                  <br/>
                  <span id="calendarYearStart"></span>
                  <script type="text/javascript">
                    ARQUIVO_SEARCH_DATES.updateCalendarCard('Start', dateStart);
                  </script>
                </button>

                <script type="text/javascript">
                  function openDateStart(){
                    if (ARQUIVO_SEARCH_DATES.mobileAndTabletcheck()) { // is mobile or tablet
                      // use ionic date picker
                      var endDate = $('#dateEnd_top').attr("value");
                      var endDateTokens = endDate.split('/');
                      var endDateIonic = endDateTokens[2] + '-' + endDateTokens[1] + '-' + endDateTokens[0];
                      $('#ionDateStart')[0].max = endDateIonic;
                      $('#ionDateStart').click();
                    } else {
                      // use jquery modal with a date picker
                      ARQUIVO_SEARCH_DATES.openDatePicker("Start");
                    }
                   return;
                  }
                  function openDateEnd(){
                    if (ARQUIVO_SEARCH_DATES.mobileAndTabletcheck()) { // is mobile or tablet
                      var startDate = $('#dateStart_top').attr("value");
                      var startDateTokens = startDate.split('/');
                      var startDateIonic = startDateTokens[2] + '-' + startDateTokens[1] + '-' + startDateTokens[0];
                      $('#ionDateEnd')[0].min = startDateIonic;
                      $('#ionDateEnd').click();
                    } else {
                      // use jquery modal with a date picker
                      ARQUIVO_SEARCH_DATES.openDatePicker("End");
                    }
                   return;
                  }
                </script>
              </ion-range>

              <script type="text/javascript">
                $('#ionDateStart').on("ionChange", function() {
                  const newDate = ARQUIVO_SEARCH_DATES.convertIonDateToJSDate(this);

                  ARQUIVO_SEARCH_DATES.updateCalendarCard( "Start", newDate );

                  var currentDateEnd = $('#calendarYearStart').text();
                  //update dual range
                  dualRange.value = { lower: newDate.getFullYear(), upper: currentDateEnd };
                  $('#dateStart_top').change();
                });
                $('#ionDateEnd').on("ionChange", function() {
                  const newDate = ARQUIVO_SEARCH_DATES.convertIonDateToJSDate(this);

                  ARQUIVO_SEARCH_DATES.updateCalendarCard( "End", newDate );

                  var currentDateStart = $('#calendarYearStart').text();
                  //update dual range
                  dualRange.value = { lower: currentDateStart, upper: newDate.getFullYear() };
                  $('#dateEnd_top').change();
                });

                // When chaning ionic range
                $('#dual-range').on("ionChange", function() {
                  function updateYear(type, ionRangeValueType) {
                    const newYear = document.querySelector('#dual-range').value[ionRangeValueType];
                    let date = ARQUIVO_SEARCH_DATES.getCalendarDate(type);
                    date.setFullYear(newYear);
                    ARQUIVO_SEARCH_DATES.updateCalendarCard(type, date);
                  }
                  updateYear("Start", "lower");
                  updateYear("End", "upper");
                });

                $( document ).ready(function() {
                    $("#ionSlider").removeClass("hidden");
                });
                const dualRange = document.querySelector('#dual-range');
                dualRange.value = { lower: "<%=dateStartYear%>", upper: "<%=dateEndYear%>" };
              </script>

            </ion-item>
          <!-- ends history range slider -->
          </div>

          <!-- starts Paginas and images links option -->
          <div id="searchBarButtonsDiv">
            <br/>
            <script type="text/javascript">
              function submitSearchFormTo(action) {
                $('#searchForm').attr('action', action).submit();
              }
              function removeParams(urlSearch, searchParamsToRemove) {
                var searchParams = new URLSearchParams(urlSearch);
                searchParamsToRemove.forEach(p2r => searchParams.delete(p2r));
                return searchParams.toString();
              }
              var queryStringCleaned = removeParams( new URL(window.location.href).search.slice(1), ["start"] );
              queryStringCleaned = queryStringCleaned.length > 0 ? "?"+queryStringCleaned : "";

              document.write('<a id="PageButton" class="pageLink advancedSearch" href="/search.jsp'+queryStringCleaned+'" onclick="submitSearchFormTo(\'/search.jsp\'); return false;"><span><fmt:message key='home.pages'/></span></a>');
              document.write('<a id="ImageButton" class="advancedSearch selected-button imageLink" href="/images.jsp'+queryStringCleaned+'" onclick="submitSearchFormTo(\'/images.jsp\'); return false;"><span><fmt:message key='images.images'/></span></a>');
              document.write('<a id="advancedSearchButton" class="advancedSearch" href="<%= advancedSearchAction %>'+queryStringCleaned+'" onclick="submitSearchFormTo(\'<%= advancedSearchAction %>\'); return false;"><span><fmt:message key='topbar.menu.advanced'/></span></a> ');
            </script>
          </div>
        </div>
      </div>

      <script src="/include/clearForm.js"></script>
      <script type="text/javascript">
        // Append a suffix to dates.
        // Example: 23 => 23rd, 1 => 1st.
        function nth (d) {
          if(d>3 && d<21) return 'th';
          switch (d % 10) {
                case 1:  return "st";
                case 2:  return "nd";
                case 3:  return "rd";
                default: return "th";
            }
        }
      </script>
    </form>
    <ion-modal-controller></ion-modal-controller>
    <script type="text/javascript">
      customElements.define('modal-page', class extends HTMLElement {
        connectedCallback() {
          this.innerHTML = `
          <ion-header>
            <ion-toolbar>
              <ion-title>Super Modal</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            Content
          </ion-content>`;
        }
      });

      async function presentModal() {
        // initialize controller
        const modalController = document.querySelector('ion-modal-controller');
        await modalController.componentOnReady();

        // present the modal
        const modalElement = await modalController.create({
          component: 'modal-page'
        });
        await modalElement.present();
      }
    </script>

    </div>
</div>
