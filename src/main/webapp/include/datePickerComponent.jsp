<script>
  var ARQUIVO_SEARCH_DATES = ARQUIVO_SEARCH_DATES || (function(){
    return {
      openDatePicker : function(type, changeDateFunctionName) {
        // type - Start or End string
        // changeDateFunction - a function name that change the date on caller function of this function. It receives a Javascript Date Object.

        //const dateElementId = "modalDateContent"+ type;
        const datePickerId = "modalDatePicker" + type;
        const dateInputId =  "modalDateInput" + type;
        const dateInputVal = $("#date"+type+"_top").val();
        
        uglipop({
          class:'dateModal dateModal' + type, //styling class for Modal
          source:'html',
          content:           
            '<h4>'+Content.picker[type.toLowerCase()].header+'</h4>'+
            '<p class="dateInputContainer dateInputContainer'+type+'">'+
              '<input size="10" type="text" id="'+dateInputId+'" value="'+dateInputVal+'" class="dateInput dateInput'+type+'" />'+
              'dd/mm/yyyy'+
            '</p>'+
            '<div id="'+datePickerId+'"></div>'+
            '<div class="dateModalButtons dateModalButtons'+type+'">'+
              '<button class="dateModalButtonsOk dateModalButtonsOk'+type+'" onclick="ARQUIVO.closeModalUglipop();">'+
                '<span>'+Content.picker.ok+'</span>'+
              '</button>'+
            '</div>'
        });

        function updateCallerDateFromDatePicker() {
          ARQUIVO_SEARCH_DATES[changeDateFunctionName]( $('#'+datePickerId).datepicker( 'getDate' ) );
        }

        // callback function called when month or year is changed
        function onChangeMonthYearFunction(y, m, i) {
          var d = i.selectedDay;

          // to prevent the problem when changing from a month with 31 days to a other month with <31 days
          // the calendar were going to the first or second day of the next month
          function getDaysInMonth(m, y) {
            return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
          }
          const minDay = Math.min(getDaysInMonth(m, y), d);
          const newDate = new Date(y, m-1, minDay);

          $(this).datepicker('setDate', newDate);

          // hack can't call updateCallerDateFromDatePicker function!
          ARQUIVO_SEARCH_DATES[changeDateFunctionName]( newDate );
        }

        // on pressing enter on input change the date and close the modal
        $('#'+dateInputId).on('keyup', function(e) {
            if (e.keyCode === 13) {
                updateCallerDateFromDatePicker();
                ARQUIVO.closeModalUglipop();
            }
        });

        // create new modal content and append it to bottom of the body DOM
        $( "body" ).append();

        ARQUIVO.inputMaskAnInput( $('#'+dateInputId) );

        // The minimum selectable date - minDate is a global javascript variable
        const minimimDate = type == 'Start' ? minDate : this.getCalendarDate('Start');

        // The maximum selectable date - maxDate is a global javascript variable
        const maximumDate = type == 'End' ? maxDate : this.getCalendarDate('End');
        
        // open date picker div
        $("#"+datePickerId).datepicker({
          defaultDate: dateInputVal, // Set the date to highlight on first opening if the field is blank.
          inline: true,
          altField: '#'+dateInputId,
          dateFormat: "dd/mm/yy",
          changeMonth: true, // Whether the month should be rendered as a dropdown instead of text.
          changeYear: true, // Whether the year should be rendered as a dropdown instead of text
          yearRange: minYear+":"+maxYear, // The range of years displayed in the year drop-down - minYear and maxYear are a global javascript variables
          minDate: minimimDate, 
          maxDate: maximumDate, 
          monthNamesShort: $.datepicker.regional[language].monthNames,
          onChangeMonthYear: onChangeMonthYearFunction,
          onSelect: updateCallerDateFromDatePicker,
        });

        // focus the input
        $('#'+dateInputId).focus();

        // on change input
        $('#'+dateInputId).change(function(){
          const dateInputValue = $(this).val();

          // prevent change the date when the user didn't finish inserting a full date on keyboard
          if (dateInputValue.replace('_','').length == 10) {
            // update datepicker with newinput value
            $('#'+datePickerId).datepicker('setDate', dateInputValue);

            // update callback value
            updateCallerDateFromDatePicker();
          }
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
      },

      updateStart: function(newDate) {
        this.updateCalendarCard( "Start", newDate );
        var currentDateEnd = $('#calendarYearEnd').text();
        //update dual range
        dualRange.value = { lower: newDate.getFullYear(), upper: currentDateEnd };
        $('#dateStart_top').change();
      },

      updateEnd: function(newDate) {
        this.updateCalendarCard( "End", newDate );
        var currentDateStart = $('#calendarYearStart').text();
        //update dual range
        dualRange.value = { lower: currentDateStart, upper: newDate.getFullYear() };
        $('#dateEnd_top').change();
      },

      openDateStartPicker: function() {
        this.openDatePicker("Start", "updateStart");
      },
      openDateEndPicker: function() {
        this.openDatePicker("End", "updateEnd");
      },

      /**
       * Check dates values and if need open a modal if they aren't valid.
       */
      checkDatesIfNeedPreventSubmit : function() {
		const startTime = ARQUIVO_SEARCH_DATES.getCalendarDate("Start");
        const endTime = ARQUIVO_SEARCH_DATES.getCalendarDate("End");
        if(startTime > endTime) {
          uglipop({
	        class:'modalReplay noprint', //styling class for Modal
	        source:'html',
	        content:'<h4 class="modalTitle"><i class="fa" aria-hidden="true"></i> '+Content.datepicker.error.date+'</h4>'+
	                '<div class="row"><a id="errorDates" onclick="ARQUIVO.closeModalUglipop()" class="col-xs-6 text-center leftAnchor modalOptions">OK</a></div>'
	       });
          return false;
        }
        return true;
      },

      writeIonicDateTimes : function() {
		document.write('<ion-datetime id="ionDateStart" class="display-none" display-format="D/MMMM/YYYY" min="'+minYear+'-01-01" max="'+ARQUIVO.convertJsDateToIonDate(maxDate)+'" value="<%=dateStartStringIonic%>"></ion-datetime>');
		ARQUIVO.initializeIonDateTimeComponent($('#ionDateStart')[0]);
		document.write('<ion-datetime id="ionDateEnd" class="display-none" display-format="D/MMMM/YYYY" min="'+minYear+'-01-01" max="'+ARQUIVO.convertJsDateToIonDate(maxDate)+'" value="<%=dateEndStringIonic%>"></ion-datetime>');
		ARQUIVO.initializeIonDateTimeComponent($('#ionDateEnd')[0]);
      },
    };
  }());
</script>

<script type="text/javascript">
	ARQUIVO_SEARCH_DATES.writeIonicDateTimes();
	$('#searchForm').submit(ARQUIVO_SEARCH_DATES.checkDatesIfNeedPreventSubmit);
</script>

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
          ARQUIVO_SEARCH_DATES.openDateStartPicker();
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
          ARQUIVO_SEARCH_DATES.openDateEndPicker();
        }
       return;
      }
    </script>
  </ion-range>

  <script type="text/javascript">
    $('#ionDateStart').on("ionChange", function() {
      const newDate = ARQUIVO.convertIonDateToJSDate(this);
      ARQUIVO_SEARCH_DATES.updateStart(newDate);
    });
    $('#ionDateEnd').on("ionChange", function() {
      const newDate = ARQUIVO.convertIonDateToJSDate(this);
      ARQUIVO_SEARCH_DATES.updateEnd(newDate);
    });

    // When chaning ionic range
    $('#dual-range').on("ionChange", function() {
      function updateYear(type, ionRangeValueType) {
        const newYear = document.querySelector('#dual-range').value[ionRangeValueType];
        let date = ARQUIVO_SEARCH_DATES.getCalendarDate(type);
        date.setFullYear(newYear);
        ARQUIVO_SEARCH_DATES.updateCalendarCard(type, date);
        $('#ionDate'+type).val( ARQUIVO.convertJsDateToIonDate(date) );
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
