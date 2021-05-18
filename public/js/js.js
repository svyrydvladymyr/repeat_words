const $_ = (value, parent = document) => parent.querySelectorAll(value);
const redirect = way => window.location.replace(`${way}`);;

const error = {
        proba : 'sdfsdf'
    };

const alertMessage = $_('#alert-message')[0],
      voiceStorage = localStorage.getItem("SpeakVoice");


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
    let animation = setInterval(() => { 
        let border = change === 'decrement' ? 0 : 10;           
        if (change === 'decrement') { counter.decrement() };
        if (change === 'increment') { counter.increment() };          
        let count = counter.value();
        dropdowns[0].style.minWidth = `${20 + count*10}px`;
        dropdowns[0].style.opacity = `${0 + count/10}`;
        dropdowns[0].style.fontSize = `${count + 3}px`;
        if (count === border) { clearInterval(animation) };
    }, 20); 
};
const showSettingsList = () => { 
    dropdowns[0].classList.toggle('user_settings_list_show');
    dropdowns[0].classList.contains('user_settings_list_show') ? menuAnimation('increment') : menuAnimation('decrement');
};    

window.onclick = function(event) {        
    if (!event.target.matches('.user_settings_list_wrap > i')) {
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('user_settings_list_show')) {
                setTimeout(() => { dropdowns[i].classList.remove('user_settings_list_show') }, 200);
                menuAnimation('decrement');
            };
        };
    };
};

//for send AJAX  
const send = (obj, url, fun) => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            fun(this.responseText);
        }};
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(obj));     
};    

//get voices index
const getVoicesIndex = (voices, defaultVoice) => {
    let indexFin;
    const voiceForCheck = (defaultVoice !== undefined) ? defaultVoice : voiceStorage;
    voices.forEach((el, index) => { 
        (el.name == voiceForCheck) ? indexFin = index : null; 
    });
    return indexFin;
};

//change settings lists (interface, language, color)
const changeSettingsLists = (list, type, resFun) => {
    for (const i of list) {
        const obj = {"type": type, "value": i.title};
        i.addEventListener('click', () => { send(obj , '/setsettings', (result) => {
            const res = JSON.parse(result);
            alertMessage.innerHTML = '';
            // console.log('res', res);
            resFun(res, i);
        })});
    };
}; 