let getJoke = document.querySelector('.get-joke');
let firstJokejoke = document.querySelector('.joke-text');
let joke = document.querySelector('.joke');
let form = document.querySelector("form");
let fromCategories = document.querySelector("#categories");
let search = document.querySelector('#searchfield');
let categories = document.querySelector('.categories');
let category = document.createElement('button');
category.setAttribute('class', 'category');
let id = document.querySelector('.id ');
let main = document.querySelector('.main');
let lastUpdate = document.querySelector('.last-update');
let favourite = document.querySelector('.favourite');
let jokeCategory = document.querySelector('.joke-category');
let jokeField = document.querySelector('.joke-field');
let localtorage = JSON.parse(localStorage.getItem('favList'));
let openFav = document.querySelector('.fav-button-open');
let closeFav = document.querySelector('.fav-button-close');
let secCont = document.querySelector('.section-container');


openFav.addEventListener('click', function() {
  let fav = document.querySelector('.fav');
  secCont.style.display = 'block';
  secCont.style.zIndex = '5';
  fav.style.display = 'block';
});

closeFav.addEventListener('click', function() {
  let fav = document.querySelector('.fav');
  secCont.style.display = 'none';
  secCont.style.zIndex = '-1';
  fav.style.display = 'none';
});

function updateFav(obj) {
  favourite.innerHTML = '';
  
  for (let key of obj) {
    let div = document.createElement('div');
    
    if (key) {
      div.innerHTML = key.fav;
      div.setAttribute('id', obj.indexOf(key));
      div.setAttribute('class', 'favourite-joke');
      favourite.append(div);
    }
  }
}

favourite.addEventListener('click', function() {

  if (event.target.tagName !==  `I`) return;
  event.target.closest('.favourite-joke').remove();
  let attribute = event.target.closest('.favourite-joke').getAttribute('id');
  localtorage[attribute] = null;
  localStorage.setItem('favList', JSON.stringify(localtorage));
  localtorage = JSON.parse(localStorage.getItem('favList'));
  updateFav(localtorage);
});

jokeField.addEventListener('click', function() {

  if (event.target.tagName !==  `I`) {return;}

  let attribute = event.target.closest('.joke').getAttribute('id');

  if (event.target.classList.contains('fas')) {
    event.target.classList.toggle('fas');
    event.target.classList.toggle('far');
    localtorage[attribute] = null;
    localStorage.setItem('favList', JSON.stringify(localtorage));
    localtorage = JSON.parse(localStorage.getItem('favList'));
    updateFav(localtorage);
    return;
  }

  event.target.classList.toggle('fas');
  event.target.classList.toggle('far');

  fav = {fav: event.target.closest('.joke').innerHTML};
  localtorage = JSON.parse(localStorage.getItem('favList'));
  localtorage[attribute] = fav;

  localStorage.setItem('favList', JSON.stringify(localtorage));
  localtorage = JSON.parse(localStorage.getItem('favList'));
  updateFav(localtorage);
});

window.addEventListener('DOMContentLoaded', function() {
  let request = new XMLHttpRequest();
  request.open('GET', 'https://api.chucknorris.io/jokes/categories');
  request.setRequestHeader('Content-type', 'application/json; chatset=utf-8');
  request.send();
  request.addEventListener('readystatechange', function() {
    if (request.readyState === 4 && request.status == 200) {
      let data = JSON.parse(request.response);
      
      for (let el of data) {
        let clone = category.cloneNode();
        clone.textContent = el.toUpperCase();
        clone.setAttribute('id', `${el}`);
        categories.append(clone);
      }
    }
  });

  if (localStorage.getItem('favList')) {
    let localState = JSON.parse(localStorage.getItem('favList'));
    updateFav(localState);
  } else {
    let blank = [];
    localStorage.setItem('favList', JSON.stringify(blank));
  }
});

form.addEventListener('click', function() {

  if (event.target.getAttribute('class') !== 'category') {
    return;
  }
    event.preventDefault();
    search.value = event.target.getAttribute('id');
});

form.addEventListener ('click', function(event) {

  switch(event.target.value) {
    case 'random':
      search.style.display = 'none';
      categories.style.display = 'none';
      break;
    case 'categories':
      search.style.display = 'none';
      categories.style.display = 'block';
      break;
    
    case 'search':
      search.value = '';
      search.style.display = 'block';
      categories.style.display = 'none';
      break;
  }
});

form.addEventListener ('click', function(event) {

  if (event.target.value === "random" || event.target.value === "categories") {
    search.style.display = 'none';
  } else if (event.target.value === "search") {
    search.style.display = 'block';
  }
});

form.addEventListener("submit", function(event) {
  let data = new FormData(form);
  let output;
  
  for (const entry of data) {
    output = entry[1];
  }

  let request = new XMLHttpRequest();

  switch (output) {
    case 'random':
      request.open('GET', 'https://api.chucknorris.io/jokes/random');
      request.addEventListener('readystatechange', function() {

      if (request.readyState === 4 && request.status == 200) {
        let data = JSON.parse(request.response);
        createJoke(data);
        let div = joke.cloneNode(true);
            div.setAttribute('id', `${jokeField.children.length - 1}`);
            div.style.display = 'block';
            jokeField.prepend(div);
        }
      });
      break;

    case 'categories':
    case 'search':
      request.open('GET', `https://api.chucknorris.io/jokes/search?query=${search.value}`);
      request.addEventListener('readystatechange', function() {
        if (request.readyState === 4 && request.status == 200) {
          let data = JSON.parse(request.response);

          if (data.result.length > 0) {

            for (let el of data.result) {
              createJoke(el);
              let div = joke.cloneNode(true);
              div.style.display = 'block';
              div.setAttribute('id', `${jokeField.children.length - 1}`);
              jokeField.prepend(div);
            }
          } else {alert('No jokes found. Try another request');}
        }
      });
      break;
  }
  request.setRequestHeader('Content-type', 'application/json; chatset=utf-8');
  request.send();
  event.preventDefault();
}, false);

function createJoke(obj) {
  firstJokejoke.textContent = obj.value;
  id.textContent = obj.id;
  if (obj.categories && obj.categories.length > 0) {
    jokeCategory.style.display = 'block';
    jokeCategory.textContent = obj.categories[0];
  } else {
    jokeCategory.style.display = 'none';
  }  

  id.setAttribute('href', `${obj.url}`);
  let updated = new Date(obj.updated_at);
  let dateNow = Date.now();
  let remaining = (dateNow - updated.getTime());
  lastUpdate.textContent = `Last update: ${Math.floor(remaining/1000/60/60)} hours ago`;
}