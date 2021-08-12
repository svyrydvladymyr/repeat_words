const searchInput = $_('.search > input')[0];
const searchResult = $_('.search_list')[0];

if (searchInput) {
    searchInput.addEventListener('input', function () {
        let inputValue = searchInput.value.replace(/[^a-zа-я-іїєґёäöüßąćęłńóśźżàèéìíîòóùúáéíñóúüàâäôéèëêïîçùûüÿæœ'\u3000\u3400-\u4DBF\u4E00-\u9FFF ]/gi, '');
        searchInput.value = inputValue.replace(/\s\s/g, ' ').replace(/--/g, '-').replace(/ -/g, '-').replace(/- /g, '-');
    });
    let timeout = null;
    searchInput.addEventListener('keyup', function () {
        clearTimeout(timeout);    
        timeout = setTimeout(function () {
            if (searchInput.value && searchInput.value.length > 1) {
                let searchWord = searchInput.value.trim();
                searchWord = (searchWord[searchWord.length-1] === '-') ? searchWord.slice(0, -1) : searchWord;
                searchWord = (searchWord[0] === '-') ? searchWord.slice(1, searchWord.length) : searchWord;
                send({"word": searchWord}, '/search-word', (result) => {


                    const wordsList = JSON.parse(result);
                    console.log('wordsList', wordsList);


                    if (wordsList.NO) {
                        console.log('wordsList.NO', wordsList.NO);
                        searchResult.innerHTML = wordsList.NO;
                    };
                });
            };
        }, 900);
    });
};

const plusTranslate = (element, type) => {
    const translateBody = $_('.add_translate')[0];
    const translateBodyChild = translateBody.children;
    const childPlaceholder = translateBodyChild[0].children[0].placeholder;
    const plusTransBody = document.createElement("div");
    plusTransBody.setAttribute('class', 'add');
    plusTransBody.innerHTML = `<input type="text" name="translate" placeholder="${childPlaceholder}">
                               <div class="icon_box">
                                   <i class='fa fa-language'></i>
                                   <i class='fas fa-plus' onclick="plusTranslate(this, 'plus')"></i>
                               </div>`;
    class classLists { constructor(){}
        style(element, first, second){
            element.classList.replace(`fa-${first}`, `fa-${second}`);
            element.setAttribute('onclick', `plusTranslate(this, '${second}')`);
        };
    };
    const classStyle = new classLists();    
    if (type === 'plus') {
        classStyle.style(element, 'plus', 'minus');
        if (translateBodyChild.length < 3) { translateBody.appendChild(plusTransBody) };
        if (translateBodyChild.length === 3) { classStyle.style(translateBodyChild[translateBodyChild.length - 1].children[1].children[1], 'plus', 'minus') };
    };
    if (type === 'minus') {
        element.parentNode.parentNode.remove();
        if (translateBodyChild.length < 3) { classStyle.style(translateBodyChild[translateBodyChild.length - 1].children[1].children[1], 'minus', 'plus') };
    };
};

const difficultyRangeColor = (range) => {
    const difficultyWrap = [...$_('.add_difficulty')[0].children];
    difficultyWrap.forEach(el => { el.style.color = '#eae9e9' });
    difficultyWrap[range.value].style.color = 'var(--second-color)';
};