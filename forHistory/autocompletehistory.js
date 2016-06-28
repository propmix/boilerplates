// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

$("#Address").on('focus', function () {
    geolocate();
});

var placeSearch, autocomplete;

function initialize() {
    // Create the autocomplete object, restricting the search
    // to geographical location types.
    //console.log($('#Address'));
    var options = {
        types: ['geocode'],
        componentRestrictions: {country: "us"}
    };
    autocomplete = new google.maps.places.Autocomplete(
            /** @type {HTMLInputElement} */ (document.getElementById('Address')), options);
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        fillInAddress();
    });
}

// [START region_fillform]
function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
//    console.log(place.formatted_address);
//    console.log(place.address_components);
        $('#Address').val(place.formatted_address);
    if (place.address_components) {
        var len = place.address_components.length, addr;
        for (var i = 0; i < len; i++) {
           addr =  place.address_components[i];
           if (addr.types[0] === "postal_code"){
               $('#Zip').val(addr.short_name);
           } else if (addr.types[0] === "administrative_area_level_1"){
                $('#state').val(addr.short_name);
           } else if (addr.types[0] === "locality"){
                $('#City').val(addr.short_name);
           }
        }
    }




}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(
                    position.coords.latitude, position.coords.longitude);

           // var latitude = position.coords.latitude;
           // var longitude = position.coords.longitude;
            // document.getElementById("latitude").value = latitude;
            // document.getElementById("longitude").value = longitude;

            autocomplete.setBounds(new google.maps.LatLngBounds(geolocation, geolocation));
        });
    }

}

initialize();
// [END region_geolocation]