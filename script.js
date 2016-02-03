/**
 * Created by Nick on 2/3/2016.
 */

function inputHandler(type, value, item) {
    $('#display_area').html(value);
}

var my_calculator = new calculator(inputHandler);

$(document).ready(function(){
    //on click, get contained value
    $('.item').click(function(){
        var val = $(this).text();
        my_calculator.addItem(val);
    });
});