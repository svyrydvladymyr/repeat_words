const searchInput = $_('.search > input')[0];
const searchResult = $_('.search_list')[0];
console.log('searchResult', searchResult);

if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('keyup', function () {
        clearTimeout(timeout);    
        timeout = setTimeout(function () {
            if (searchInput.value && searchInput.value.length > 1) {
                send({"word": searchInput.value}, '/search-word', 'POST', (result) => {
                    console.log('resWord', result);
                    console.log('searchResult', searchResult);




                });
            };
        }, 500);
    });
};