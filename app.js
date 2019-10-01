const apiKey = 'b0b371271a4f917bf40f513c72c92810'
const baseUrl = `https://api.themoviedb.org/3/`
const url = `https://api.themoviedb.org/3/movie/550?api_key=${apiKey}`

const wholeUrl = window.location.href
const appLocation = wholeUrl.slice(0, (wholeUrl.search('movieApp') + ('movieApp'.length + 1)))

function createNode(element) {
  return document.createElement(element)
}

function append(parent, el) {
  return parent.appendChild(el)
}

async function getUpcoming() {
  const root = document.getElementById('movies')
  const container = document.createElement('div')
  container.setAttribute('class', 'container')

  const roulette = document.getElementById('roulette')

  roulette.addEventListener('click', function (event) {
    window.location = `${appLocation}roulette.html`
  })

  const upcoming = await window.fetch(`${baseUrl}movie/upcoming?api_key=${apiKey}`)
  const upcomingJson = await upcoming.json()
  let results = upcomingJson.results

  return results.forEach((el, i) => {
    const title = createNode('p')
    title.setAttribute('class', 'title')
    const year = el.release_date.split('-')
    title.innerHTML = `${el.title} (${year[0]})`

    const movieDetails = createNode('div')
    movieDetails.setAttribute('class', 'movieDetails')

    const language = createNode('p')
    language.setAttribute('class', 'language')
    language.innerHTML = `Language: ${el.original_language}`

    const img = createNode('img')
    img.setAttribute('class', 'poster')
    img.src = `${'https://image.tmdb.org/t/p/w185' + el.poster_path}`
    img.setAttribute('id', el.id)
    img.addEventListener('click', function (event) { // redirect to movie details after clicked
      window.location = `${appLocation}movieDetails.html?movieId=${event.target.id}` // getMovieDetails() event parametar
    })

    const rating = createNode('div')
    rating.setAttribute('class', 'ratings')
    rating.innerHTML = `${el.vote_average}`

    append(root, container)
    append(container, movieDetails)
    append(movieDetails, img)
    append(movieDetails, title)
    append(movieDetails, language)
    append(movieDetails, rating)

    if (i > 7) {
      movieDetails.classList.add('hiddenClass') // show only first eight items (four per row)
    }
  })
}

async function getMovieDetails(param) {
  let url, movieId
  if (param.srcElement) { // we get event from click event where we extract id from URL
    url = param.srcElement.URL
    movieId = url.substr(url.indexOf('=') + 1, url.length)
  } else { // or we get id from roulette random movie
    movieId = param
  }
  const response = await window.fetch(`${baseUrl}movie/${movieId}?api_key=${apiKey}`)
  const movie = await response.json()
  const root = document.getElementById('root')

  const detailsContTop = document.createElement('div')
  detailsContTop.setAttribute('class', 'detailsContTop')
  append(root, detailsContTop)

  const title = createNode('h1')
  title.setAttribute('class', 'movieTitle')
  const year = movie.release_date.split('-')
  title.innerHTML = `${movie.title} (${year[0]})`

  const img = createNode('img')
  img.setAttribute('class', 'detailsPoster')
  img.src = `${'https://image.tmdb.org/t/p/w300' + movie.poster_path}`

  const details = createNode('div')
  details.setAttribute('class', 'details')

  const movieRating = createNode('p')
  movieRating.setAttribute('class', 'movieRating')
  movieRating.innerHTML = `<b>Rating: ${movie.vote_average}</b>  - out of ${movie.vote_count} votes`

  const popularity = createNode('p')
  popularity.setAttribute('class', 'popularity')
  popularity.innerHTML = `<b>Popularity:</b> ${movie.popularity}`

  const language = createNode('p')
  language.setAttribute('class', 'langDetails')
  language.innerHTML = `<b>Language:</b> ${movie.original_language}`

  const prodCompanies = createNode('p')
  prodCompanies.setAttribute('class', 'prodCompanies')
  let companies = []
  movie.production_companies.forEach(e => {
    companies.push(e.name)
  })
  prodCompanies.innerHTML = `<b>Production companies:</b> ${companies.join(', ')}`

  const genres = createNode('p')
  genres.setAttribute('class', 'genres')
  let genreArr = []
  movie.genres.forEach(e => {
    genreArr.push(e.name)
  })
  genres.innerHTML = `<b>Genres:</b> ${genreArr.join('/')}`

  const tagline = createNode('p')
  tagline.setAttribute('class', 'tagline')
  tagline.innerHTML = `<b>Tagline:</b> ${movie.tagline}`

  const plot = createNode('p')
  plot.setAttribute('class', 'plot')
  plot.innerHTML = `<b>Plot:</b> ${movie.overview}`

  const runtime = createNode('p')
  runtime.setAttribute('class', 'runtime')
  runtime.innerHTML = `<b>Runtime:</b> ${movie.runtime} min`

  const imdbLink = createNode('a')
  imdbLink.setAttribute('class', 'imdbLink')
  imdbLink.href = `https://www.imdb.com/title/${movie.imdb_id}/`

  const imdbLogo = createNode('img')
  imdbLogo.setAttribute('class', 'imdbLogo')
  imdbLogo.src = 'img/imdb.png'

  const starRating = createNode('div')
  starRating.setAttribute('class', 'rating')

  append(root, title)
  append(root, detailsContTop)

  append(detailsContTop, img)
  append(detailsContTop, details)

  append(details, popularity)
  append(details, language)
  append(details, prodCompanies)
  append(details, genres)
  append(details, plot)
  append(details, runtime)
  append(details, imdbLink)
  append(imdbLink, imdbLogo)

  let userRating = window.localStorage.getItem(movie.id)
  const rateMovie = createNode('p')
  rateMovie.innerHTML = 'Rate the movie'
  append(details, movieRating)
  append(details, starRating)
  append(starRating, rateMovie)

  // logic for rating a movie
  if (!userRating) {
    for (let i = 10; i > 0; i--) {
      const stars = createNode('option')
      stars.innerHTML = '☆'
      stars.setAttribute('value', i)
      stars.setAttribute('type', 'radio')
      stars.setAttribute('id', i)
      stars.setAttribute('name', 'stars')
      append(starRating, stars)
    }
  } else {
    rateMovie.innerHTML = `Your rating: ${JSON.parse(userRating)}` // TODO: show stars after rating
  }
  let radios = document.getElementsByName('stars')

  // rating with stars like on IMDB -- needs little bit of refactoring
  for (let i = 0; i < radios.length; i++) {
    radios[i].onclick = function () {
      let userRating = radios[i].value
      window.localStorage.setItem(movie.id, JSON.stringify(userRating))
      for (let j = i; j < 10; j++) {
        radios[j].setAttribute('checked', true) // show as much stars as user rating of the movie
        for (let k = i - 1; k >= 0; k--) {
          radios[k].setAttribute('checked', false) // hide rest of the stars
        }
      }
    }
  }
}

async function roulette() {
  const genreList = document.getElementsByClassName('genreList')
  for (let i = 0; i < genreList.length; i++) {
    genreList[i].onclick = async function () { // choosing genre radio button
      // fetch movie with chosen genre
      const response = await window.fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreList[i].value}`)
      const moviesByGenre = await response.json()
      // getting random item from array
      var randomMovie = moviesByGenre.results[Math.floor(Math.random() * (moviesByGenre.results.length - 1))]
      window.location = `${appLocation}movieDetails.html?movieId=${randomMovie.id}`
      getMovieDetails(randomMovie.id) // getMovieDetails() id parametar
    }
  }
}

function loadMore(items) {
  [].forEach.call(document.querySelectorAll('.hiddenClass'), function (item, i) { // call this selected array of data
    if (i < 8) { // show only first eight movies (four per row) - the rest have .hiddeClass appended
      item.classList.remove('hiddenClass')
    }
    if (document.querySelectorAll('.hiddenClass').length === 0) {
      document.querySelector('.loadMore').style.display = 'none' // remove button after all data loaded
    }
  })
}
