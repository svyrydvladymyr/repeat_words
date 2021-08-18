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
            <div class="add">
                <input type="text" name="word" placeholder="Search...">
                <div class="icon_box">
                    <i class='fa fa-file-word'></i>
                </div>                
            </div>  
            <div class="add_translate">
                <div class="add">                
                    <input type="text" name="translate" placeholder="Search...">
                    <div class="icon_box">
                        <i class='fa fa-language'></i>
                        <i class='fas fa-plus' onclick="plusTranslate(this, 'plus')"></i>
                    </div>
                </div>  
            </div>
            <div class="add">
                <input type="text" name="description" placeholder="Search...">                
                <div class="icon_box">
                    <i class='fa fa-pen-alt'></i>
                </div>
            </div>  
            <div class="add">
                <p class="add_difficulty_label">Тільки для вас!</p>
                <input type="range" name="difficulty" min="0" max="2" value="1" step="1" onchange="difficultyRangeColor(this)">                
                <div class="icon_box">
                    <i class='fa fa-brain'></i>
                </div>
                <div class="add_difficulty">
                    <i class='fas fa-battery-full'></i>
                    <i class='fas fa-battery-half' style="color:var(--second-color)"></i>
                    <i class='fas fa-battery-quarter'></i>
                </div>
            </div>  
            <div class="add">
                <div class="add_lists">
                    <input type="checkbox" name="lists" id="lists" checked onclick="return false"/>      
                    <label for="lists">Додається до головного списку слів!</label>
                </div>
                <div class="icon_box">
                    <i class='fa fa-list-alt'></i>
                    <i class='fa fa-chevron-down' onclick="showLists()"></i>
                </div>
            </div>  
            <div class="add add_lists_list">
                <div class="search-wrap">
                    <input type="text" name="search_list" placeholder="Search list...">
                </div>                
                <div class="add_lists">
                    <input type="checkbox" value="0001">      
                    <label>Додається до головного sdfsdf sdfs df sdf  wxd fsdfgsdf sdfg gh списку слів!</label>
                </div>
                <div class="add_lists">
                    <input type="checkbox" value="0001">     
                    <label>Додається до головного сcvbcvbcvb cvbcvbcvbcvbcvbdfbdfbxcvbcbcbcbdbdbdfbdfdbdfbdfbdfbdbcvbedfbdfbпиfgh dfghску слів!</label>
                </div>
                <div class="add_lists">
                    <input type="checkbox" value="0001">     
                    <label>Додається до головногоdfghdsf hgdfg списку слів!</label>
                </div>
                <div class="add_lists">
                    <input type="checkbox" value="0001">     
                    <label>Додається до головногоdf ghdf списку слів!</label>
                </div>
                <div class="add_lists">
                    <input type="checkbox" value="0001">     
                    <label>Додається до головного списку слів!</label>
                </div>
                <div class="add_lists">
                    <input type="checkbox" value="0001">     
                    <label>Додається до головного hdfgdf hdfgh dfghdf ghdfghdf gh списку слів!</label>
                </div>
                <div class="add_lists">
                    <input type="checkbox" value="0001">     
                    <label>Додається до головного списку слів!</label>
                </div>
            </div>
            <div class="add">
                <button id='btnSpeak' title="Add word">Clear <i class='fa fa-times'></i></button>
                <button id='btnSpeak' title="Add word">Save <i class='far fa-paper-plane'></i></button>
            </div>
        </div>        
    </div>`
}