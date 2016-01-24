

function validate(form) {
    var url = "https://www.propmix.io/api/v1/MlsData/ValidateServer";

    var Xtra = {"access_token": "Qji7AOFvPTYywmgW4ZNoMn4sxEc7vJSVWlF9cSiE36JprNb2oSWi6UaBlNPgoD0a"};
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