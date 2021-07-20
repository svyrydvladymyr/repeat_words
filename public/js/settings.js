const voiceList = $_('#voice-list')[0],
    voiceSpead = $_('#voice-speed')[0],
    voicePitch = $_('#voice-pitch')[0],
    interfaceLang = $_('.interface-check'),
    myLangBox = $_('.settings-my-lang-box')[0],
    myLangSet = $_('#my-lang')[0],
    voiceSpeadLabel = $_('#voice-speed-label')[0],
    voicePitchLabel = $_('#voice-pitch-label')[0],
    voiceSpeadStorage = +localStorage.getItem("SpeakSpeed"),
    voicePitchStorage = +localStorage.getItem("SpeakPitch"),
    colorBox = $_('.settings-color-box')[0],
    colorList = ['blue', 'green', 'red', 'yellow', 'grey'],
    synth = window.speechSynthesis;
let voices = [], selectedIndex = 3, voiceIndex, selectedLanguage;

voiceSpead.value = voiceSpeadStorage === 0 || isNaN(voiceSpeadStorage) ? 1 : voiceSpeadStorage;
voicePitch.value = voicePitchStorage === 0 || isNaN(voicePitchStorage) ? 1 : voicePitchStorage;
voiceSpeadLabel.textContent = voiceSpead.value;
voicePitchLabel.textContent = voicePitch.value;

if(synth.onvoiceschanged !== undefined) { 
    synth.onvoiceschanged = () => {        
        voices = synth.getVoices();
        const userVoiceIndex = getVoicesIndex(voices);
        // console.log(userVoiceIndex);

        voiceIndex = (userVoiceIndex !== undefined) 
            ? userVoiceIndex 
            : getVoicesIndex(voices, 'Google UK English Female');
        selectedLanguage = (userVoiceIndex !== undefined) 
            ? voices[voiceIndex].name 
            : 'Google UK English Female';
        langArr.forEach((el, index) => {
            if (el === selectedLanguage) { selectedIndex = index };
        });
        voiceList.innerHTML = '';
        for (const i of langArr) {
            voices.forEach((voice)=>{
                if (voice.name == i) {
                    var listItem = document.createElement('option');
                    listItem.textContent = voice.name;
                    listItem.setAttribute('value', voice.name);
                    voiceList.appendChild(listItem);
                };
            });
        };
        voiceList.selectedIndex = selectedIndex;
    };            
};

voiceSpead.addEventListener('input', () => { voiceSpeadLabel.textContent = voiceSpead.value });
voicePitch.addEventListener('input', () => { voicePitchLabel.textContent = voicePitch.value });
voiceSpead.addEventListener('change', () => { 
    send({"type":"speed", "value":voiceSpead.value}, '/setsettings', (result) => {
        alertMessage.innerHTML = '';
        localStorage.setItem("SpeakSpeed", voiceSpead.value); 
    });
});    
voicePitch.addEventListener('change', () => { 
    send({"type":"pitch", "value":voicePitch.value}, '/setsettings', (result) => {
        alertMessage.innerHTML = '';
        localStorage.setItem("SpeakPitch", voicePitch.value) 
    });
});
voiceList.addEventListener('change', (event) => {    
    send({"type":"voice", "value": $_('#voice-list')[0].value}, '/setsettings', (result) => {
        alertMessage.innerHTML = '';
        console.log(voices);
        console.log(voiceIndex);
        localStorage.setItem("SpeakVoice", voices[voiceIndex].name)  
    });
});

//for change language in settings menu  
const setLanguage = (langPack) => {
    changeSettings.forEach(e => {
        if ($_(`#${e}-title`)[0]) { 
            $_(`#${e}-title`)[0].textContent = langPack[e] ? langPack[e] : '--------'; 
        };
    });
};

//change interface language button
const changeLangBtn = (el, val) => {
    if (el === val) {
        interfaceLang[0].classList.add('interface_checked');
        if (interfaceLang[1]) { interfaceLang[1].classList.remove('interface_checked') };        
    } else {
        if (interfaceLang[1]) { interfaceLang[1].classList.add('interface_checked') };
        interfaceLang[0].classList.remove('interface_checked');
    };
}; 

//set interface Language Parametrs-----------------------------------------------------
changeLangBtn(interfaceLangParam, 'en-US');
//change interface language
changeSettingsLists(interfaceLang, "interface", (result, i) => {
    setLanguage(result);
    changeLangBtn(result.interface, 'Interface language');
});

//create flag list---------------------------------------------------------------------
myLangBox.innerHTML = '';
langList.forEach(el => { myLangBox.innerHTML += `<img src="./img/lang/${el}.png" alt="" title="${el}">` });
//change my language
changeSettingsLists($_('.settings-my-lang-box')[0].children, "my_lang", (result, i) => {
    if (!result.res && !result.error) { setLanguage(result) };
    if (result.res && !result.error && !myLangSet) { location.reload() };
    if (myLangSet) {      
        myLangSet.setAttribute("title", i.title);
        myLangSet.setAttribute("src", `./img/lang/${i.title}.png`);
    };
    localStorage.setItem("myLang", i.title);
});

//create color list---------------------------------------------------------------------
colorBox.innerHTML = '';
colorList.forEach(el => { colorBox.innerHTML += `<p class="${el}" title="${el}"></p>` });
//change site color
changeSettingsLists($_('.settings-color-box')[0].children, "color", (result, i) => {
    if (result.res) { location.reload() };
});



