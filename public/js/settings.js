const voiceList = $_('#voice-list')[0],
    voiceSpead = $_('#voice-spead')[0],
    voicePitch = $_('#voice-pitch')[0],
    voiceSpeadLabel = $_('#voice-spead-label')[0],
    voicePitchLabel = $_('#voice-pitch-label')[0],
    voiceStorage = +localStorage.getItem("SpeakVoice"),
    voiceSpeadStorage = +localStorage.getItem("SpeakSpeed"),
    voicePitchStorage = +localStorage.getItem("SpeakPitch");

voiceSpead.value = voiceSpeadStorage === 0 || isNaN(voiceSpeadStorage) ? 1 : voiceSpeadStorage;
voicePitch.value = voicePitchStorage === 0 || isNaN(voicePitchStorage) ? 1 : voicePitchStorage;
voiceSpeadLabel.textContent = voiceSpead.value;
voicePitchLabel.textContent = voicePitch.value;

if(synth.onvoiceschanged !== undefined) { synth.onvoiceschanged = () => { 
    voices = synth.getVoices()
    var selectedIndex = voiceStorage === 0 ? 0 : voiceStorage;
    voiceList.innerHTML = '';
    voices.forEach((voice)=>{
    var listItem = document.createElement('option');
        listItem.textContent = voice.name;
        listItem.setAttribute('data-lang', voice.lang);
        listItem.setAttribute('data-name', voice.name);
        voiceList.appendChild(listItem);
    });
    voiceList.selectedIndex = selectedIndex;            
}};

voiceSpead.addEventListener('change', () => { localStorage.setItem("SpeakSpeed", voiceSpead.value) });
voiceSpead.addEventListener('input', () => { voiceSpeadLabel.textContent = voiceSpead.value });

voicePitch.addEventListener('change', () => { localStorage.setItem("SpeakPitch", voicePitch.value) });
voicePitch.addEventListener('input', () => { voicePitchLabel.textContent = voicePitch.value });

voiceList.addEventListener('change', () => { localStorage.setItem("SpeakVoice", voiceList.selectedIndex) });