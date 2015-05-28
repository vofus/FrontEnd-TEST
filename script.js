$(document).ready(function() {
    $("#search-term").submit(function(event) {

        console.log("button hit");
        console.log($('#query').val());

        event.preventDefault();
        var searchString = $('#query').val();
        console.log(searchString);
        var endpoint = "https://www.googleapis.com/youtube/v3/search"
        getRequest(endpoint, searchString);

    });
});

function getRequest(endpoint, searchString) {
    var params = {
        part: 'snippet',
        key: 'AIzaSyBwdu4neoU_ISRP4b_lSr7bP8dbnknLjPQ',
        q: searchString,
        maxResults: 20
    };

    $.getJSON(endpoint, params, function(data) {
        console.log("get json called");
        console.log("params: " + params.part + params.key + params.q + params.maxResults);
        console.log(data);
        ytdata = data;
        showResults(data.items, 0, 5);
        //console.log("data.items: " + data.items);
    });
}


function showResults(results, startPage, endPage) {
    var html = "<ul>";
    var navBtns = "";
    var pageResults = results.slice(startPage, endPage); // default (0, 5)
    $.each(pageResults, function(index, value) {
        var discStr = "";
        if (value.snippet.title.length > 60) {
          discStr = value.snippet.title.slice(0, 60);
          discStr += "...";
        } else {
          discStr = value.snippet.title;
        }
        thumbNailImgUrl = value.snippet.thumbnails.default.url;
        html += "<li>"
        html += '<a href="https://www.youtube.com/watch?v=' + value.id.videoId + '">';
        html += ("<img src=" + value.snippet.thumbnails.default.url + ">");
        html += '</a>';
        html += '<a class="discription" href="https://www.youtube.com/watch?v=' + value.id.videoId + '">' + discStr + '</a>';
        html += "</li>";
        console.log("Title: " + discStr);
        console.log("Title length: " + discStr.length);
    });
    html += "</ul>";        
    $('#search-results').html(html);
    navBtns +=  '<button id="page_1">1</button>' + 
                '<button id="page_2">2</button>' +
                '<button id="page_3">3</button>' +
                '<button id="page_4">4</button>';
    $('#nav-buttons').html(navBtns);

    $("button#page_1").click(function() { showResults(results, 0, 5); });
    $("button#page_2").click(function() { showResults(results, 5, 10); });
    $("button#page_3").click(function() { showResults(results, 10, 15); });
    $("button#page_4").click(function() { showResults(results, 15, 20); });
}