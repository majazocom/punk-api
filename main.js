let searchInput = document.getElementById('search-input');
let beerList = document.getElementById('found-beers-list');
let page = 1; //initialt är vi på sidan ett
let perPage = 10;
let nextPageBtn = document.getElementById('next-page');
let param, selectedIndex, input; //dessa variabler behöver vara globala så vi kan komma åt dem i alla funktiner

let randomBtn = document.getElementById('random');
randomBtn.addEventListener('click', async() => {
    let randomBeer = await fetch('https://api.punkapi.com/v2/beers/random');
    randomBeer = await randomBeer.json();
    console.log(randomBeer[0].name);
})

function updateParams() {
    param = document.getElementById('param');
    selectedIndex = param.selectedIndex;
    param = param.options[selectedIndex].value;

    beerList.innerHTML = ''; //rensar listan innan vi fyller den
    input = searchInput.value;
}

nextPageBtn.addEventListener('click', async function() {
    updateParams(); //uppdaterar värdena så vi kan ha det absolut senaste in i vår fetch
    page++; //ökar sidonumret med 1
    let beers = await getBeers(param, input); //de uppdaterade värdena skickas in i vår fetch

    updateUI(beers);
});

searchInput.addEventListener('keyup', async(e) => {
    page = 1; //vid ny sökning skall sidan bli till 1 igen
    if (e.key === "Enter") {
        updateParams(); //Vår valda option i dropdownen
        let beers = await getBeers(param, input) //här skickar vi in de uppdaterade parametrarna in i vår separata fetch-funktion
        updateUI(beers); //När vi fått våra öler från fetchen skickar vi in dem till vår updatUI-funktion
    }
});

document.getElementById('param').addEventListener('mouseover', function() {
    //simulate click event on element
    console.log('mouseover')
    document.getElementById('param').click();
    //document.getElementById('param').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    //document.getElementById('param').dispatchEvent(document.createEvent('MouseEvents').initMouseEvent('mousedown', true, true, window));
})

function updateUI(beers) {
    console.log(beers.length);
    if (beers.length < perPage) {
        nextPageBtn.style.display = 'none';
    }
    beers.forEach(beer => {
        let listItem = document.createElement('li');

        listItem.innerText = beer.name;

        beerList.appendChild(listItem);
        let img = document.createElement('img');
        img.addEventListener('click', function() {
            //spara vald öl i local storage
            window.localStorage.setItem('beer', JSON.stringify(beer));
            window.location.href = "./beer.html";
        })
        img.setAttribute('src', beer.image_url);
        img.setAttribute('class', 'beerImage');
        beerList.appendChild(img);
    });
}

async function getBeers(param, value) {
    let baseUrl = 'https://api.punkapi.com/v2/';
    try {
        let response = await fetch(`${baseUrl}beers?${param}=${value}&page=${page}&per_page=${perPage}`)
        let data = await response.json()
        return await data;
    } catch (err) {
        console.error(err);
    }
}