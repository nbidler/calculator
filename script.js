/**
 * Created by Nick on 2/3/2016.
 */

function inputHandler(type, value, item) {
    switch (value) {
        case undefined:
            $('#display_area').html("");
            break;
        default:
            $('#display_area').html(value);
            break;
    }
}

var my_calculator = new calculator(inputHandler);

$(document).ready(function(){
    //on click, get contained value
    $('.item').click(function(){
        var val = $(this).text();
        console.log("btn clicked : ", val)
        switch (val) {
            case 'AC':
                my_calculator.allClear();
                break;
            case 'C':
                my_calculator.clear();
                break;
            default:
                my_calculator.addItem(val);
                break;
        }
    });
});