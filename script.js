$(document).ready(function() {
    $("#search-term").submit(function(event) {

        // console.log("button hit");
        // console.log($('#query').val());

        event.preventDefault();
        var searchString = $('#query').val();
        // console.log(searchString);
        var endpoint = "https://www.googleapis.com/youtube/v3/search";
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
        // console.log("get json called");
        // console.log("params: " + params.part + params.key + params.q + params.maxResults);
        // console.log(data);
        ytdata = data;
        showResults(data.items, 0, 5);
        // console.log("data.items: " + data.items);
        //console.log(data.items[1].snippet.title);

        $("button#sortBtn").click(function() { // Вызов сортировки по имени
            sortElements(data.items);
        });

        $("#filter").keyup(function() {       // Вызов фильтра по имени
          liveFilter(data.items);
          //console.log("Нажимаем кнопки в #filter"); // Проверка привязки события к форме
        });
    });
}

function liveFilter(filterElements) {     // Фильтр по имени
  var filterRes = $("#filter").val();
  var myExp = new RegExp(filterRes, "i");
  var refreshElements = [];
  $.each(filterElements, function(key, val) {
    if (val.snippet.title.search(myExp) != -1) {
      refreshElements.push(filterElements[key]);
      // console.log("test");
    }
  });
  showResults(refreshElements, 0, 5);

  $("button#sortBtn").click(function() { // Переопределение сортировки по имени
      sortElements(refreshElements);     // для сортировки отфильтрованного массива 
  });

  // console.log(refreshElements);
}

function sortElements(elements) {       // Сортировка по имени
    var sorting = elements.sort(function(obj1, obj2) {
      var a = obj1.snippet.title.toLowerCase();
      var b = obj2.snippet.title.toLowerCase();
      // title каждого элемента приводится к нижнему регистру,
      // чтобы на порядок сортировки не влияли заглавные буквы
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    // console.log(sorting);
    showResults(sorting, 0, 5);
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
        html += "<li>";
        html += '<a target="_blank" href="https://www.youtube.com/watch?v=' + value.id.videoId + '">';
        html += ("<img src=" + value.snippet.thumbnails.default.url + ">");
        html += '</a>';
        html += '<a target="_blank" class="discription" href="https://www.youtube.com/watch?v=' + value.id.videoId + '">' + discStr + '</a>';
        html += "</li>";
        //console.log("Title: " + discStr);
        //console.log("Title length: " + discStr.length);
    });
    html += "</ul>";        
    $('#search-results').html(html);
    
    if (results.length > 0 && results.length <= 5) {
      navBtns +=  '<button id="page_1">1</button>';
    } else if (results.length > 5 && results.length <= 10) {
      navBtns +=  '<button id="page_1">1</button>' + 
                  '<button id="page_2">2</button>';
    } else if (results.length > 10 && results.length <= 15) {
      navBtns +=  '<button id="page_1">1</button>' + 
                  '<button id="page_2">2</button>' +
                  '<button id="page_3">3</button>';
    } else if (results.length > 15 && results.length <= 20) {
      navBtns +=  '<button id="page_1">1</button>' + 
                  '<button id="page_2">2</button>' +
                  '<button id="page_3">3</button>' +
                  '<button id="page_4">4</button>';
    }
    $('#nav-buttons').html(navBtns);

    $("button#page_1").click(function() { showResults(results, 0, 5); });
    $("button#page_2").click(function() { showResults(results, 5, 10); });
    $("button#page_3").click(function() { showResults(results, 10, 15); });
    $("button#page_4").click(function() { showResults(results, 15, 20); });
}