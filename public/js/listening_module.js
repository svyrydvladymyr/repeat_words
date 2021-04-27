const txtInput = $_('#txt-input')[0],
    btnSpeak = $_('#btn-speak')[0],
    voiceStorage = +localStorage.getItem("SpeakVoice"),
    voiceSpeadStorage = +localStorage.getItem("SpeakSpeed"),
    voicePitchStorage = +localStorage.getItem("SpeakPitch");

if(synth.onvoiceschanged !== undefined) { 
    synth.onvoiceschanged = () => { voices = synth.getVoices() };
    btnSpeak.addEventListener('click', ()=> {                
        var toSpeak = new SpeechSynthesisUtterance(txtInput.value);
        toSpeak.voice = voices[voiceStorage === 0 ? 4 : voiceStorage];
        toSpeak.rate = voiceSpeadStorage === 0 || isNaN(voiceSpeadStorage) ? 1 : voiceSpeadStorage;
        toSpeak.pitch = voicePitchStorage === 0 || isNaN(voicePitchStorage) ? 1 : voicePitchStorage;
        synth.speak(toSpeak);
    });
} else {
    alertMessage.textContent = 'Непрацює мовний модуль!'
};
