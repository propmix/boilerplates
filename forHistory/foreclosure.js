
//$(document).ready(function () {
//$('input[data-date="pick"]').daterangepicker({
//    singleDatePicker: true,
//    showDropdowns: true
//});
$(document.body)
        .on('submit', "[id='searchforeclosure']", function (e) {//handle submit events
            e.preventDefault();
            var $formObj = this;
            $url = 'API END POINT';
            var $xtra = {'access_token': 'TOKEN'};
            var formser = serializeObject($formObj);
            console.log(formser);
            var dat = {"where": formser};
            var obj = JSON.stringify(dat);
            var data = "filter=" + obj + "&" + $.param($xtra);
            ajaxcall($url, data);
        })

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
function ajaxcall($url, $form) {

    $.ajax({
        url: $url,
        type: 'GET',
        data: $form,
        async: false,
        success: function ($data) {
            var $processedData = processData($data[0]);
           // alert($processedData);
            $('#foreclosuredata').html($processedData);
            //$("td[colspan=3]").find("p").hide();
        }
    });
}

function processData($data) {
    var $html = "";
    if ($data.hasOwnProperty('error')) {
//alert(12);
        $html += "Something Went wrong please try again after some time";
    } else {

        $html += '<table class="table table-striped">';
        $html += '<thead><tr> <th>Year</th> <th>Price</th></tr></thead><tbody>';
        var flg = '';
        for (i = 0; i < 5; i++) {

            if ($data['saleDate' + i] !== null && $data['saleValue' + i] !== null) {
                flg = 1
                $html += '<tr>';
                $html += '<td>' + ($data['saleDate' + i] || '') + '</td>';
                $html += '<td>' + ($data['saleValue' + i] || '') + '</td>';
                $html += '</tr>';
            }

        }

        $html += '</tbody></table>';
        if (flg == 1) {
            $html = "<h1>No History Data Exists.</h1>";
        }

        return $html;
    }
}
//})
