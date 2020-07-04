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

function emphasizeText(textToBeEmphasized, emphasizeText) {
	var resultText = textToBeEmphasized;
	emphasizeText.split(' ').forEach(function(emphasizeWord) {
		if (emphasizeWord != 'e' && emphasizeWord != 'm' && emphasizeWord != 'em') {
			// can not use replace text with ignore case because it will change the case of the original text
			const from = resultText.toLowerCase().indexOf(emphasizeWord.toLowerCase());
			const to = from + emphasizeWord.toLowerCase().length;
			if (from >= 0) {
				const originalText = resultText.substring(from, to);
				resultText = resultText.substring(0, from) + '<em>'+originalText+'</em>' + resultText.substring(to, resultText.length );
			}
		}
	});
	return resultText;
}

function searchPages(startIndex){
	var client_id = ARQUIVO.getClientId(20);
	var search_id = ARQUIVO.generateId(20);
	var trackingId = client_id + '_' + search_id;

    var inputQuery = $('#txtSearch').val();

    var dateStart=$('#dateStart_top').val().substring($('#dateStart_top').val().length - 4) +''+  $('#dateStart_top').val().substring(3,5) +''+ $('#dateStart_top').val().substring(0,2)+ '000000' ;

    var dateEnd= $('#dateEnd_top').val().substring($('#dateEnd_top').val().length - 4) +''+  $('#dateEnd_top').val().substring(3,5) +''+ $('#dateEnd_top').val().substring(0,2)+'235959';

    var extractedQuery = ARQUIVO.extractQuerySpecialParameters(inputQuery);

    const deduplicationPerHostname = extractedQuery.site.length == 0

    // Add information to export SERP functionality with query arguments
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.queryArgument, Content.exportSERP.pageSearch.queryValue);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.query, extractedQuery.query);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.from, dateStart);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.to, dateEnd);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.offset, startIndex);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.maxItems, hitsPerPage);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.siteSearch, extractedQuery.site);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.type, extractedQuery.type);
    ARQUIVO.exportSERPSaveLine(Content.exportSERP.pageSearch.collection, extractedQuery.collection);
    ARQUIVO.exportSERPSaveLine(); // Add an empty line after all the arguments

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
			collection: extractedQuery.collection,
			trackingId: trackingId
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

	            // add headers to export SERP
	            ARQUIVO.exportSERPSaveLine("Results");
	            ARQUIVO.exportSERPSaveLine(
	            	Content.exportSERP.pageSearch.year,
					Content.exportSERP.pageSearch.month,
					Content.exportSERP.pageSearch.day,
					Content.exportSERP.pageSearch.timestamp,
					Content.exportSERP.pageSearch.originalURL,
					Content.exportSERP.pageSearch.linkToArchive,
					Content.exportSERP.pageSearch.linkToScreenshot,
					Content.exportSERP.pageSearch.linkToExtractedText,
					Content.exportSERP.pageSearch.collection,
					Content.exportSERP.pageSearch.mimeType,
					Content.exportSERP.pageSearch.title,
					Content.exportSERP.pageSearch.snippet 
				);

	            for (var i=0; i< currentResults; i++){
	                var currentDocument = responseJson.response_items[i];
	                if (typeof currentDocument === 'undefined' || !currentDocument) {
	                    continue;
	                }
	                var currentResultGlobalPosition = parseInt(startIndex) + i + 1;

	                var title = emphasizeText(currentDocument.title, extractedQuery.query);
	                var originalURL = currentDocument.originalURL;
	                var url = new URL(originalURL);
	                var hostname = url.hostname;
	                var urlPresentation = ARQUIVO.formatURLForPresentation(currentDocument.originalURL);
	                var linkToArchive = currentDocument.linkToArchive;
	                var linkToArchiveWithTracking = "/page/view/" + trackingId + "_" + (i+1) + linkToArchive.substring(linkToArchive.indexOf("/wayback")+"/wayback".length);
	                var snippet = currentDocument.snippet;
	                var mimeType = currentDocument.mimeType;
	                var primaryMimeType = mimeType.split('/')[0];
	                var secondaryMimeType = mimeType.split('/')[1];

					var year = parseInt(currentDocument.tstamp.substring(0,4));
					var month = Content.months[currentDocument.tstamp.substring(4,6)];
					var day = parseInt(currentDocument.tstamp.substring(6,8));

					var groupedWithPrevious = deduplicationPerHostname ? previousResultHostname === url.hostname : previousResultURL === originalURL;
	                previousResultHostname = url.hostname;
	                previousResultURL = originalURL;

	                if (title.trim().length == 0)  {
	                	title = originalURL;
	                }

	                var mimeTypePresentation = primaryMimeType !== 'text' ? '<span class="mime">['+secondaryMimeType.toUpperCase()+']</span>' : '';

					var liAttributes = '';
	                var viewMoreForSameSiteContent = '';

	                if (groupedWithPrevious) {
	                	liAttributes = 'class="grouped"';
	                }
	                if (groupedWithPrevious && extractedQuery.site.length == 0) {
	                	const newQuery = inputQuery + " site:"+ previousResultHostname;
	                	const viewMoreForSameSiteLinkHref = ARQUIVO.replaceUrlParam(window.location.href, "query", newQuery);
						viewMoreForSameSiteContent = 
							'<div class="viewMoreForSameSiteLink">'+
								'<a href="'+viewMoreForSameSiteLinkHref+'">'+
									Content.search.viewMoreForSameSite+' '+previousResultHostname+
								'</a>'+
							'</div>';
	                }

	                var currentResultCode = 
	                	'<li '+liAttributes+' onclick="ga(\'send\', \'event\', \'Search result\', \'Page search\', \'Result position\', '+currentResultGlobalPosition+'); window.location=\''+linkToArchive+'\'; ">'+
							'<div class="urlBlock">'+
								'<p class="url" title="'+urlPresentation+'">→ '+urlPresentation+'</p>'+
								'<a href="'+linkToArchiveWithTracking+'">'+
								    '<div class="border-bottom"></div>'+
								    '<h2>'+
								    	mimeTypePresentation+
								    	title+
								    '</h2>'+
							    '</a>'+
				                '<div class="list-versions-div">'+
				                	'<span class="date"> '+day+' '+month+', '+year+' </span>'+
				                '</div>'+
							'</div>'+
							'<div class="summary">'+
								'<span class="resumo">'+
									snippet+
								'</span>'+
							'</div>'+
							viewMoreForSameSiteContent+
	                	'</li>'
	                ;

	                // append result so it can be exported
	                ARQUIVO.exportSERPSaveLine(
	                	year,
						month,
						day,
						currentDocument.tstamp,
						currentDocument.originalURL,
						currentDocument.linkToArchive,
						currentDocument.linkToScreenshot,
						currentDocument.linkToExtractedText,
						currentDocument.collection,
						currentDocument.mimeType,
						currentDocument.title,
						currentDocument.snippet 
					);

	                // append result item to ul inside the resultados-lista div
					document.getElementById("resultados-lista").children[0].insertAdjacentHTML('beforeend', currentResultCode);
	            }

	        }

			ARQUIVO.exportSERPFinishSearch('page_search', totalResults);

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
