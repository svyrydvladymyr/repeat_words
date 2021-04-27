const voiceList = $_('#voice-list')[0],
    voiceSpead = $_('#voice-speed')[0],
    voicePitch = $_('#voice-pitch')[0],
    myLang = $_('.settings-my-lang-box')[0].children,
    myLangSet = $_('#my-lang')[0];
    voiceSpeadLabel = $_('#voice-speed-label')[0],
    voicePitchLabel = $_('#voice-pitch-label')[0],
    voiceStorage = +localStorage.getItem("SpeakVoice"),
    voiceSpeadStorage = +localStorage.getItem("SpeakSpeed"),
    voicePitchStorage = +localStorage.getItem("SpeakPitch");

voiceSpead.value = voiceSpeadStorage === 0 || isNaN(voiceSpeadStorage) ? 1 : voiceSpeadStorage;
voicePitch.value = voicePitchStorage === 0 || isNaN(voicePitchStorage) ? 1 : voicePitchStorage;
voiceSpeadLabel.textContent = voiceSpead.value;
voicePitchLabel.textContent = voicePitch.value;

if(synth.onvoiceschanged !== undefined) { synth.onvoiceschanged = () => { 
    voices = synth.getVoices();
    // console.log(voices);
    const langArr = [
        "Microsoft Zira Desktop - English (United States)",
        "Microsoft David Desktop - English (United States)",
        "Google US English",
        "Google UK English Female",
        "Google UK English Male"
    ];
    var selectedIndex = voiceStorage === 0 ? 0 : voiceStorage;
    voiceList.innerHTML = '';
    for (const i of langArr) {
        voices.forEach((voice, index)=>{
            if (voice.name == i) {
                var listItem = document.createElement('option');
                listItem.textContent = voice.name;
                listItem.setAttribute('data-lang', voice.lang);
                listItem.setAttribute('data-name', voice.name);
                listItem.setAttribute('value', index);
                voiceList.appendChild(listItem);
            };
        });
    };
    voiceList.selectedIndex = selectedIndex;            
}};

