 jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

function createErrorPage(){
  ARQUIVO.getSearchNoResultsHtml().insertBefore("#resultados-lista");
    //$( window ).resize(function() {$('#conteudo-pesquisa-erro').css('margin-left', $('#search-dateStart_top').offset().left)}); /*dirty hack to keep message aligned with not responsive searchbox*/$( window ).resize(function() {$('.spell').css('margin-left', $('#search-dateStart_top').offset().left)}); /*dirty hack to keep message aligned with not responsive searchbox*/
}

// returns an object with query and the extracted special parameters
function extractQuerySpecialParameters(inputQuery) {
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
}

function formatURLForPresentation(originalURL) {
	return originalURL.replace(/^(http(s)?\:\/\/(www\.)?)?/,'').replace(/\/$/,'');
}

function searchPages(startIndex){
    var input = $('#txtSearch').val();

    var dateStart=$('#dateStart_top').val().substring($('#dateStart_top').val().length - 4) +''+  $('#dateStart_top').val().substring(3,5) +''+ $('#dateStart_top').val().substring(0,2)+ '000000' ;

    var dateEnd= $('#dateEnd_top').val().substring($('#dateEnd_top').val().length - 4) +''+  $('#dateEnd_top').val().substring(3,5) +''+ $('#dateEnd_top').val().substring(0,2)+'235959';

    var extractedQuery = extractQuerySpecialParameters(input);

    const deduplicationPerHostname = extractedQuery.site.length == 0

    $.ajax({
		url: textSearchAPI,
    	dataType: 'text',
    	type: 'GET',
		timeout: 300000,
		data: {
			q: extractedQuery.query,
			from: dateStart,
			to: dateEnd,
			offset: startIndex,
			maxItems: hitsPerPage,
			siteSearch: extractedQuery.site,
			type: extractedQuery.type,
			collection: extractedQuery.collection
		},

		error: function() {
			console.log("Error when calling text search API");
		},

		success: function(data) {
			console.log("Processing page search API result...");
			$('#imagesDefaultTextDiv').hide(); /*Hiding default message*/

			var responseJson = $.parseJSON(data);

			totalResults = parseInt(responseJson.estimated_nr_results);
			var showNextPageButton = ((parseInt(startIndex) + hitsPerPage) >= totalResults) ? false: true;

			if ( totalResults === 0){
	            createErrorPage();
	            noMoreResults=true;
	            //loadingFinished(showNextPageButton);
	        }
	        else{

	            var currentResults
	            if(totalResults > hitsPerPage){
	              currentResults = responseJson.response_items.length;
	            }else{
	              currentResults = totalResults;
	              noMoreResults=true;
	            }
	            var resultsToLoad = currentResults;

	            var previousResultHostname, previousResultURL;
	            for (var i=0; i< currentResults; i++){
	                var currentDocument = responseJson.response_items[i];
	                if (typeof currentDocument === 'undefined' || !currentDocument) {
	                    continue;
	                }
	                var currentResultGlobalPosition = parseInt(startIndex) + i + 1;

	                var title = currentDocument.title;
	                var originalURL = currentDocument.originalURL;
	                var url = new URL(originalURL);
	                var hostname = url.hostname;
	                var urlPresentation = formatURLForPresentation(currentDocument.originalURL);
	                var linkToArchive = currentDocument.linkToArchive;
	                var snippet = currentDocument.snippet;
	                var mimeType = currentDocument.mimeType;
	                var primaryMimeType = mimeType.split('/')[0];
	                var secondaryMimeType = mimeType.split('/')[1];

					var year = parseInt(currentDocument.tstamp.substring(0,4));
					var month = Content.months[currentDocument.tstamp.substring(4,6)];
					var day = parseInt(currentDocument.tstamp.substring(6,8));

					var duplicatedWithPrevious = deduplicationPerHostname ? previousResultHostname === url.hostname : previousResultURL === originalURL;
	                previousResultHostname = url.hostname;
	                previousResultURL = originalURL;

					var liAttributes = duplicatedWithPrevious ? 'class="grouped"' : '';

	                if (title.trim().length == 0)  {
	                	title = originalURL;
	                }

	                var mimeTypePresentation = primaryMimeType !== 'text' ? `<span class="mime">[${secondaryMimeType.toUpperCase()}]</span>` : '';

	                var currentResultCode = `
	                	<li ${liAttributes} onclick="ga('send', 'event', 'Search result', 'Page search', 'Result position', ${currentResultGlobalPosition}); window.location='${linkToArchive}'; ">
							<div class="urlBlock">
								<p class="url" title="${urlPresentation}">→ ${urlPresentation}</p>
								<a href="${linkToArchive}">
								    <div class="border-bottom"></div>
								    <h2>
								    	${mimeTypePresentation}
								    	${title}
								    </h2>
							    </a>
				                <div class="list-versions-div">
				                	<span class="date"> ${day} ${month}, ${year} </span>
				                </div>
							</div>
							<div class="summary">
								<span class="resumo">
									${snippet}
								</span>
							</div>
	                	</li>
	                `;

	                // append result item to ul inside the resultados-lista div
					document.getElementById("resultados-lista").children[0].insertAdjacentHTML('beforeend', currentResultCode);
	            }
	        }

	        document.getElementById("nextPageSearch").style.display = totalResults > (start + hitsPerPage) ? 'block' : 'none';

	        var previousPageSearch = document.getElementById("previousPageSearch");
	        if ( typeof(previousPageSearch) != 'undefined' && previousPageSearch != null ) {
	        	previousPageSearch.style.display = start > 0 ? 'block' : 'none';
	        }

	        document.getElementById("estimated-results-value").innerHTML = totalResults.toLocaleString(language);
	        document.getElementById("estimated-results").style.display = totalResults > 0 ? 'block' : 'none';
	        document.getElementById("loadingDiv").style.display='none';
		}
	});
}

searchPages(start);
