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