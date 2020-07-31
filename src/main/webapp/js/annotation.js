var results = {}

var redB = "rgba(255,0,0,0.4)"
var red = "rgba(255,0,0)"
var yellowB = "rgba(255,255,0,0.4)"
var yellow = "rgba(255,255,0)"
var greenB = "rgba(0,255,0,0.4)"
var green = "rgba(0,255,0)"
var gray = "rgba(200,200,200)"


var type = null
var div = null
var divResId = null
var divChild = null
var nRows = null
var query = null
var queryString = null

var relevance = {
    "-1": {"color": gray, "colorB": gray, "value": "Not annotated"}, 
    "0": {"color": red, "colorB": redB, "value": "Not relevant"}, 
    "1": {"color": yellow, "colorB": yellowB, "value": "Partially relevant"}, 
    "2": {"color": green, "colorB": greenB, "value": "Highly relevant"}
}

var defaultRelevance = -1
var selectedPosition = 0

function changeRelevance(relevanceLocal, id){
    

    var results = JSON.parse(window.localStorage.getItem('annotations'))
    results[type]["queries"][queryString]["results"][id]["relevance"] = relevanceLocal
    window.localStorage.setItem('annotations', JSON.stringify(results))
    $('[id="' + id + '"]').parent().parent().attr("style", "background-color: " + relevance[relevanceLocal].colorB +" !important;"); 
}


function prepareAnnotator(type, div){
    console.log("prepareAnnotator")

    var storage = window.localStorage.getItem('annotations')
    var results = {"image": {"queries": {}}, "page": {"queries": {}}}
    if (storage)
        results = JSON.parse(storage)

    if (!results[type]["queries"][queryString]){
        results[type]["queries"][queryString] = {}
        results[type]["queries"][queryString]["results"] = {}
    }
    
    $(div).each(function( index ) {
        var position = null
        var id = null
        var metadata = {}
        if (type == 'page'){
            position = index
            id = $( this ).find("a")[0].href.split("/").slice(6).join('/')
            metadata["url"] = id.split("/").slice(1).join('/')
            metadata["timestamp"] = id.split("/")[0]
            metadata["position"] = position
        } else if (type == 'image'){
            position = $( this ).attr("position")
            id = $( "#insert-card-" + position ).find("img").attr("data-src")
            metadata["url"] = id.split("/").slice(1).join('/')
            metadata["timestamp"] = id.split("/")[0].substring(0,"20081029060647".length)
            //id = metadata["timestamp"] + '/' + metadata["url"]
            metadata["position"] = position
        }

        var buttonDiv = $(document.createElement('div'))
        $( this ).append(buttonDiv)
        for (var relevanceLocal=0; relevanceLocal < 3; relevanceLocal++){
            var button = document.createElement('input')
            button.type = 'button';
            button.id = position+relevance[relevanceLocal].value;
            button.alt = relevanceLocal
            button.value = relevance[relevanceLocal].value;
            button.style = "height: 70px; margin-top: 10px; width: 33%; background-color: " + relevance[relevanceLocal].colorB
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var relevanceLocal = parseInt($( this ).attr("alt"))
                changeRelevance(relevanceLocal, id)
            }, false);
            buttonDiv.append(button)
        }
        var divId = document.createElement('div')
        divId.id = id
        divId.setAttribute('class', 'ids');

        buttonDiv.append(divId)

        if (!results[type]["queries"][queryString]["results"][id]){
            var relevanceLocal = defaultRelevance
            results[type]["queries"][queryString]["results"][id] = {}
            results[type]["queries"][queryString]["results"][id]["relevance"] = relevanceLocal
            results[type]["queries"][queryString]["results"][id]["metadata"] = metadata
            window.localStorage.setItem('annotations', JSON.stringify(results))
        } else {
            var relevanceLocal = results[type]["queries"][queryString]["results"][id]["relevance"]
        }
        changeRelevance(relevanceLocal, id)
        
    })

    window.localStorage.setItem('annotations', JSON.stringify(results))
}

function toggleRelevance(diff){
    var divId = $($($(divResId).children(divChild)[selectedPosition])[0])
    var id = ""
    if (type == 'page'){
        id = divId.find("a")[0].href.split("/").slice(6).join('/')
    } else if (type == 'image'){
        id = divId.find("img")[0].attr("data-src").split("/").slice(4).join('/')
    }
    var results = JSON.parse(window.localStorage.getItem('annotations'))
    var relevanceLocal = (results[type]["queries"][queryString]["results"][id]["relevance"]+diff)%(Object.keys(relevance).length-1)
    if (relevanceLocal < 0)
        relevanceLocal = Object.keys(relevance).length-2
    changeRelevance(relevanceLocal, id)
}

function turnOffAnnotations(){
    window.localStorage.setItem('annotate', "false");
    location.reload(); 
}

function toggleKeyboardNavigation(){
    const annotateKeyboard = (window.localStorage.getItem('annotateKeyboard') == "true")
    window.localStorage.setItem('annotateKeyboard', !annotateKeyboard);
}

function exportAnnotations() {

  var filename = "annotations.json"
  var text = JSON.stringify(JSON.parse(window.localStorage.getItem('annotations')), null, 2);
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function changePosition(position, childrenCount, nCols){
    if (position < 0){
        position = childrenCount+position
    } else {
        position = position%childrenCount
    }
    
    $($(divResId).children(divChild)[selectedPosition]).css("border-width", "0px");
    selectedPosition = position
    $($(divResId).children(divChild)[selectedPosition]).css("border-width", "5px");
    $($(divResId).children(divChild)[selectedPosition]).css("border-color", "black");

    $($(divResId).children(divChild)[selectedPosition])[0].scrollIntoView(false);
}


$( document ).ready(function() {

    const urlQueryString = window.location.search;
    const urlParams = new URLSearchParams(urlQueryString);
    const annotateQS = urlParams.get('annotate')
    queryString = $("#txtSearch")[0].value + " " + $("#dateStart_top")[0].value + " " + $("#dateEnd_top")[0].value

    if (annotateQS == "true"){
        window.localStorage.setItem('annotate', "true");
    } else if (annotateQS == "false"){
        window.localStorage.setItem('annotate', "false");
    }  

    const annotate = (window.localStorage.getItem('annotate') == "true")
    
    if (annotate){
        var exportAnnotationsButton = $(document.createElement('a'))
        exportAnnotationsButton.attr("id", "exportAnnotationsButton")
        exportAnnotationsButton.attr("class", "advancedSearch")
        exportAnnotationsButton.attr("href", "#")
        exportAnnotationsButton.attr("onclick", "exportAnnotations()")
        exportAnnotationsButton.html("<span style='color: white'>Exportar anotações</span>")
                
        var turnOffAnnotationsButton = $(document.createElement('a'))
        turnOffAnnotationsButton.attr("id", "turnOffAnnotationsButton")
        turnOffAnnotationsButton.attr("class", "advancedSearch")
        turnOffAnnotationsButton.attr("href", "#")
        turnOffAnnotationsButton.attr("onclick", "turnOffAnnotations()")
        turnOffAnnotationsButton.html("<span style='color: white'>Desligar modo anotação</span>")

        var hiddenFiles = $(document.createElement('input'))
        hiddenFiles.attr("id", "files")
        hiddenFiles.attr("type", "file")
        hiddenFiles.attr("name", "files")
        hiddenFiles.attr("style", "display: none")

        var hiddenDownload = $(document.createElement('a'))
        hiddenDownload.attr("id", "link")
        hiddenDownload.attr("style", "display: none")

        const urlqueryString = window.location.search;
        const urlParams = new URLSearchParams(urlqueryString);
        var startValue = urlParams.get('start')
        if (startValue == null)
            startValue = 0
        else
            startValue = parseInt(startValue)
        startValue += 1

        var nRes = 0
        if (window.location.href.includes("arquivo.pt/image/search")){
            type = "image"  
            div = ".imageContent"
            divResId = "#photos"
            divChild = "div"
            nRows = 3
            nRes = 24
        } else if (window.location.href.includes("arquivo.pt/page/search")){
            type = "page"
            div = "li[onclick]"
            divResId = "#resultados-lista ul:first-child"
            divChild = "li"
            nRows = 10
            nRes = 10
        }

        var start = $(document.createElement('p'))
        start.attr("id", "startend")
        start.html("<span>" + startValue + " até " + (startValue+nRes) + "</span>")

        $("#searchBarButtonsDiv").append(exportAnnotationsButton)
        $("#searchBarButtonsDiv").append(turnOffAnnotationsButton)
        $("#searchBarButtonsDiv").append(start)
        $("#searchBarButtonsDiv").append(hiddenFiles)
        $("#searchBarButtonsDiv").append(hiddenDownload)

        var interval = window.setInterval(function(){
            if ($(div).length > 0){
                clearInterval(interval)
                prepareAnnotator(type, div)
            }
        }, 500);

        document.addEventListener('keydown', function(event) {
            if (event.code == 'F1') {
                toggleKeyboardNavigation()
            } else if (window.localStorage.getItem('annotateKeyboard') == "true") {
                var childrenCount = $(divResId).children(divChild).length
                var nCols = Math.ceil(childrenCount/nRows)
                if (event.code == 'KeyW') {
                    changePosition(selectedPosition-nCols, childrenCount, nCols)
                } else if (event.code == 'KeyS') {
                    changePosition(selectedPosition+nCols, childrenCount, nCols)
                } else if (event.code == 'KeyA') {
                    changePosition(selectedPosition-1, childrenCount, nCols)
                } else if (event.code == 'KeyD') {
                    changePosition(selectedPosition+1, childrenCount, nCols)
                } else if (event.code == 'KeyQ') {
                    toggleRelevance(1)
                } else if (event.code == 'KeyE') {
                    toggleRelevance(-1)
                } else if (event.code == 'Digit1') {
                    $(divResId).find(".ids").each(function( index ) {
                        var results = JSON.parse(window.localStorage.getItem('annotations'))
                        if (results[type]["queries"][queryString]["results"][$( this )[0].id]["relevance"] == -1)
                            changeRelevance(0, $( this )[0].id)
                    })
                } else if (event.code == 'Digit2') {
                    $(divResId).find(".ids").each(function( index ) {
                        var results = JSON.parse(window.localStorage.getItem('annotations'))
                        if (results[type]["queries"][queryString]["results"][$( this )[0].id]["relevance"] == -1)
                            changeRelevance(1, $( this )[0].id)
                    })
                } else if (event.code == 'Digit3') {
                    $(divResId).find(".ids").each(function( index ) {
                        var results = JSON.parse(window.localStorage.getItem('annotations'))
                        if (results[type]["queries"][queryString]["results"][$( this )[0].id]["relevance"] == -1)
                            changeRelevance(2, $( this )[0].id)
                    })
                } else if (event.code == 'KeyR') {
                    document.location = $("#nextImage").children()[0].href
                } else if (event.code == 'KeyT') {
                    document.location = $("#previousImage").children()[0].href
                }
            }
        });
    }
})  

