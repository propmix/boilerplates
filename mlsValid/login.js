

function validate(form) {
    var url = "API END POINT";

    var Xtra = {"access_token": "TOKEN"};
    var data = $(form).serialize() + '&' + $.param(Xtra);
    ajaxCall(url, data);
    return false;
}

function ajaxCall(url, data) {
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        //async: false,
        processData: false,
        contentType: false,
        success: function (data) {
            processData(data);
        }
    });
}
function processData(data){
    var txt;
    if (data.error){
        txt = "Some Error Occured";
    } else {
        if (data.Response == true){
            txt = "Success";
        } else{
            txt = "Failed";
        }
    }
   txt =  "<h1>"+txt+"</h1>"
    $("#authentication").html(txt);
}
