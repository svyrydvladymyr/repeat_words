//get element
const $_ = (value, parent = document) => parent.querySelectorAll(value);

//redirect page
const redirect = way => window.location.replace(`${way}`);

//validation email
const validEmail = text => (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;

//logout
const exit = () => { send({}, '/exit', (res) => { location.reload() }) };

const alertMessage = $_('#alert-message')[0],
      voiceStorage = localStorage.getItem("SpeakVoice");
let oldVersion, plase, forRemote = [];

// dropdown menu
const dropdowns = $_('.user_settings_list');
const makeCounter = function() {
    let privateCounter = 0;
    const changeBy = val => privateCounter += val;
    return {
        increment: () => changeBy(1), 
        decrement: () => changeBy(-1), 
        value: () => privateCounter
    };
};
const counter = makeCounter();    
const menuAnimation = (change) => {
    var windowWidth = window.innerWidth;
    let animation = setInterval(() => { 
        let border = change === 'decrement' ? 0 : 10;           
        if (change === 'decrement') { counter.decrement() };
        if (change === 'increment') { counter.increment() };          
        let count = counter.value();
        if (windowWidth < 767) {dropdowns[0].style.width = `${count*10}%`};
        dropdowns[0].style.maxWidth = windowWidth < 767 ? `${count*10}%` : `${20 + count*20}px`;        
        dropdowns[0].style.opacity = `${0 + count/10}`;
        dropdowns[0].style.fontSize = `${count + 3}px`;
        if (count === border) { clearInterval(animation) };
    }, 20); 
};
const showSettingsList = () => {
    dropdowns[0].classList.toggle('user_settings_list_show');
    dropdowns[0].classList.contains('user_settings_list_show') ? menuAnimation('increment') : menuAnimation('decrement');
};    

//for close context menu
window.onclick = function(event) {        
    if (!event.target.matches('.user_settings_list_wrap > i')) {
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('user_settings_list_show')) {
                setTimeout(() => { dropdowns[i].classList.remove('user_settings_list_show') }, 200);
                menuAnimation('decrement');
            };
        };
    };

    console.log(forRemote);

    ['gender', 'birthday', 'emailverified'].forEach(element => {
        if (!event.target.matches(`#${element}>b>.fa-edit`) &&
            !event.target.matches(`.forRemote${element}`)) {
            for (let i = 0; i < forRemote.length; i++) {
                if (forRemote[i].classList.contains(`forRemote${element}`)) {
                    plase.innerHTML = oldVersion;                            
                };
            };
        };
    });


    // if (!event.target.matches('#gender>b>.fa-edit') &&
    //     !event.target.matches('.forRemotegender')) {
    //     for (let i = 0; i < forRemote.length; i++) {
    //         if (forRemote[i].classList.contains('forRemotegender')) {
    //             plase.innerHTML = oldVersion;                            
    //         };
    //     };
    // };
    // if (!event.target.matches('#birthday>b>.fa-edit') &&
    //     !event.target.matches('.forRemotebirthday')) {
    //     for (let i = 0; i < forRemote.length; i++) {
    //         if (forRemote[i].classList.contains('forRemotebirthday')) {
    //             plase.innerHTML = oldVersion;                            
    //         };
    //     };
    // };
    
};

//date format day
const readyDay = function(fullDate){
    const createDate = new Date(fullDate);
    return finDay = ((createDate.getDate() >= 1) && (createDate.getDate() <= 9)) ? "0" + createDate.getDate() : createDate.getDate();
};  

//date format month
const readyMonth = function(fullDate){    
    const createDate = new Date(fullDate);
    return finMonth = ((createDate.getMonth() >= 0) && (createDate.getMonth() <= 8)) 
        ? "0" + (createDate.getMonth()+1) 
        : (createDate.getMonth() == 9) ? 10 
        : (createDate.getMonth() == 10) ? 11
        : (createDate.getMonth() == 11) ? 12 : null;          
}; 

//for send AJAX  
const send = (obj, url, fun, req = 'POST') => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            fun(this.responseText);
        }};
    xmlhttp.open(req, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(obj));     
};    

//get voices index
const getVoicesIndex = (voices, defaultVoice) => {
    let indexFin;
    const voiceForCheck = (defaultVoice !== undefined) ? defaultVoice : voiceStorage;
    voices.forEach((el, index) => { 
        if (el.name == voiceForCheck) { indexFin = index }; 
    });    
    return indexFin;
};

//change settings lists (interface, language, color)
const changeSettingsLists = (list, type, resFun) => {
    for (const i of list) {
        // const obj = {"type": type, "value": i.title};
        // let event = 'click';
        // (type === 'birthday') ? event = "change" : null;
        // (type === 'emailverified') ? event = "change" : null;
        i.addEventListener((type === 'birthday' || type === 'emailverified') ? 'change' : 'click', () => { 
            // const value = (type === 'birthday') ? $_(`.forRemote${type}`)[0].value : i.title;
            // const value = i.title;
            if (i.title !== '') {
                send({"type": type, "value": i.title} , '/setsettings', (result) => {
                    // const res = JSON.parse(result);
                    alertMessage.innerHTML = '';
                    // console.log('res', JSON.parse(result));
                    resFun(JSON.parse(result), i);
                });
            };
        });
    };
}; 

//shows language list with language names
const showLangList = (langStringList, langStringName, place) => {
    langStringList.split(",").forEach((el, index) => { 
        place.innerHTML += `<button class="selectLanguage" title="${el}" >${langStringName.split(",")[index]}<img src="../img/lang/${el}.png"></button>`; 
    });   
};


