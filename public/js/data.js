//languages name list object
const langNameObj = {
    "en-US" : "ENGLISH", 
    "uk-UA" : "УКРАЇНСЬКА", 
    "it-IT" : "ITALIANO",
    "de-DE" : "DEUTSCHE", 
    "fr-FR" : "FRANÇAIS",
    "es-ES" : "ESPAÑOL",
    "zh-CN" : "中国人",
    "pl-PL" : "POLSKIE",
    "ru-RU" : "РОССИЙСКАЯ"
};

// for change interface language on settings page
const changeSettings = [
    "interface", 
    "language", 
    "voice", 
    "speed", 
    "pitch", 
    "color", 
    "back", 
    "profile", 
    "settings", 
    "friends", 
    "exit", 
    "site", 
    "dev"
];

settingsTemplate = {
    gender : 
        `<input type="radio" id="gendervenus" class="forRemotegender" name="gender" title="venus">
        <label for="gendervenus" style="color:red"><i class='fa fa-venus'></i></label> &nbsp;                                
        <input type="radio" id="gendermars" class="forRemotegender" name="gender" title="mars">
        <label for="gendermars" style="color:blue"><i class='fa fa-mars'></i></label>`,
    birthday : 
        `<input type="date" class="forRemotebirthday" min="1920-01-01" max="${moment(new Date).format('YYYY-MM-DD')}" value="">`,
    emailverified : 
        `<input type="email" class="forRemoteemailverified" onInput="this.parentNode.dataset.value = this.value" maxLength = "60" value="" title="">`
};   


modalTemplate = {
    add:
    `<div class="modal_body" onclick="closeModal(event)">
        <div class="modal_close">
            <i class='fa fa-times'></i>
        </div>
        <div class="modal_place">
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfg cvbncvbn cvbncvb nvbn  cvbcvbn cv ncv nvbsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfgsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfgsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfgsdgsdfg sdf g</p>
            <p>sdfvsdfsd fsdg sdfg sdfgsdfgsd gsdfgsd fgsdfgsdf gsdfgsdgsdfg sdf g</p>
        </div>        
    </div>`
}