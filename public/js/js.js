    const $_ = (value, parent = document) => parent.querySelectorAll(value);
   
    const error = {
            proba : 'sdfsdf'
        };

    const synth = window.speechSynthesis,
          alertMessage = $_('#alert-message')[0];

    let voices = [];


    // add alert message row
    if ($_('.main_body').length > 0) {
        console.log($_('.main_body')[0]);
        $_('.main_body')[0].innerHTML += '<p id="alert-message"></p> '
        
    }

    // dropdown menu
    const showSettingsList = () => { $_('.user_settings_list')[0].classList.toggle('user_settings_list_show')};
    window.onclick = function(event) {
        if (!event.target.matches('.user_settings_list_wrap > i')) {
          const dropdowns = $_('.user_settings_list');
            for (let i = 0; i < dropdowns.length; i++) {
                if (dropdowns[i].classList.contains('user_settings_list_show')) {
                    dropdowns[i].classList.remove('user_settings_list_show');
                };
            };
        };
    };


     