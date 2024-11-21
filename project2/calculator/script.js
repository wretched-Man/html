const userInputTextArea = document.querySelector('.input');
const userOutputTextArea = document.querySelector('.output');
var setResult;

document.querySelector('.buttons-wrapper').addEventListener('click',
    function(e){
        uniqueElemClass = e.target.getAttribute('class');

        if( uniqueElemClass.indexOf('op-print-as') !== -1 ) {
            userInputTextArea.innerText += e.target.innerText;
        }
        setResult = userInputTextArea.innerText;
});

// equals button
document.getElementById('equals').addEventListener('click',
    function() {
        // Try catch Here!
        try {
            userOutputTextArea.innerText = eval(setResult);
        }
        catch(error) {
            console.log(error)
            // Set the color to Red, then display text error
            userOutputTextArea.style.color = 'red';
            userOutputTextArea.innerText = 'InputError';
        }
    }
);

// clear Button
document.getElementById('clear').addEventListener('click',
    function() {
        userInputTextArea.innerText = '';
        userOutputTextArea.innerText = '';

        // If there were any errors, clear them!
        userOutputTextArea.style.removeProperty('color');
    }
);

// brackets Button
document.getElementById('brackets').addEventListener('click',
    function() {
        if( userInputTextArea.innerText.indexOf('(') == -1 ) {
            userInputTextArea.innerText += '(';
        }
        else {
            userInputTextArea.innerText += ')';
        }
    }
);


document.getElementById('percent').addEventListener('click',
    function() {
        userInputTextArea.innerText += '*0.01'
    }   
)