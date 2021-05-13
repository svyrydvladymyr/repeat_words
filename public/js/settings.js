const voiceList = $_('#voice-list')[0],
    voiceSpead = $_('#voice-speed')[0],
    voicePitch = $_('#voice-pitch')[0],
    interfaceLang = $_('.interface-check'),
    myLangBox = $_('.settings-my-lang-box')[0],
    myLangSet = $_('#my-lang')[0],
    voiceSpeadLabel = $_('#voice-speed-label')[0],
    voicePitchLabel = $_('#voice-pitch-label')[0],
    voiceStorage = +localStorage.getItem("SpeakVoice"),
    voiceSpeadStorage = +localStorage.getItem("SpeakSpeed"),
    voicePitchStorage = +localStorage.getItem("SpeakPitch"),
    errorMess = $_('#alert-message')[0],
    colorBox = $_('.settings-color-box')[0],
    colorList = ['blue', 'green', 'red', 'yellow', 'grey'];

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
    errorMess.innerHTML = '';
    localStorage.setItem("SpeakSpeed", voiceSpead.value); 
})});    
voicePitch.addEventListener('change', () => { send({"type":"pitch", "value":voicePitch.value}, '/setsettings', (result) => {
    errorMess.innerHTML = '';
    localStorage.setItem("SpeakPitch", voicePitch.value) 
})});    
voiceList.addEventListener('change', () => { send({"type":"voice", "value":voiceList.selectedIndex}, '/setsettings', (result) => {
    errorMess.innerHTML = '';
    localStorage.setItem("SpeakVoice", voiceList.selectedIndex)  
})});

//change interface language button
const changeLangBtn = (el, val) => {
    if (el === val) {
        interfaceLang[0].classList.add('interface_checked');
        interfaceLang[1].classList.remove('interface_checked');
    } else {
        interfaceLang[1].classList.add('interface_checked');
        interfaceLang[0].classList.remove('interface_checked');
    };
}; 
changeLangBtn(interfaceLangParam, 'en-US');

//change interface language
for (const i of interfaceLang) {
    const obj = {"type":"interface", "value":i.title};
    i.addEventListener('click', () => { send(obj, '/setsettings', (result) => {
        const langPack = JSON.parse(result);
        errorMess.innerHTML = '';
        // console.log(langPack);
        setLanguage(langPack);
        changeLangBtn(langPack.interface, 'Interface language');
    })});
};

//create flag list
myLangBox.innerHTML = '';
langList.forEach(el => { myLangBox.innerHTML += `<img src="./img/lang/${el}.png" alt="" title="${el}">` });

//change my language
const myLang = $_('.settings-my-lang-box')[0].children;
for (const i of myLang) {
    const obj = {"type":"my_lang", "value":i.title};
    i.addEventListener('click', () => { send(obj , '/setsettings', (result) => {
        const langPack = JSON.parse(result);
        errorMess.innerHTML = '';
        // console.log('rrrr', langPack);
        (!langPack.res) ? setLanguage(langPack) : null;
        localStorage.setItem("myLang", i.title);
        myLangSet.setAttribute("title", i.title);
        myLangSet.setAttribute("src", `./img/lang/${i.title}.png`);
    })});
};

//create color list
colorBox.innerHTML = '';
colorList.forEach(el => { colorBox.innerHTML += `<p class="${el}" title="${el}"></p>` });

//change site color
const myColor = $_('.settings-color-box')[0].children;
for (const i of myColor) {
    const obj = {"type":"color", "value":i.title};
    i.addEventListener('click', () => { send(obj , '/setsettings', (result) => {
        const resColor = JSON.parse(result);
        errorMess.innerHTML = '';
        // console.log('rrrr', resColor);
        if (resColor.error) { errorMess.innerHTML = resColor.error }
        if (resColor.res) { location.reload() };
    })});
};