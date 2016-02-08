/**
 * Created by Nick on 2/3/2016.
 */
var buttonPress = function(){
    this.type = null;
    this.value = null;
    this.setType = function(new_type){
        this.type = new_type;
    };
    this.setValue = function(new_value){
        this.value = new_value;
    };
    this.getType = function(){
        return this.type;
    };
    this.getValue = function(){
        return this.value;
    };
    this.resetValues = function(){
        this.type = null;
        this.value = null;
    };
};
// input stores a list of items in the order they were received
var array = [];
// displayOut is the current thing to be displayed to the user

var currentInput = new buttonPress();

function putInto(typ, val)
{
    var newEntry = new buttonPress();
    newEntry.setType(typ);
    newEntry.setValue(val);
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
        if EQUAL SIGN - just output ITEM 1 to display
        if NOT EQUAL SIGN, continue to ITEM 3
    ITEM 3
        if NUMBER, take number from ITEM 1 and operator from ITEM 2 and calculate as normal
            set RESULT to take the place of ITEM 3, then remove the 2 previous array ITEMS
                START FROM TOP, should have result of first three items,
                 if was last item, ITEM 2 check should catch termination
                 if was not, readies for next calculation in sequence
        if EQUAL SIGN, take number from ITEM 1 and operator from ITEM 2
            and use ITEM 1 in place of ITEM 3, then end calculation/display result
    I'm sure I'll get some bugs in here somewhere
*/

function doMath() {
    var num1; var num2;
    var negative = false;

    while(true) {
        //ITEM 1
        //if it hits an '=' this early, it's the only thing here
        if (array[0].getValue() == '=') {
            $('#display_area').html('ready');
            return;
        }
        //if it hits an '-' this early, the first value is negative, and moves the whole list 'forward'
        else if  (array[0].getValue() == '-') {
            negative = true;
            array.shift();
            continue;
        }
        //if a number, accept to be held
        else if (array[0].type == 'number') {
            num1 = Number(array[0].getValue());
            //if the first item was negative, make the number negative
            if (negative) {
                num1 *= -1;
                negative = false;
            }
        }
        //otherwise, throw out that item and start from top with valid input
        else {
            array.shift();
            continue;
        }
        //first number stored
        //ITEM 2
        //an '=' here means it was just [value, '='] so pop the '=' from the array and return,
        //  letting the value be displayed
        if (array[1].getValue() == '=') {
            array.pop();
            return;
        }
        //ITEM 3
        //if number, store value
        if (array[2].getType() == 'number') {
            num2 = Number(array[2].getValue());
        }
        //if '=', re-use first value entered as num2
        //  and stick '=' on the end to trigger loop termination
        else  if (array[2].getValue() == '=') {
            num2 = num1;
            putInto('equalSign', '=');
        }

        //now that we have two numbers and an operator, calculate value and store
        switch(array[1].getValue()){
            case '+':
                array[2].setValue(num1 + num2);
                break;
            case '-':
                array[2].setValue(num1 - num2);
                break;
            case 'x':
                array[2].setValue(num1 * num2);
                break;
            case '/':
                array[2].setValue(num1 / num2);
                break;
        }
        //with new value stored in array[2], shift twice to make it array[0]
        //  and start process again
        array.shift();array.shift();
    }
}


/*
 processInput - 1 param, no return - calls displayCalc to change display
     if number - add to inputHolder to make string of large contiguous number
     if operator - put current content of inputHolder in input array,
     put current operator in input array,
     display answer
     if equalSign - put current content of inputHolder in input array,
     display answer
 */
function processInput(input) {
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
            if ((input == '.') && (currentInput.getValue().indexOf('.') > -1))
            {
                return;
            }

            //if number, check if previous object was number
            //  if so, string + string, i.e. '2' and '2' make '22'
            //else is new number

            if (currentInput.getType() == 'number') {
                currentInput.setValue(currentInput.getValue() + input);
            }
            else {
                currentInput.setValue(input);
            }
            currentInput.setType('number');

            console.log("current currentInput : ", currentInput);
            console.log("current value : ", currentInput.getValue());
            $('#display_area').html(currentInput.getValue());
            break;
        case '+':
        case '-':
        case 'x':
        case '/':
            if (currentInput.type == 'number') {
                //assumes previous input was number, pushes number into array
                putInto(currentInput.getType(), currentInput.getValue());
                //inputs operator into array
                currentInput.setValue(input);
                currentInput.setType('operator');
                putInto(currentInput.getType(), currentInput.getValue());
            }
            else {
                //pressed a second operator, first must have been wrong, remove old
                array.pop();
                //inputs (new) operator into array
                currentInput.setValue(input);
                currentInput.setType('operator');
                putInto(currentInput.getType(), currentInput.getValue());
            }
            //
            displayCalc();
            break;
        case '=':
            //assumes previous input was number, pushes number into array
            //  allows input of operator for advanced operations
            putInto(currentInput.getType(), currentInput.getValue());
            //inputs operator into array
            currentInput.setValue(input);
            currentInput.setType('equalSign');
            //put call to do calculation here
            putInto(currentInput.getType(), currentInput.getValue());
            //actual parsing and calculations
            doMath();
            //display result cal calling displayCalc
            displayCalc();
            //empty array by setting to empty for next use
            array=[];
            //empty current button press for next use
            currentInput.resetValues();
            break;
        default:
            console.log("Congratulations, this is the error message. You weren't supposed to even be able to get here.");
            break;
    }
}

//puts contents of array to the output in the form of a string
function displayCalc() {
    var displayStr = '';
    for (var i = 0; i< array.length; i++)
    {
        displayStr +=array[i].getValue();
    }
    $('#display_area').html(displayStr);
}

//allClear empties input and displayOut
function allClear() {
    array = [];
    currentInput.resetValues();
    displayCalc();
}

//clear empties array of last number entry (and operator, if that was last) and displayOut
function clear() {
    if (currentInput.getType() == 'operator')
    {array.pop();}
    array.pop();
    //if not last item, set values to last item's values
    if (array.length >0) {
        currentInput.setType(array[array.length - 1].getType());
        currentInput.setValue(array[array.length - 1].getValue());
    }
    else {
        currentInput.resetValues();
    }
    displayCalc();
}

$(document).ready(function(){
    //on click, get contained value - if not a number, do action - if number, pass to be further sorted
    $('.item').click(function(){
        var val = $(this).text();
        switch (val) {
            case 'AC':
                allClear();
                break;
            case 'C':
                clear();
                break;
            default:
                processInput(val);
                break;
        }
    });
});