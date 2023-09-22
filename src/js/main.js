function removePredictions() {
    dropdownContainer.innerHTML = "";
}

function showPredictions(repositories) {
    removePredictions();

    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {

        dropdownContainer.innerHTML += `
            <div class="dropdown-content" 
                data-owner="${repositories.items[repositoryIndex].owner.login}" 
                data-stars="${repositories.items[repositoryIndex].stargazers_count}">
                
                ${repositories.items[repositoryIndex].name}
            </div>`;
    }
}

function addChosen(target) {
    
    chosens.innerHTML += `<div class="chosen">
        <div class="chosen-container">
            <span>Name: ${target.textContent}</span>
            <span>Owner: ${target.dataset.owner}</span>
            <span>Stars: ${target.dataset.stars}</span>
        </div>
        <button class="btn-close"></button>
    </div>`;
}

async function getAPIGitHub() {
    if (dropdownSearch.value == "") {
        removePredictions();
        return;
    }

    try {
        let response = await fetch("https://api.github.com/search/repositories?q="+dropdownSearch.value);
        if (response.ok) {
            let repositories = await response.json();
            showPredictions(repositories);
        }
        else 
              throw new Error;
        } 
    catch(error) {
	    throw new Error;
    }
}


function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(
                () => resolve(fn(...args)),
                timeout,
            );
        });
    };
}

const chosens = document.querySelector(".chosens");
const dropdownSearch = document.querySelector(".dropdown-search");
const dropdownContainer = document.querySelector(".dropdown-container");

dropdownContainer.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("dropdown-content")) {
	    return;
    }
    addChosen(target);
    removePredictions();
    dropdownSearch.value = "";
});

chosens.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) return;

    target.parentElement.remove();
});

const getAPIGitHubDebounce = debounce(getAPIGitHub, 300);
dropdownSearch.addEventListener("input", getAPIGitHubDebounce);