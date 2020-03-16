<div class="row">
  <div class="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">

    <script>
      var ARQUIVO_SEARCH_DATES = ARQUIVO_SEARCH_DATES || (function(){
        return {
          openDatePicker : function(type) {
            //const dateElementId = "modalDateContent"+ type;
            const datePickerId = "modalDatePicker" + type;
            const dateInputId =  "modalDateInput" + type;
            const dateInputVal = $("#date"+type+"_top").val();
            
            uglipop({
              class:'dateModal dateModal' + type, //styling class for Modal
              source:'html',
              content: 
              `
                <h4>${Content.picker[type.toLowerCase()].header}</h4>
                <p class="dateInputContainer dateInputContainer${type}">
                  <input size="10" type="text" id="${dateInputId}" value="${dateInputVal}" class="dateInput dateInput${type}" /> 
                  dd/mm/yyyy
                </p>
                <div id="${datePickerId}"></div>
                <div class="dateModalButtons dateModalButtons${type}">
                  <button class="dateModalButtonsCancel dateModalButtonsCancel${type}" onclick="ARQUIVO.closeModalUglipop();">
                    <span>${Content.picker.cancel}</span>
                  </button>
                  <button class="dateModalButtonsOk dateModalButtonsOk${type}" onclick="ARQUIVO_SEARCH_DATES.updateCalendarCard('${type}', $('#${datePickerId}').datepicker( 'getDate' ) ); ARQUIVO.closeModalUglipop();">
                    <span>${Content.picker.ok}</span>
                  </button>
                </div>
              `
            });

            // on pressing enter on input change the date and close the modal
            $('#'+dateInputId).on('keyup', function(e) {
                if (e.keyCode === 13) {
                    ARQUIVO_SEARCH_DATES.updateCalendarCard(type, $('#'+datePickerId).datepicker( 'getDate' ) ); 
                    ARQUIVO.closeModalUglipop();
                }
            });


            // create new modal content and append it to bottom of the body DOM
            $( "body" ).append();

            ARQUIVO.inputMaskAnInput( $('#'+dateInputId) );
            
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
              monthNamesShort: $.datepicker.regional[language].monthNames,
              onChangeMonthYear: function(y, m, i){ // callback function called when month or year is changed
                  var d = i.selectedDay;
                  $(this).datepicker('setDate', new Date(y, m-1, d));
              },
            });

            // focus the input
            $('#'+dateInputId).focus();

            // connect the input and the datepicker
            $('#'+dateInputId).change(function(){
                $('#'+datePickerId).datepicker('setDate', $(this).val());
            });

          },
          updateCalendarCard: function(type, dateToPutOnCard) {
            // type: like 'Start or 'End
            // date: a date javascript object
            $('#date'+type+'_top').attr("value", ARQUIVO.formatJSDateToPresentation(dateToPutOnCard) );

            const d = ARQUIVO.removeZeroInDay( dateToPutOnCard.getDate() ); // get the day of the month
            $('#calendarDay'+type).text( d );
            
            const m = ARQUIVO.monthShortNamesArray()[ dateToPutOnCard.getMonth() ];
            $('#calendarMonth'+type).text( m );

            $('#calendarYear'+type).text( dateToPutOnCard.getFullYear() );
          },
          getCalendarDate: function(type) {
            var input = $( '#date'+type+'_top' ).val().trim();
            var t = new Date( ARQUIVO.createDateJsFormat( input ) );
            t.setHours(0,0,0,0);
            return t;
          }
        };
      }());
    </script>

    <script type="text/javascript">
      document.write('<ion-datetime id="ionDateStart" class="display-none" display-format="D/MMMM/YYYY" min="'+minYear+'-01-01" max="'+maxYear+'-12-31" value="<%=dateStartStringIonic%>"></ion-datetime>');
      ARQUIVO.initializeIonDateTimeComponent($('#ionDateStart')[0]);
      document.write('<ion-datetime id="ionDateEnd" class="display-none" display-format="D/MMMM/YYYY" min="'+minYear+'-01-01" max="'+maxYear+'-12-31" value="<%=dateEndStringIonic%>"></ion-datetime>');
      ARQUIVO.initializeIonDateTimeComponent($('#ionDateEnd')[0]);
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
              content:'<h4 class="modalTitle"><i class="fa" aria-hidden="true"></i> '+Content.datepicker.error.date+'</h4>'+
                      '<div class="row"><a id="errorDates" onclick="ARQUIVO.closeModalUglipop()" class="col-xs-6 text-center leftAnchor modalOptions">OK</a></div>'});
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

                <button type="button" class="clean-button-no-fill searchCalendar" id="sliderCircleEnd" onclick="openDateEnd();" slot="end">
                  <span class="searchCalendarDay" id="calendarDayEnd"></span>
                  <br/>
                  <span class="searchCalendarMonth" id="calendarMonthEnd"></span>
                  <br/>
                  <span class="searchCalendarYear" id="calendarYearEnd"></span>
                  <script>
                    ARQUIVO_SEARCH_DATES.updateCalendarCard('End', dateEnd);
                  </script>
                </button>

                <button type="button" class="clean-button-no-fill searchCalendar" id="sliderCircleStart" slot="start" onclick="openDateStart()">
                  <span class="searchCalendarDay" id="calendarDayStart"></span>
                  <br/>
                  <span class="searchCalendarMonth" id="calendarMonthStart"></span>
                  <br/>
                  <span class="searchCalendarYear" id="calendarYearStart"></span>
                  <script type="text/javascript">
                    ARQUIVO_SEARCH_DATES.updateCalendarCard('Start', dateStart);
                  </script>
                </button>

                <script type="text/javascript">
                  function openDateStart(){
                    if (ARQUIVO.isMobileOrTablet()) { // is mobile or tablet
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
                    if (ARQUIVO.isMobileOrTablet()) { // is mobile or tablet
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
                  const newDate = ARQUIVO.convertIonDateToJSDate(this);

                  ARQUIVO_SEARCH_DATES.updateCalendarCard( "Start", newDate );

                  var currentDateEnd = $('#calendarYearEnd').text();
                  //update dual range
                  dualRange.value = { lower: newDate.getFullYear(), upper: currentDateEnd };
                  $('#dateStart_top').change();
                });
                $('#ionDateEnd').on("ionChange", function() {
                  const newDate = ARQUIVO.convertIonDateToJSDate(this);

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
              
              var queryStringCleaned = ARQUIVO.removeParams( new URL(window.location.href).search.slice(1), ["start"] );
              queryStringCleaned = queryStringCleaned.length > 0 ? "?"+queryStringCleaned : "";

              document.write('<a id="PageButton" class="pageLink advancedSearch" href="/search.jsp'+queryStringCleaned+'" onclick="submitSearchFormTo(\'/search.jsp\'); return false;"><span><fmt:message key='home.pages'/></span></a>');
              document.write('<a id="ImageButton" class="advancedSearch selected-button imageLink" href="/images.jsp'+queryStringCleaned+'" onclick="submitSearchFormTo(\'/images.jsp\'); return false;"><span><fmt:message key='images.images'/></span></a>');
              document.write('<a id="advancedSearchButton" class="advancedSearch" href="<%= advancedSearchAction %>'+queryStringCleaned+'" onclick="submitSearchFormTo(\'<%= advancedSearchAction %>\'); return false;"><span><fmt:message key='topbar.menu.advanced'/></span></a> ');
            </script>
          </div>
        </div>
      </div>

      <script type="text/javascript">
        window.onload = function() {
          if (! ARQUIVO.isMobileOrTablet()) {
            ARQUIVO.focusInputIfEmpty($("#txtSearch"));
          }
        };
      </script>
    </form>
  </div>
</div>
