

var ajaxData = function (data) {
    processData(data);
};

function display(form) {
    var url = "https://api.propmix.io/propmixapps/MlsListings/GetProperty";
    var formser = serializeObject(form);
    ajaxCall(url, $.param(formser), ajaxData);
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
        success: func,
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Invalid Address');
            
        }
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
    if (!data.error && data.Property && data.Property.Rets_id) {
            formatHtml(data.Property);
    } else {
        alert('No Data');
    }
}

function formatHtml(data) {
    var html = "";
    html += "<tr><td>Property Type</td><td>" + data.PropertyType + "</td></tr>";
    html += "<tr><td>Baths</td><td>" + data.Baths + "</td></tr>";
    html += "<tr><td>Beds</td><td>" + data.Beds + "</td></tr>";
    html += "<tr><td>Living area</td><td>" + data.GLA + "</td></tr>";
    $("#datadetails").html(html);
    //===============================================================================
   if (data['ImageUrl']) {
       
//console.log($resdata['listingImages']);
        var html='';
        var i = 1;
        var active = '';
        var img = data.ImageUrl.split('|');
            $.each(img, function (key, value) {
                    if (i++ == 1){
                       active = "active"; 
                       
                    }
                    html += '<div class="item '+active+'">';
                    active = '';
                    html += '<img src="' + value + '"  width="460" height="345"></div>';
                    $("#imagecarousel").html(html);
                    $("#myCarousel").carousel();
            });
    }
}