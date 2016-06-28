
var jsonData;
var listselected = new Array();
var exist = '';
var active = [];
var pending = [];
var closedS = [];
function FindRadius(form)
{
    sessionStorage.properydata = '';
    //var contData = {'OrderID': 12345, 'access_token': 'XPbJo1QGpPtZxn44yBY1ODEuYL0WiS4UyoO2lj2RsFrGGJ93dYaxykHfGmsb9Hnm'};
    var formser = serializeObject(form);
    console.log(formser);
    // var dat = {"where": formser};
    //var obj = JSON.stringify(formser);
    var data = $.param(formser);
    var url = "https://api.propmix.io/propmixapps/MlsListings/getListings?" + data;
    //  alert(url);
    ajaxCall(url)

    return false;
}

function serializeObject(obj)
{
    var o = {};
    var a = $(obj).serializeArray();

    $.each(a, function () {
        if (this.value) {
            o[this.name] = this.value;
        }
    });
    return o;
}
function ajaxCall(url)
{
    $.ajax({
        url: url,
        type: 'GET',
        //async: false,
        processData: false,
        contentType: false,
        success: function (data) {
            jsonData = data;
            LoadMap();
            // populateMap();

        }
    });
    return jsonData;
}

function showtable(data) {
    // listselected = new Array();
    //   var data = JSON.parse(sessionStorage.properydata); 
    if (!exist) {
        var $html = '';
        $html += '<div style="overflow:auto;max-height:700px;height:auto;width:100%;"><table class="table table-stripaed" >';
        $html += '<thead><tr>';
        $.each(data[0], function (key, value) {
            $html += '<th>' + key + '</th>';
        });
        $html += '</tr></thead><tbody>';
        $.each(data, function () {
            if (this.Status) {
                if (this.Status.trim() == 'Active-Available') {
                    if (this.ListPrice && this.ListPrice >= 50000)
                        active.push(this.ListPrice);
                } else if (this.Status.trim() == 'Closed Sale') {
                    if (this.ClosePrice && this.ClosePrice >= 50000)
                        closedS.push(this.ClosePrice);
                } else if (this.Status.trim() == 'Pending Sale/Rental') {
                    if (this.ListPrice && this.ListPrice >= 50000)
                        pending.push(this.ListPrice);
                }
            }
            if (this.Rets_id) {
                $html += '<tr id="' + this.Rets_id + '" onclick= "selectprop(' + this.Rets_id + ');">';
                $.each(this, function (key, value) {
                    $html += '<td>' + value + '</td>';
                });
                $html += '</tr>';
            }

        });
        $html += '</tbody></table></div>';
        exist = 1
        var actLen = active.length;
        var penLen = pending.length;
        var cloLen = closedS.length;
        if (actLen) {
            active.sort(function (a, b) {
                return a - b
            });
            // Math.ceil(actLen/2);
            $html += '<div class="col-md-12 bold"><p>Active Listing High - $' + active[actLen - 1] + '  , Low - $' + active[0] + ' ,  Median - $' + active[Math.ceil(actLen / 2)] + '</p></div>';
        }
        if (penLen) {
            pending.sort(function (a, b) {
                return a - b
            });
            // Math.ceil(actLen/2);
            $html += '<div class="col-md-12 bold"><p>Pending Listing High - $' + pending[penLen - 1] + '  , Low - $' + pending[0] + ' ,  Median - $' + pending[Math.ceil(penLen / 2)] + '</p></div>';
        }
        if (cloLen) {
            closedS.sort(function (a, b) {
                return a - b
            });
            // Math.ceil(actLen/2);
            $html += '<div class="col-md-12 bold"><p>Closed Listing High - $' + closedS[cloLen - 1] + '  , Low - $' + closedS[0] + ' ,  Median - $' + closedS[Math.ceil(cloLen / 2)] + '</p></div>';
        }

        //$html +='<button class= "button right">Compare</button>';
        $('#tabular').html($html);
        $('#compb').show();
    } else {
        $('#filter').hide();
        $('#tabular').show();
    }

}

function selectpropImg(listKey) {
    if (!listKey) {
        alert('Invalid Listing.');
        return false;
    }
    var prop = JSON.parse(sessionStorage[listKey]);
    var img = [];
    if (prop.ImageUrl) {
        img = prop.ImageUrl.split('|');
    }
    if (img.length > 0) {
        var i = 1;
        var active = '';
        var html = '';
        $("#filter").hide();
        $("#images").show();
        $.each(img, function (key, value) {
            if (i == 1) {
                i++;
                active = "active";
            }
            html += '<div class="item ' + active + '">';
            active = '';
            html += '<img src="' + value + '"  width="460" height="345"></div>';
        });
        $("#imagecarousel").html(html);
        $("#myCarousel").carousel();
        $("#images").show();
    } else {
        alert('No Image Exists.');
    }

}
function showselecteddata() {
    if (listselected.length) {
        var property;
        var $html = '';
        $html += '<div style="width:100%;overflow:auto;max-height:600px;height:auto;"><table class="table table-stripaed" style="overflow:auto">';
        $html += '<thead><tr>';
        property = JSON.parse(sessionStorage[listselected[0]]);
        $.each(property, function (key, value) {
            $html += '<th>' + key + '</th>';
        });
        $html += '</tr></thead>';
        $.each(listselected, function (key, value) {
            property = JSON.parse(sessionStorage[value]);
            $html += '<tr id="' + property.Rets_id + '" onclick= "selectpropImg(' + property.Rets_id + ');">';

            $.each(property, function (key, value) {
                console.log(key);
                $html += '<td>' + value + '</td>';

            });
            $html += '</tr>';
        });

        $html += '</table></div>';

        //$html +='<button class= "button right">Compare</button>';
        $('#filter').html($html);
        $("#imgb").show();
    } else {
        alert("No item selected");
        return false;
    }
    return true;
}


function selectprop(listKey) {
    var index = listselected.indexOf(listKey);
    console.log(index);
    if (index == -1) {
        listselected.push(listKey);
        $("#" + listKey).css({"background-color": "#D8D0D0"});
    } else {
        listselected.splice(index, 1);
        $("#" + listKey).css({"background-color": "white"});
    }
    console.log(listselected);

}
window.onload = function () {
    LoadMap();
}
function LoadMap() {
    sessionStorage.properydata = JSON.stringify({});
    var markers;
    var latitude, longitude;
    markers = jsonData.Listings;
    sessionStorage.properydata = JSON.stringify(markers);// store dataa to local
    var initialData = markers[0];
//    $.each(initialData, function (key, value) {
//        if (key == 'latitude')
//        {
//            latitude = value;
//        } else if (key == 'longitude')
//        {
//            longitude = value
//        }
//    });
    latitude = initialData.Latitude;
    longitude = initialData.Longitude;
    var map;
    var infoWindow = new google.maps.InfoWindow();
    var mapOptions = {
        //center: new google.maps.LatLng(25.840745, -80.325495),
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("dvZestimateMap"), mapOptions);
    for (var i = 0; i < markers.length; i++) {
        var data = markers[i];
        if (!data['Total Comparables']) {//console.log(data);
            sessionStorage[data.Rets_id] = JSON.stringify(data);
            var myLatlng = new google.maps.LatLng(data.Latitude, data.Longitude);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: data.unparsedaddress
            });
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                    infoWindow.setContent("<div style = 'min-height: 40px; width: 250px; color: Black; font-weight: bold; font-family: Times New Roman;'><div>Address :" + data.Address + "</div><div>City :" + data.City + " </div><div>State :" + data.State + " </div><div>Country :" + data.Country + "</div></div>");
                    infoWindow.open(map, marker);
                });
            })(marker, data);
        }
        $('#tabb').show();
    }
}

//auto expand textarea
function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight) + "px";
}
function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(37.697948, -97.314835),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("dvZestimateMap"), mapProp);
}
google.maps.event.addDomListener(window, 'load', initialize);
        