const closeModal = (el) => { 
    let valClose = true;
    el.path.forEach(element => {
        if (element.classList && element.classList.contains('modal_place')) { valClose = false };
    });
    if (valClose) { modal.innerHTML = '' }; 
}; 

const showModal = function(type){

    console.log('type', type);
    console.log('place', modal);

    modal.innerHTML = modalTemplate[type];
    
}