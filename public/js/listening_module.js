const txtInput = $_('#txt-input')[0],
    btnSpeak = $_('#btn-speak')[0],
    voiceSpeadStorage = +localStorage.getItem("SpeakSpeed"),
    voicePitchStorage = +localStorage.getItem("SpeakPitch"),
    synth = window.speechSynthesis;
let voices = [], voiceIndex;

if(synth.onvoiceschanged !== undefined) { 
    synth.onvoiceschanged = () => { 
        voices = synth.getVoices();
        const userVoiceIndex = getVoicesIndex(voices);
        // const defaultVoiceIndex = getVoicesIndex(voices, 'Google UK English Female');
        voiceIndex = (userVoiceIndex !== undefined) 
            ? userVoiceIndex 
            : getVoicesIndex(voices, 'Google UK English Female');
    };
    btnSpeak.addEventListener('click', ()=> {    
        let toSpeak = new SpeechSynthesisUtterance(txtInput.value);
        toSpeak.voice = voices[voiceIndex];
        toSpeak.rate = voiceSpeadStorage === 0 || isNaN(voiceSpeadStorage) ? 1 : voiceSpeadStorage;
        toSpeak.pitch = voicePitchStorage === 0 || isNaN(voicePitchStorage) ? 1 : voicePitchStorage;
        synth.speak(toSpeak);
    });
} else {
    alertMessage.textContent = 'Непрацює мовний модуль!'
};
