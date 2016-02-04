/**
 * Created by Nick on 2/3/2016.
 */

// input stores a list of items in the order they were received
var array = [];
// displayOut is the current thing to be displayed to the user

var buttonPress = {
    type:'',
    value:''
}

function putInto(typ, val)
{
    var newEntry = {
        type: typ,
        value: val
    };
    array.push(newEntry);
}

/*
 doMath - no param, no return - takes contents of array and computes answer
    array checks first two items, then third if there is one
    ITEM 1
        if a EQUAL SIGN, just output 'ready' or 0
        if a NON-MINUS OPERATOR, throw out, move items up the array (shift?)
            if a MINUS, make first number a negative (maybe bool?)
        if a NUMBER, parse for value and store in local var
            if applicable, make negative (see 2 lines up, from bool)
    ITEM 2
        should be operator or equal sign
        if EQUAL SIGN - just output calcVal to display
        if NOT EQUAL SIGN, continue to ITEM 3
    ITEM 3
        if NUMBER, take number from ITEM 1 and operator from ITEM 2 and calculate as normal
            set RESULT to take the place of ITEM 3, then remove the 2 previous array ITEMS
        if EQUAL SIGN, take number from ITEM 1 and operator from ITEM 2
            and use ITEM 1 in place of ITEM 3, then end calculation/display result

*/




/*
 addItem - 1 param, no return - calls displayCalc to change display
     if number - add to inputHolder to make string of large contiguous number
     if operator - put current content of inputHolder in input array,
     put current operator in input array,
     display answer
     if equalSign - put current content of inputHolder in input array,
     display answer
 */
function addItem(input) {
    switch (input) {
        case '.':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            //if '.', check if already in value - if already in value, disregard input
            if ((input == '.') && (buttonPress.value.indexOf('.') > -1))
            {
                break;
            }

            //if number, check if previous object was number
            //  if so, string + string, i.e. '2' and '2' make '22'
            //else is new number
            if (buttonPress.type == 'number') {
                buttonPress.value += input;
            }
            else {
                buttonPress.value = input;
            }
            buttonPress.type = 'number';

            console.log("current buttonPress : ", buttonPress);
            $('#display_area').html(buttonPress.value);
            break;
        case '+':
        case '-':
        case 'x':
        case '/':
            if (buttonPress.type == 'number') {
                //assumes previous input was number, pushes number into array
                putInto(buttonPress.type, buttonPress.value);
                //inputs operator into array
                buttonPress.value = input;
                buttonPress.type = 'operator';
                putInto(buttonPress.type, buttonPress.value);
            }
            else {
                //pressed a second operator, first must have been wrong, remove old
                array.pop();
                //inputs (new) operator into array
                buttonPress.value = input;
                buttonPress.type = 'operator';
                var operate = {
                    type: buttonPress.type,
                    value: buttonPress.value
                };
                array.push(operate);
            }
            displayCalc();
            break;
        case '=':
            //assumes previous input was number, pushes number into array
            //  allows input of operator for advanced operations
            putInto(buttonPress.type, buttonPress.value);
            //inputs operator into array
            buttonPress.value = input;
            buttonPress.type = 'equalSign';
            //put call to do calculation here
            putInto(buttonPress.type, buttonPress.value);
            displayCalc();
            break;
        default:
            console.log("Congratulations, this is the error message. You weren't supposed to even be able to get here.");
            break;
    }

    //console.log("current buttonPress : ", buttonPress);
    //console.log("current array : ", array);
    // output current button press
    /*for (var i = 0; i< array.length; i++)
    {
        console.log(array[i].type);
        console.log(array[i].value);
    }*/
}

//puts contents of array to the output in the form of a string
function displayCalc() {
    var displayStr = '';
    for (var i = 0; i< array.length; i++)
    {
        displayStr +=array[i].value;
    }

    $('#display_area').html(displayStr);
}

//allClear empties input and displayOut
function allClear() {
    array = [];
    displayCalc();
}

//clear empties array of last number entry (and operator, if that was last) and displayOut
function clear() {
    if (buttonPress.type == 'operator')
    {array.pop();}
    array.pop();
    //if not last item, set values to last item's values
    if (array.length >0) {
        buttonPress.type = array[array.length - 1].type;
        buttonPress.value = array[array.length - 1].value;
    }
    else {
        buttonPress.type = '';
        buttonPress.value = '';
    }
    displayCalc();
}

$(document).ready(function(){
    //on click, get contained value - if not a number, do action - if number, pass to be further sorted
    $('.item').click(function(){
        var val = $(this).text();
        //console.log("btn clicked : ", val);
        switch (val) {
            case 'AC':
                allClear();
                break;
            case 'C':
                clear();
                break;
            default:
                addItem(val);
                break;
        }
        //checking input array

    });
});