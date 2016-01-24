
var jsonData;
function FindRadius(form)
{
    var contData = {'access_token': 'XC49HCRruC3LrMaKDwrgmodlR9eWR3sUVBse3HInRjdgLB2dMMVu0Hs3JLWkMzqK'};
     var formser = serializeObject(form);
    console.log(formser);
    var dat = {"where": formser};
    var obj = JSON.stringify(dat);
    var data = "filter=" + obj + "&" + $.param(contData);
    var url = "https://www.propmix.io/api/v1/iEstimates?" + data;
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
            console.log(this.name);
            console.log(this.value);
//            if (!o[this.name].push) {
//                o[this.name] = [o[this.name]];
//            }
            o[this.name] = this.value;
        }
    });
    return o;
}
function ajaxCall(url)
{console.log(url);
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
    markers = jsonData;
    var initialData = markers[0];
    $.each(initialData, function (key, value) {
        if (key == 'latitude')
        {
            latitude = value;
        } else if (key == 'longitude')
        {
            longitude = value
        }
    });
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
        var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: data.unparsedaddress
        });
        (function (marker, data) {
            google.maps.event.addListener(marker, "click", function (e) {
                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                infoWindow.setContent("<div style = 'min-height: 16px; width: auto; color: Black; font-weight: bold; font-family: Times New Roman;'><div></div>Price : $" + data.iestimate + "</div>");
                infoWindow.open(map, marker);
            });
        })(marker, data);
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
        