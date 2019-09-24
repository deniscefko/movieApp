const apiKey = 'b0b371271a4f917bf40f513c72c92810'
const baseUrl = `https://api.themoviedb.org/3/movie`
const url = `https://api.themoviedb.org/3/movie/550?api_key=${apiKey}`

const root = document.getElementById('movies')
const container = document.createElement('div')
container.setAttribute('class', 'container')

function createNode (element) {
  return document.createElement(element)
}

function append (parent, el) {
  return parent.appendChild(el)
}

append(root, container)

async function getUpcoming () {
  const upcoming = await window.fetch(`${baseUrl}/upcoming?api_key=${apiKey}`)
  const upcomingJson = await upcoming.json()
  console.log(upcomingJson.results)
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

    const rating = createNode('div')
    rating.setAttribute('class', 'rating')
    rating.innerHTML = `${el.vote_average}`

    append(container, movieDetails)
    append(movieDetails, img)
    append(movieDetails, title)
    append(movieDetails, language)
    append(movieDetails, rating)

    if (i > 7) {
      movieDetails.classList.add('hiddenClass')
    }
  })
}

async function getDetails () {
  const details = document.getElementById()
}

function loadMore (items) {
  [].forEach.call(document.querySelectorAll('.hiddenClass'), function (item, i) {
    if (i < 8) {
      item.classList.remove('hiddenClass')
    }
    if (document.querySelectorAll('.hiddenClass').length === 0) {
      document.querySelector('.loadMore').style.display = 'none'
    }
  })
}

getUpcoming()
