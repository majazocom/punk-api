let beer = window.localStorage.getItem('beer');
beer = JSON.parse(beer);
document.querySelector('.beer-name').innerText = beer.name;

let beerImgEl = document.getElementById('beer-img');
beerImgEl.style.backgroundImage = `url(${beer.image_url})`;