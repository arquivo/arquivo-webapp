        <div class="row">
            <div class="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
  
                <script type="text/javascript">
                  document.write('<ion-datetime id="ionDateStart" class="display-none" display-format="D/MMM/YYYY" min="'+minYear+'-01-01" max="'+maxYear+'-12-31" value="<%=dateStartStringIonic%>"></ion-datetime>');
                  document.write('<ion-datetime id="ionDateEnd" class="display-none" display-format="D/MMM/YYYY" min="'+minYear+'-01-01" max="'+maxYear+'-12-31" value="<%=dateEndStringIonic%>"></ion-datetime>');                 
                </script>                              
                <script type="text/javascript">
                  if(language.toUpperCase() === 'EN') {
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
                  function removeZeroInDay(dayStr){
                    if(dayStr.length == 2 && dayStr.charAt(0) === "0"){
                      return dayStr.charAt(1);
                    }
                    return dayStr;
                  }
                  function getMonthShortName(monthPositionStr){
                    return monthShortNamesArray[parseInt(monthPositionStr)-1];
                  }
                </script>
                <script type="text/javascript">
                  $('#ionDateStart')[0].cancelText = "<fmt:message key='picker.cancel'/>";
                  $('#ionDateEnd')[0].cancelText = "<fmt:message key='picker.cancel'/>";
                  $('#ionDateStart')[0].doneText = "<fmt:message key='picker.ok'/>";
                  $('#ionDateEnd')[0].doneText = "<fmt:message key='picker.ok'/>";
                  $('#ionDateStart')[0].monthShortNames = monthShortNamesArray;
                   $('#ionDateEnd')[0].monthShortNames = monthShortNamesArray;
                </script>   
                <form id="searchForm" action="/search.jsp">
                <div id="form_container"> 
                    <script type="text/javascript">
                      function submitForm() {
                        $('.search-button').click();
                      }
                    </script>
                    <div id="searchBarBlock" class="input-group stylish-input-group">
                        
                            <input name="query" id="txtSearch" value="<c:out value = "${htmlQueryString}"/>" type="search" class="form-control no-radius search-input swiper-no-swiping" placeholder="<fmt:message key='home.search.placeholder'/>" autocapitalize="off" autocomplete="off" autocorrect="off"> 
                            <script type="text/javascript">
                                  $('#txtSearch').keydown(function (e){
                                    if(e.keyCode == 13){
                                        submitForm(); /*TODO:: this code shouldn't be needed. I.e. the enter key should work and submit the input form without this code*/
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


                     <!-- starts history range slider -->
                     <ion-item class="ion-no-padding hidden" id="ionSlider" lines="none">
                    <script>
                     document.write('<ion-range ion-padding-start id="dual-range" dual-knobs pin color="dark" min="'+minYear+'" max="'+maxYear+'" step="1">');
                    </script>
                        <button type="button" class="clean-button-no-fill" id="sliderCircleRight" onclick="openDateEnd();" slot="end">
                          <script>
                            document.write('<span id="calendarDayRight">'+removeZeroInDay("<%=dateEndDay%>")+'</span>'+
                                          '<br>'+
                                          '<span id="calendarMonthRight">'+getMonthShortName("<%=dateEndMonth%>")+'</span><br>'+ 
                                          '<span id="calendarYearRight"><%=dateEndYear%></span>');
                          </script>                         

                        </button>                                                              
                        <input size="10" class="display-none" type="text" id="dateStart_top" name="dateStart" value="<%=dateStartString%>" />
                        <input size="10" class="display-none" type="text" id="dateEnd_top" name="dateEnd" value="<%=dateEndString%>" />
                      

                        <button type="button" class="clean-button-no-fill" id="sliderCircleLeft" slot="start" onclick="openDateStart()">
                          <script type="text/javascript">
                            document.write('<span id="calendarDayLeft">'+removeZeroInDay("<%=dateStartDay%>")+'</span><br>');
                            document.write('<span id="calendarMonthLeft">'+getMonthShortName("<%=dateStartMonth%>")+'</span>');
                          </script>                                                  
                          <br>
                          <span id="calendarYearLeft"><%=dateStartYear%></span>
                        </button>
                        
                        <script type="text/javascript">
                          function openDateStart(){
                            $('#ionDateStart').click();
                           return;        
                          }       
                          function openDateEnd(){
                            $('#ionDateEnd').click();
                           return;        
                          }                                              
                        </script>                              
                      </ion-range>
                      <script type="text/javascript">
                        /* Input string in format 01/02/2001
                         * sets year in ionic date format 1996-01-31T00:00:00+01:00 
                         * Output void
                        */ 
                        function updateIonYear(dateStartValue, elementSelector){
                          dateStartTokens = dateStartValue.split("/");
                          dateYear = dateStartTokens[2];
                          top.alert(dateYear);
                          $(elementSelector).val( dateYear + $(elementSelector).val().slice(4));
                          alert($(elementSelector).val());
                        }
                      </script>
                      <script type="text/javascript">
                      $('#ionDateStart').on("ionChange", function() {
                        var newStartDate = $('#ionDateStart').val();
                        var newStartDateTokens = newStartDate.split('-');
                        var newStartDateFormated =  newStartDateTokens[2].split('T')[0] + "/" + newStartDateTokens[1]+ "/"+ newStartDateTokens[0]; 

                        /*ionic uses the date format 1996-01-31T00:00:00+01:00  , we need to convert the date to our own date format i.e.  31/01/1996 */
                        $('#dateStart_top').attr("value", newStartDateFormated);

                        //update span with new date
                        $('#calendarDayLeft').text( removeZeroInDay( newStartDateTokens[2].split('T')[0] ) );
                        $('#calendarMonthLeft').text( getMonthShortName(newStartDateTokens[1]) );
                        $('#calendarYearLeft').text( newStartDateTokens[0] );

                        var currentDateEnd = $('#calendarYearRight').text();
                        //update dual range
                        dualRange.value = { lower: newStartDateTokens[0], upper: currentDateEnd };
                        $('#dateStart_top').change();
                      });                         


                      $('#ionDateEnd').on("ionChange", function() {
                        var newEndDate = $('#ionDateEnd').val();
                        var newEndDateTokens = newEndDate.split('-');
                        var newEndDateFormated =  newEndDateTokens[2].split('T')[0] + "/" + newEndDateTokens[1]+ "/"+ newEndDateTokens[0]; 

                        /*ionic uses the date format 1996-01-31T00:00:00+01:00  , we need to convert the date to our own date format i.e.  31/01/1996 */
                        $('#dateEnd_top').attr("value", newEndDateFormated);

                        //update span with new date
                        $('#calendarDayRight').text( removeZeroInDay( newEndDateTokens[2].split('T')[0] ) );
                        $('#calendarMonthRight').text( getMonthShortName(newEndDateTokens[1]) );
                        $('#calendarYearRight').text( newEndDateTokens[0] );

                        var currentDateStart = $('#calendarYearLeft').text();
                        //update dual range
                        dualRange.value = { lower: currentDateStart, upper: newEndDateTokens[0]  };
                        $('#dateEnd_top').change();
                      });                                             


                     changedDualRange = false;
                      $('#dual-range').on("ionChange", function() {
                        changedDualRange = true;
                        $('#calendarYearRight').text(document.querySelector('#dual-range').value.upper);
                        $('#calendarYearLeft').text(document.querySelector('#dual-range').value.lower);
                      }); 

                      setInterval(function(){
                        if(changedDualRange == true && $('#dual-range').hasClass("range-pressed")){
                            changedDualRange = false;
                            var newDateStart = '<%=dateStartString%>'.substr(0,6)+document.querySelector('#dual-range').value.lower;
                            var newDateEnd = '<%=dateEndString%>'.substr(0,6)+document.querySelector('#dual-range').value.upper;
                            $('#dateStart_top').val(newDateStart);
                            $('#dateStart_top').attr("value", newDateStart);
                            $('#dateEnd_top').val(newDateEnd);
                            $('#dateEnd_top').attr("value", newDateEnd);
                            $('#dateStart_top').change();
                           
                        }
                      },100) 
                                                                        
                      </script>  
                      <script type="text/javascript">
                      $('#dateStart_top').on("change", submitForm);
                      $('#dateEnd_top').on("change", submitForm);

                      </script> 
                      <script type="text/javascript">
                        $( document ).ready(function() {
                            $("#ionSlider").removeClass("hidden");
                        });     
                      </script>
                                     
                      <script>
                        const dualRange = document.querySelector('#dual-range');
                        dualRange.value = { lower: "<%=dateStartYear%>", upper: "<%=dateEndYear%>" };
                      </script>                  
                      </ion-item>
                     <!-- ends history range slider -->

                     <!-- starts Paginas and images links option -->
                     <div id="searchBarButtonsDiv"><br>                       
                       <script type="text/javascript">
                         document.write('<a id="PageButton" class="pageLink advancedSearch" href=javascript:void(0)><span><fmt:message key='home.pages'/></span></a>');
                         document.write('<a id="ImageButton" class="advancedSearch selected-button imageLink" href=javascript:void(0)><span><fmt:message key='images.images'/></span></a>');
                         document.write('<a id="advancedSearchButton" class="advancedSearch "href="'+advancedHref+'"><span><fmt:message key='topbar.menu.advanced'/></span></a> ');
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
<!-- End HomePageHeaderMobile -->