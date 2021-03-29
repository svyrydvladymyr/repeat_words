    const error = {
        proba : 'sdfsdf'
     };

    const $_ = (value, parent = document) => parent.querySelectorAll(value);






    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


    if (typeof SpeechRecognition !== "undefined") {

    } else {
        alertMessage.textContent = 'Непрацює мовний модуль!'
    }


    const colors = {
        красный: 'red',
        оранжевый: 'orange',
        жёлтый: 'yellow',
        зелёный: 'green',
        голубой: 'blue',
        синий: 'darkblue',
        фиолетовый: 'violet'
    };
    
    const colorsList = Object.keys(colors);
    
    const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colorsList.join(' | ') + ' ;';

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;





    const listenSpeech = $_('#star-speach')[0];
    const setSpeech = $_('#show-speach')[0];

    listenSpeech.onclick = () => {
        recognition.start();
        console.log('Ready listening.');
    }

    recognition.onaudiostart = function() {
        console.log('Start listening...');
    };

    recognition.onresult = function(event) {
        const last = event.results.length - 1;
        console.log(event.results[last][0]);
        console.log(event.results[last][0].transcript);
      
        setSpeech.textContent = event.results[last][0].transcript;
    
    };

    recognition.onspeechend = function(event) {
        console.log(`End listening!`);
    };

    recognition.onerror = function(event) {
        console.log(`Error occurred in recognition: ${event.error}`);
    };


     