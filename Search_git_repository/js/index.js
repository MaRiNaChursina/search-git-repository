

function main() {
    const searchForm = document.forms.search;
    searchForm.addEventListener('submit', searchRepos);

    const allInputs = document.querySelectorAll('input');
    
}

 async function getRepos(queryInput) {
    const query = queryInput.value;
    let queryURL = 'https://api.github.com/search/repositories?q=';
    queryURL += query;
    queryURL += ' in:name' ;
    return fetch(queryURL);
}

function showReposList(reposResponse, queryInput) {
    if (reposResponse.items.length === 0) {
        showNoReposFound(queryInput.value);
        return;
    }

    const repos = reposResponse.items.slice(0, 10);
    const reposReduced = repos.map(repo => {
        return {
            name: repo.name,
            url: repo.html_url,
            owner: {
                login: repo.owner.login,
                url: repo.owner.html_url,
                avatar_url: repo.owner.avatar_url
            },
            forks_count: repo.forks_count,
            language: repo.language,
            description: repo.description
        }
    });

    reposReduced.forEach(repo => {
        insertRepoToList(repo);
    });
}

 function searchRepos(element) {
    element.preventDefault();
    const searchForm = document.forms.search;
    const queryInput = searchForm.search;
    

    

   

    removeNoReposMessage(); // убираем сообщение об отсутствии репозиториев, если оно есть
    clearReposList(); // очищаем список показываемых репозиториев
    showLoadingBlock(); // показываем надпись загрузки
    
    // получаем репозитории
    getRepos(queryInput)
    .then(response => response.json())
    .then(repos => showReposList(repos, queryInput))
    .catch(error => {
        console.log('error: ', error);
    })
    .finally(() => {
        hideLoadingBlock();
    })
}

 function clearReposList() {
    const reposList = document.querySelector('.content__list');
    reposList.innerHTML = '';
}
 function showNoReposFound(query) {
   

    const noReposBlock = document.createElement('div');
    noReposBlock.classList.add('no-content-message');
    noReposBlock.textContent = `По запросу "${query}" репозиториев не найдено`;

    const reposListBox = document.querySelector('.content');
    reposListBox.append(noReposBlock);
}

function insertRepoToList(repo) {
    const list = document.querySelector('.content__list');
    
    const listItem = document.createElement('li');
    listItem.classList.add('content__item');
    
    
    const imgBlock = document.createElement('div');
    imgBlock.classList.add('content__img-block');
    const textBlock = document.createElement('div');
    textBlock.classList.add('content__text-block');

    const avatar = document.createElement('img');
    avatar.classList.add('content__avatar');
    avatar.src = repo.owner.avatar_url;
    imgBlock.append(avatar);
    
    const owner = document.createElement('div');
    const ownerLink = document.createElement('a');
    ownerLink.target = '_blank';
    owner.classList.add('content__owner');
    ownerLink.href = repo.owner.url;
    ownerLink.textContent = repo.owner.login
    owner.textContent = "Владелец: ";
    owner.append(ownerLink);
    textBlock.append(owner);

    const name = document.createElement('div');
    const nameLink = document.createElement('a');
    nameLink.target = '_blank';
    name.classList.add('content__name');
    nameLink.href = repo.url;
    nameLink.textContent = repo.name;
    name.textContent = "Репозиторий: ";
    name.append(nameLink);
    textBlock.append(name);


    const description = document.createElement('div');
    description.classList.add('content__description');
    if (repo.description === null) {
        const noDescriptionSpan = document.createElement('span');
        noDescriptionSpan.classList.add('content__description-span');
        noDescriptionSpan.textContent = 'Нет описания';
        description.append(noDescriptionSpan);
    } else {
        description.textContent = repo.description;
    }
    textBlock.append(description);


    const language = document.createElement('div');
    const languageSpan = document.createElement('span');
    languageSpan.classList.add('content__span');
    languageSpan.textContent = repo.language || '-';
    language.classList.add('content__language');
    language.textContent = "Основной язык: ";
    language.append(languageSpan);
    textBlock.append(language);

  
    listItem.append(imgBlock);
    listItem.append(textBlock);
    
    list.append(listItem);
}

function removeNoReposMessage() {
    const noReposBlock = document.querySelector('.no-content-message');
    if (noReposBlock) {
        noReposBlock.remove();
    }
}

function showLoadingBlock() {
    const reposBlock = document.querySelector('.content');
    
    const loadingBlock = document.createElement('div');
    loadingBlock.classList.add('loading-block');
    loadingBlock.textContent = 'Идёт запрос. Пожалуйста, подождите';
    
    reposBlock.append(loadingBlock);
}

function hideLoadingBlock() {
    const loadingBlock = document.querySelector('.loading-block');
    loadingBlock.remove();
}


main();