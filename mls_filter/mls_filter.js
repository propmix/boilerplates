
var comp1 = '',
        comp2 = '',
        comprop1 = '',
        comprop2 = '',
        mapflag = 1,
        button = 1,
        markers = new Array(),
        $listarr = new Array(),
        $imgarr = new Array(),
        $resdata,
        imageupdatediv,
        listArrStr = {};
sessionStorage.listkey = JSON.stringify($listarr);
var $url;
var $div = 'propertydata';
fulldatafunction = function ($data) {
    $data = fulldatastorage($data);
    var $processedData = processData($data);
    $('#' + $div).html($processedData);
}
updateimagefn = function ($data) {
    $resdata = $data;
    if ($resdata['listingImages']) {
//console.log($resdata['listingImages']);
        var tempImg;
        $.each($resdata['listingImages'], function () {
            var tempimgArry = new Array();
            $.each(this, function (key, value) {
                if (key == 'Rets_id') {
                    imageupdatediv = value;
                } else {
                    if (!tempImg) {
                        tempImg = value;
                    }
                    tempimgArry.push(value);
                    //listArrStr.imageupdatediv.push(value);
                }
            })
            listArrStr[imageupdatediv] = tempimgArry
            sessionStorage[imageupdatediv] = JSON.stringify(tempimgArry);
        })
        var tempImgSrc = '<svg data-key=' + imageupdatediv + '  width="100%" height="100%">';
        tempImgSrc += '<image  xlink:href="' + tempImg + '"  width="100%" height="100%"/>'
        tempImgSrc += '</svg>';
        $("#" + imageupdatediv).html(tempImgSrc);
        comp1 = comp2 = '';
    }
// console.log($resdata);
}
$(document.body)
        .on('submit', "[id='searchProperty']", function (e) {//handle submit events
            e.preventDefault();
            var $formObj = this;
            $url = 'https://api.propmix.io/propmixapps/MlsListings/getListings';
            var $xtra = {'MonthsBack': 24, 'OrderID': 123};
            ajaxcall($url, $div, $formObj, $xtra, fulldatafunction);
        })

        .on('click', "[id^='popup']", function (e) {
            // alert(1);//handle submit events
            if (mapflag == 1) {
                e.preventDefault();
                //  console.log(markers);
                var key = $(this).data('listkey');
                // console.log(markers[key]);
                callmarker(key);
                //google.maps.event.trigger(markers[key], 'click');
            } else if (mapflag == 2) {
                var key = $(this).data('listkey');
                if (comp1 == '' && comp2 == '') {
                    comp1 = key;
                    $(this).css({"background-color": "#D8D0D0"});
                } else if (comp1 !== '' && comp2 == '') {
                    if (comp1 == key) {
                        comp1 = '';
                        $(this).css({"background-color": "#f1f1f1"});
                    } else {
                        comp2 = key;
                        $(this).css({"background-color": "#D8D0D0"});
                    }
                } else if (comp1 !== '' && comp2 !== '') {
                    if (comp1 == key) {
                        comp1 = '';
                        $(this).css({"background-color": "#f1f1f1"});
                    } else if (comp2 == key) {
                        comp2 = '';
                        $(this).css({"background-color": "#f1f1f1"});
                    }
                } else if (comp1 == '' && comp2 !== '') {
                    if (comp2 == key) {
                        comp2 = '';
                        $(this).css({"background-color": "#f1f1f1"});
                    } else {
                        comp1 = key;
                        $(this).css({"background-color": "#D8D0D0"});
                    }
                }
                console.log(comp1);
                console.log(comp2);
                compareproperty();

            }

        })


function callmarker(key) {
    google.maps.event.trigger(markers[key], 'mouseover');
}
function ajaxcall($url, $div, $form, $xtra, $function) {
    var tempvalue;
    if ($form) {
        $para = $($form).serialize() + '&' + $.param($xtra);
    } else {
        $para = $.param($xtra);
    }
    $.ajax({
        url: $url,
        type: 'GET',
        data: $para,
        // async: false,
        success: $function
    });
    return tempvalue;
}

function fulldatastorage($data) {
    sessionStorage.propdata = null;
    // var $dataLength = $data.Listings.length;
    // if ($dataLength > 50) {
//if (sessionStorage.propdata) {
    sessionStorage.propdata = JSON.stringify($data);
    // }
    // console.log('retrievedObject: ', JSON.parse(sessionStorage.propdata));
    //}
}

function compareproperty() {
    var data = '';
    var html = '';
    comprop1 = comprop2 = {};
    var propertyData = '';
    if (comp1 !== '' || comp2 !== '') {
        if (!data)
            data = JSON.parse(sessionStorage.propdata); //console.log($data);
        $dataArray = data.Listings;
        if ($dataArray) {
            if (comp1 !== '') {
                comprop1 = returnProperty($dataArray, comp1);
            }
            if (comp2 !== '') {
                comprop2 = returnProperty($dataArray, comp2);
            }
        }

    }
    html += '<tr class="strip" ><td>Property</td> <td>' + (comprop1.Address || '') + '</td><td>' + (comprop2.Address || '') + '</td></tr>';
    html += '<tr><td class="strip">Bedrooms</td><td>' + (comprop1.Beds || '') + '</td><td>' + (comprop2.Beds || '') + '</td></tr>';
    html += '<tr ><td class="strip" >Heating</td><td>' + (comprop1.Heating || '') + '</td><td>' + (comprop2.Heating || '') + '</td></tr>';
    html += '<tr ><td class="strip">Style</td><td> ' + (comprop1.Style || '') + ' </td><td>' + (comprop2.Style || '') + '</td></tr>';
    html += '<tr><td class="strip">GLA</td><td> ' + (comprop1.GLA || '') + '</td><td>' + (comprop2.GLA || '') + ' </td></tr>';
   // html += '<tr class="strip"><td></td><td><a data-showdet="' + (comprop1.Rets_id || '') + '" href="javascript:void(0)"  class="button">Show Details</a></td><td><a data-showdet="' + comprop1.Rets_id + '" href="javascript:void(0)" class="button">Show Details</a></td></tr>';
    html += '<div id="listDet"></div>';
    $("#comparetable").html(html);
    //console.log(comprop1);console.log(comprop2);
}

function returnProperty(data, key) {
    var $dataLength = data.length;
    var $this = '';
    if ($dataLength > 0) {
        var start = 0;
        for (i = start; i < $dataLength; i++) {
            $this = data[i];
            if (!$this['Total Comparables']) {
                if ($this.Rets_id == key) {
                    break;
                }
            }
        }
        return $this;
    }
}
function processData($data, $page) {
    var start = 0;
    if (!$data) {
        $data = JSON.parse(sessionStorage.propdata); //console.log($data);
    }
    if (!$page) {
        $page = 1;
    }
    var $html = "";
    if ($data.hasOwnProperty('error')) {
//alert(12);
        $html += "Something Went wrong please try again after some time";
    } else {

        $dataArray = $data.Listings;
        if ($dataArray) {
            var $cnt = 0;
            var $dataLength = $dataArray.length;
            var start = 0;
            var contentString;
            $html += '<div style="width:100%"><button id ="mapdisp" onclick = "displaymap()" style="width:40%" type="button"  class="btn btn-primary ">Map</button><button onclick = "displaycompare()" id="comparedisp" style="width:40%" type="button"  class="btn btn-primary">Compare</button></div></div>';
var img ;
            for (i = start; i < $dataLength; i++) {

                $this = $dataArray[i];
                if (!$this['Total Comparables']) {
                    if (start === 0) {
                        start++;
                        map = mapInitialize(Number($this.Latitude), Number($this.Longitude));
                    }
                    contentString = '<div class="row-content" style="width:125px"><div class="row"><div class="col-sm-12"><div class="col-sm-12"><div class="row"><div class="col-sm-12"><strong>' + $this.Address + ', ' + $this.City + '</strong></div><div class="col-sm-12">' + $this.Beds + 'BHK</div><div class="col-sm-12">' + $this.Style + '</div></div> </div></div></div></div></div>';
                    setmarker(map, Number($this.Latitude), Number($this.Longitude), contentString, $this.Rets_id);
                    $html += '<div style="padding-bottom:8px;">';
                    $html += '<div style="display:block" id=popup' + $this.Rets_id + '  data-prop=1 data-lat=' + $this.Latitude + ' data-lang=' + $this.Longitude + '  data-listkey = ' + $this.Rets_id + ' class="row propBox">';
                    $html += '<div id=' + $this.Rets_id + ' class="col-sm-6" style="height:80px">';
                    $html += '<svg width="100%" height="100%">';
                    img  = $this.ImageUrl ? $this.ImageUrl.split('|')[0] :'';
                    $html += '<image xlink:href="'+img+'"  width="100%" height="100%"/>'
                    $html += '</svg>';
                    $html += '</div>';
                    $html += '<div class="col-sm-6"><div class="row">';
                    $html += '<div class="col-sm-12"><strong>' + $this.Address + ', ' + $this.City + '</strong></div>';
                    $html += '<div class="col-sm-12">' + $this.Beds + 'BHK</div>';
                    $html += '<div class="col-sm-12">' + $this.Style + '</div>';
                    $html += '</div> </div></div></div>';
                }
                if ($cnt === 49) {
                    break;
                } else {
                    $cnt++;
                }

//  })
            }


        }
        return $html;
    }
}


//================================================================================================================================================
function mapInitialize(lat, lang) {
    lat = typeof lat !== 'undefined' ? lat : 47.06976;
    lang = typeof lang !== 'undefined' ? lang : 15.43154;
    var myLatLng = {lat: lat, lng: lang};
    var mapProp = {
        center: new google.maps.LatLng(lat, lang),
        zoom: 15,
        // scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    return map;
    //var marker;
}

function setmarker(map, lat, lang, contentString, listkey) {
    var infoWindow = null;
    var infoWindow = new google.maps.InfoWindow();
    marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lang)//,
                // title: 'Hello World!'
    });
    infoWindow = new google.maps.InfoWindow({
        content: contentString
    });
    markers[listkey] = marker;
    marker.addListener('mouseover', function () {
        infoWindow.open(map, this);
    });
    marker.addListener('mouseout', function () {
        infoWindow.close(map, marker);
    });
}
google.maps.event.addDomListener(window, 'load', mapInitialize);
//================================================================================================================================================
function displaymap() {
    $("#googleMap").removeClass('hide');
    $("#comparediv").addClass('hide');
    mapflag = 1;
    $("[id^='popup']").each(function () {
        $(this).css({"background-color": "#f1f1f1"});
    })

}

function displaycompare() {
    $("#comparediv").removeClass('hide');
    $("#googleMap").addClass('hide');
    mapflag = 2;
    comp1 = '';
    comp2 = '';
}