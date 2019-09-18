/*
This file handles the logic of the application and communicating with the Express server.
© 2019 Rocket Software, Inc. or its affiliates. All Rights Reserved
Written by Andrew Gorovoy
*/



//Fields used to store data for the application which will translate to elements in the application

var i;
var prodData = [];
var watchLater = [];
var studios = [];
var years = [];
var producers = [];
var disStudios, disYears, disProducers;
var initInfo = true;
var expanded = false;




getProdMapData();


/*
This function initalizes many aspects of the application. On the initial rendering
of the first screen, this function places listeners on many inputs areas, buttons, and links across the application.
*/
$(document).ready(function() {
    $("#searchBar").on("keyup", function() { return searchTable($(this).val().toLowerCase()); });
    $('#prodList td a.link-prod-info').on("click", showProdInfo);
    $('#watchLater').on("click", addToWatchLater);
    $('#watchNow').on('click', watchNow);
    $('#switch').on('click', switchInfo);
    $('#filterReset,#eraser').on('click', clearFilters);
});


/*
Resets all filters. Makes new call to MVIS and populates table with fresh movie data.
*/
function clearFilters() {
    $('span.filter-header.display-num').text("Display: ");

    $('span.filter-header.rating').text("Rating: ");
    $('span.filter-header.rating').attr('value', "null");

    $('span.filter-header.genre').text("Genre: ");
    $('span.filter-header.genre').attr('value', "null");

    $('span.filter-header.studio').text("Studio: ");
    $('span.filter-header.studio').attr('value', "null");

    $('span.filter-header.theaterdate').text("Year: ");
    $('span.filter-header.theaterdate').attr('value', "null");
    
    $.getJSON('/users/100', function(data) {
        repopulateTable(data, 'all');
    });

}

//Toggle for panel that displays specific movie information
function switchInfo() {
    if (initInfo) {
        alert("Select a Movie to Learn More!");
        return;
    }
    if (expanded) {
        $('#prodInfo').addClass('hidden');
        expanded = false;
        $('#switch').addClass('fa-plus-square');
        $('#switch').removeClass('fa-minus-square');
    } else {
        $('#prodInfo').removeClass('hidden');
        expanded = true;
        $('#switch').removeClass('fa-plus-square');
        $('#switch').addClass('fa-minus-square');

    }
}

/*
This function handles the search mechanism. Scans the rows of the table, hides rows that don't match text comparison. Not case sensitive.
*/
function searchTable(value) {
    $("#prodList tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}

/*
This function actually handles the filtering of the data. This was handled in a 2 step process.

Step 1: Building a Query
In this step, the current state of each filter is read and stored. For each filter option that was selected, that input is formatted into MVIS select query syntax.
Then the actual query string sis built.

Step 2: Get Filtered Data
In this step, this query string is sent over to the express server which then gets the filtered data from MVIS. The main data table is then repopulated with the filtered data.
*/

function filterTable() {
    console.log("Recieved request to filter table!");
    var filters = $("span.filter-header");
    filters.splice(0, 1);
    var qryStr = "";
    var and = ' AND ';
    var value;
    var triggerValue = $(this).attr('value');
    var triggerFilter = $(this).attr('rel');
    console.log(triggerValue);

    if (triggerFilter == 'display-num') {
        console.log(triggerValue);
        displayNum(triggerValue);
        $('span.filter-header.display-num').text("Displaying: " + triggerValue);
        return;
    }

    $.each(filters, function() {
      $('span.filter-header.' + triggerFilter).attr('value', triggerValue);
        var filter = $(this).attr('name');
        filter = filter.toLowerCase();
        filter = filter.replace(/:/g, '');
        value = $(this).attr('value');
        
        
        console.log("Filter: " + filter);
        console.log($(this).attr('name') + ":" + $(this).attr('value'));

        if ((value != "null") || (filter == triggerFilter)) {


            if (filter == 'rating') {
                if (value == 'null') value = triggerValue;
                if (value == "Not Rated") value = "NR";
                console.log("In Rating -->");
                console.log(value);
                var temp = value;
                value = value.replace(/-/g, '');
                var temp = filter + ' = "' + value + '"';
                qryStr += temp + and;
                $('span.filter-header.rating').text("Rating: " + value);
                value = temp;

            }

            if (filter == 'genre') {
                console.log("In Genre -->");
                if (value == 'null') value = triggerValue;
                var temp = filter + ' = "' + value + '"';
                qryStr += temp + and;
                $('span.filter-header.genre').text("Genre: " + value);

            }

            if (filter == 'studio') {
                console.log("In Studio -->");
                if (value == 'null') value = triggerValue;
                var temp = filter + ' = "' + value + '"';
                qryStr += temp + and;
                $('span.filter-header.studio').text("Studio: " + value);
            }

            if (filter == 'producer') {
                console.log("In Producer -->");
                if (value == 'null') value = triggerValue;
                var temp = filter + ' = "' + value + '"';
                qryStr += temp + and;
                $('span.filter-header.producer').text("Producer: " + value);
            }

            if (filter == 'year') {
                console.log("In Year -->");
                if (value == 'null') value = triggerValue;
                var temp;
                years.forEach(function(el) {
                    if (el.substring(el.length - 4, el.length) == value) {
                        temp = 'theaterdate' + ' = "' + el + '"';
                    }
                });
                qryStr += temp + and;
                $('span.filter-header.theaterdate').text("Year: " + value);
            }


        }
        $('#prodList td a.link-prod-info').on("click", showProdInfo);
        $('span.filter-header.' + triggerFilter).attr('value', triggerValue);

    });


    qryStr = qryStr.substring(0, qryStr.length - 5);
    console.log("Qry: " + qryStr);
    //rating = "R"
    $.getJSON('/users/filter/' + qryStr, function(data) {
            repopulateTable(data, 'all');
        })
}

/*
This function gets initial unfiltered Movie data from MVIS when page first loads.
*/

function getProdMapData() {
    console.log("Getting data");
    $.getJSON('/users/100', function(data) {
        $.each(data, function(index, el) {
            studios.push(el['studio']);
            producers.push(el['producer']);
            years.push(el['theaterdate']);

        })
        fillFilters();
        prodData = data;
        $('a.collapse-item.filter-option').on('click', filterTable);
    });
    console.log("Got that data");

};

/*
This function is responsible for how many rows of data are displayed in the table. Gives a specific value to MVIS, and then renders that number of rows.
*/
function displayNum(num) {
    $.getJSON('/users/' + num, function(data) {
        console.log(data);
        repopulateTable(data, 'all');
    });
    $('#prodList td a.link-prod-info').on("click", showProdInfo);
};


/*
This function maps a id value for a movie to its position in a local store of data generated by MVIS.
*/
function dataPosMap(prodID) {
    var pos = prodData.map(function(prod) {
        return prod.id;
    }).indexOf(prodID);

    return pos;
}

/*
This function populates a component on the dashboard with movie information.Works by sending a request for more information on a specific movie by passing 
the product id, MVIS returns the data to express which sends it to the front end and is then rendered.
*/

function showProdInfo(e) {
    console.log("Link clicked");
    initInfo = false;
    expanded = true;
    $('#switch').removeClass('fa-plus-square');
    $('#switch').addClass('fa-minus-square');
    e.preventDefault();
    $('#prodInfo').removeClass('hidden');
    var prodID = $(this).attr('rel');
    $.getJSON('/users/prodID/' + prodID, function(data) {
        $('#prodInfoTitle').text(data['title']);
        $('#prodInfoYear').text(data['theaterdate']);
        $('#prodInfoProducer').text(data['producer']);
        $('#prodInfoGenre').text(data['genre']);
        $('#prodInfoRating').text(data['rating']);
        $('#prodInfoDesc').text(data['desc']);
        $('.stream-actions').attr('rel', data['id']);
    });

    if (!checkButtonDisabled(prodID)) {
        $('#watchLater').removeClass('disabled');
    } else {
        $('#watchLater').addClass('disabled');
    }

}

//Helper function to see state of Save For Later button
function checkButtonDisabled(prodID) {
    for (var i = 0; i < watchLater.length; i++) {
        if (watchLater[i]['id'] == prodID) {
            return true;
        }
    }
    return false;



}

/*
This function responsible for adding movies to the Save For Later table, and also updating their boolean state holders.
*/
function addToWatchLater(e) {
    e.preventDefault();
    var prodID = $('span.stream-actions').attr('rel');
    if (!checkButtonDisabled(prodID)) {
        $('#watchLater').removeClass('disabled');
    } else {
        $('#watchLater').addClass('disabled');
    }
    if (!checkButtonDisabled(prodID)) {
        var pos = dataPosMap(prodID);
        watchLater.push(prodData[pos]);
        console.log(watchLater);
        $(this).addClass('disabled');
        repopulateTable(watchLater, 'later');
    }

}

//Helper function
function watchNow() {
    alert("watching now");
}

/*
This function takes data in the form of an array, builds html table rows using this data, and rerenders the table.
*/

function repopulateTable(arr, table_type) {
    var tableQuery;
    if (table_type == "all") {
        tableQuery = '#prodList tbody';
    } else {
        $('#watchLaterList thead tr').html('<th>Title</th><th>Producer</th><th>Genre</th><th>Rating</th>');
        tableQuery = '#watchLaterList tbody';
    }
    var tableContent = '';
    if (arr.length == 0) {
        console.log("null data recieved");
        tableContent += '<div id="no-result">';
        tableContent += '<h2>Sorry, it looks like no movies fit these filters.</h2>';
        tableContent += '</div>'
    } else {
        for (var i = 0; i < arr.length; i++) {
            tableContent += '<tr>';
            tableContent += '<td class="title" value="' + arr[i]['title'] + '" ><a href="#"  class="link-prod-info" rel="' + arr[i]['id'] + '">' + arr[i]['title'] + '</a></td>';
            tableContent += '<td class="producer" value="' + arr[i]['producer'] + '">' + arr[i]['producer'] + '</td>';
            tableContent += '<td class="genre" value="' + arr[i]['genre'] + '">' + arr[i]['genre'] + '</td>';
            tableContent += '<td class="rating" value="' + arr[i]['rating'] + '">' + arr[i]['rating'] + '</td>';
            tableContent += '<tr>';
        }

    }
    $(tableQuery).html(tableContent);
    $('#prodList td a.link-prod-info').on("click", showProdInfo);


}

/*
This function dynamically parses through the data to create a mathematical set of filter options for a number of categories including rating, genre, studio, etc.
The function then populates the filters with these options.
*/

function fillFilters() {
    
    var temp = [];
    
    studios.forEach(function(el) {
      if (el != "") temp.push(el);
    });
    disStudios = [...new Set(temp)];

    // console.log(producers);
    temp = [];

    producers.forEach(function(el) {
        el.forEach(function(e) {
            temp.push(e);
        });
    });
    disProducers = [...new Set(temp)];
    temp = [];
    years.forEach(function(el) {
        var val = parseInt(el.substring(el.length - 4, el.length), 10);
        temp.push(val);
    });
    disYears = [...new Set(temp)];
    disYears.sort();
    disYears = disYears.slice(0, disYears.length - 1);
    fillFiltersHelper(disStudios, 'studio');
    fillFiltersHelper(disProducers, 'producer');
    fillFiltersHelper(disYears, 'theaterdate');

};

function fillFiltersHelper(array, rel) {
    var filterContent = '';
    for (var i = 0; i < array.length; i++) {
        filterContent += '<a href="#" class="collapse-item filter-option" rel="' + rel + '" value="' + array[i].toString() + '"><p>' + array[i].toString() + '</p></a>';
    }
    $('#' + rel + ' div.bg-white.border.rounded.py-2.collapse-inner').html(filterContent);


};