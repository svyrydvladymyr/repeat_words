    const $_ = (value, parent = document) => parent.querySelectorAll(value);
   
    const error = {
            proba : 'sdfsdf'
        };

    const synth = window.speechSynthesis,
          alertMessage = $_('#alert-message')[0];

    let voices = [];


     