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
voiceSpead.addEventListener('input', () => { voiceSpeadLabel.textContent = voiceSpead.value });
voicePitch.addEventListener('input', () => { voicePitchLabel.textContent = voicePitch.value });
voiceSpead.addEventListener('change', () => { send({"type":"speed", "value":voiceSpead.value}, '/setsettings', (result) => {
        localStorage.setItem("SpeakSpeed", voiceSpead.value); 
    })});    
voicePitch.addEventListener('change', () => { send({"type":"pitch", "value":voicePitch.value}, '/setsettings', (result) => {
        localStorage.setItem("SpeakPitch", voicePitch.value) 
    })});    
voiceList.addEventListener('change', () => { send({"type":"voice", "value":voiceList.selectedIndex}, '/setsettings', (result) => {
        localStorage.setItem("SpeakVoice", voiceList.selectedIndex)  
    })});
for (const i of myLang) {
    i.addEventListener('click', () => { send({"type":"my_lang", "value":i.title}, '/setsettings', (result) => {
        const langPack = JSON.parse(result);
        ["language", "voice", "speed", "pitch", "color", "back", "settings", "friends", "exit", "site", "dev"].forEach(e => {
            if ($_(`#${e}-title`)[0]) { 
                $_(`#${e}-title`)[0].textContent = langPack[e] ? langPack[e] : '--------'; 
            };
        });
        localStorage.setItem("myLang", i.title);
        myLangSet.setAttribute("title", i.title);
        myLangSet.setAttribute("src", `./img/lang/${i.title}.png`);
    })});
}

