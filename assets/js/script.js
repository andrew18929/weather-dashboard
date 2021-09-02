// jquery ready fuction
$(document).ready(function() {

    // capture the text input when search button is clicked
    $("#search-button").on("click", function () {
        event.preventDefault();
        var searchInput = $("#search-input").val();
        $("#search-input").val("");
        $("input:text").click(function () {
            $(this).val("");
            $("#todays-weather").empty();
            $("#forecast").empty();
        });
        // need to call weather functionName(searchInput);
    });

    
})