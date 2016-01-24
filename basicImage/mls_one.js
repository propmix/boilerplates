

var ajaxData = function (data) {
    processData(data);
};
var ajaximg = function (data) {
    if (data['listingImages']) {
//console.log($resdata['listingImages']);
        var html='';
        var i = 1;
        var active = '';
        $.each(data['listingImages'], function () {
            $.each(this, function (key, value) {
                if (key !== 'ListingKey') {
                    if (i++ == 1){
                       active = "active"; 
                       
                    }
                    html += '<div class="item '+active+'">';
                    active = '';
                    html += '<img src="' + value + '"  width="460" height="345"></div>';
                    $("#imagecarousel").html(html);
                    $("#myCarousel").carousel();
                }
            })
        })
    }
};
function display(form) {
    var url = "https://www.propmix.io/api/v1/MlsData";
    var contData = {'access_token': 'Qji7AOFvPTYywmgW4ZNoMn4sxEc7vJSVWlF9cSiE36JprNb2oSWi6UaBlNPgoD0a'};
    var formser = serializeObject(form);
    console.log(formser);
    var dat = {"where": formser};
    var obj = JSON.stringify(dat);
    var data = "filter=" + obj + "&" + $.param(contData);
    console.log(data);
    ajaxCall(url, data, ajaxData);
    return false;
}

function ajaxCall(url, data, func) {
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        //async: false,
        processData: false,
        contentType: false,
        success: func
    });
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
function processData(data) {
    if (!data.error) {
        if ($.isArray(data) || data.length) {
            //alert(data.length);
            var selected, dateprev, datecur;
            selected = data[0];
            if (data.length > 1) {
                $.each(data, function () {

                    //alert(this.listingkey);
                    if (!datecur) {
                        dateprev = datecur;
                    }
                    datecur = Date.parse(this.modificationtimestamp);
                    if (dateprev && (datecur > dateprev)) {
                        selected = this;
                    }

                })
            }
            formatHtml(selected);
        }
    }
}

function formatHtml(data) {
    var html = "";
    html += "<tr><td>Lot features</td><td>" + data.lotfeatures + "</td></tr>";
    html += "<tr><td>Water Resource</td><td>" + data.watersource + "</td></tr>";
    html += "<tr><td>Bedrooms</td><td>" + data.bedroomstotal + "</td></tr>";
    html += "<tr><td>Livin area</td><td>" + data.livingarea + "</td></tr>";
    var mlsboard = data.listaor;
    $("#datadetails").html(html);
    //===============================================================================
    var url = "https://www.propmix.io/api/v1/MlsData/getImageUrl";
    var $jsondata = {"mlsListingKey": data.listingkey, "MlsBoard": mlsboard, "OrderID": 12345, "access_token": "Qji7AOFvPTYywmgW4ZNoMn4sxEc7vJSVWlF9cSiE36JprNb2oSWi6UaBlNPgoD0a"};
    ajaxCall(url, $.param($jsondata), ajaximg);
}