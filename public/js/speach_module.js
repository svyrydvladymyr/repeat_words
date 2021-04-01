const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const listenSpeech = $_('#btn-listening')[0];
const setSpeech = $_('#show-speach')[0];

let scaleStartTime = 200;



if (typeof SpeechRecognition !== "undefined") {

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    listenSpeech.onclick = () => {
        recognition.start();
        setSpeech.innerHTML = '';
        scaleStartTime = 200;

        console.log('Ready listening.');
    }


    recognition.onaudiostart = function() {
        const timeScale = $_('#time_scale')[0];        

        let scaleInterval = setInterval(() => {
            if (scaleStartTime < 0) {
                clearInterval(scaleInterval);
                recognition.stop();
                listenSpeech.disabled = false;
            } else {
                scaleStartTime = scaleStartTime - 0.5; 
                timeScale.style.width = scaleStartTime + 'px'; 
            }
        }, 10);

        console.log('Start listening...');
        listenSpeech.disabled = true;
    };

    recognition.onresult = function(event) {
        const last = event.results.length - 1;

        console.log(`onresult`);
        scaleStartTime = 200;
        setSpeech.innerHTML += event.results[last][0].transcript;    
    };

    recognition.onspeechend = function(event) {
        console.log(event);
        console.log(`End listening!`);
    };

    recognition.onerror = function(event) {
        console.log(`Error occurred in recognition: ${event.error}`);
    };

} else {
    alertMessage.textContent = 'Непрацює мовний модуль!'
};

