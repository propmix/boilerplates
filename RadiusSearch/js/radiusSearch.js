
var jsonData;
function FindRadius(form)
{
    var contData = {'OrderID':ORDERID,'access_token': 'TOKEN'};
     var formser = serializeObject(form);
    console.log(formser);
   // var dat = {"where": formser};
    //var obj = JSON.stringify(formser);
    var data = $.param(formser) + "&" + $.param(contData);
    var url = "API END POINT?" + data;
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
window.onload = function () {
    LoadMap();
}
function LoadMap() {
    var markers;
    var latitude, longitude;
    markers = jsonData.Listings;
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
        if(!data['Total Comparables']){//console.log(data);
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
    }
}

//auto expand textarea
function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight) + "px";
}
function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(37.697948, -97.314835),
    zoom:5,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("dvZestimateMap"),mapProp);
}
google.maps.event.addDomListener(window, 'load', initialize);
        
