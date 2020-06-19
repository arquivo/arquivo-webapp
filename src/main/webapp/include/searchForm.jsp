<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>

<div class="row">
  <div class="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">

    <form id="searchForm" action='<%= formAction %>'>
      <input type="hidden" name="hitsPerPage" value="<%= hitsPerPage %>">

      <div id="form_container">

        <div id="searchBarBlock" class="input-group stylish-input-group">
          <input name="query" id="txtSearch" value="<c:out value = "${htmlQueryString}"/>" type="search" class="form-control no-radius search-input swiper-no-swiping" placeholder="<fmt:message key='home.search.placeholder'/>" autocapitalize="off" autocomplete="off" autocorrect="off">
          <script type="text/javascript">
            $('#txtSearch').keydown(function (e){
              if(e.keyCode == 13){
                  submitForm();
              }
            });
            function submitForm() {
              $('.search-button').click();
            }

          </script>
          <input type="hidden" id="l" name="l" value="<%=language%>">
        </div>
        <!-- starts search lupe and "x" close button -->
        <div>
          <span id="buttonSearch" class="input-group-addon no-radius search-button-span">
            <button class="search-button" type="submit">
              <fmt:message key="search.submit" />
            </button>
          </span>

          <!-- force to have at least some height to make the DOM more fixed to user when loading -->
          <div style="min-height: 135px">
            <%@ include file="/include/datePickerComponent.jsp" %>
          </div>

          <!-- starts Paginas and images links option -->
          <div id="searchBarButtonsDiv">
            <br/>
            <script type="text/javascript">
              document.write(ARQUIVO.getSearchButtonsHTML("<%= advancedSearchAction %>"));
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
