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
  return upcomingJson.results.map((el) => {
    const title = createNode('h3')
    title.innerHTML = `${el.original_title}`

    const movieDetails = createNode('div')
    movieDetails.setAttribute('class', 'movieDetails')

    const language = createNode('p')
    language.innerHTML = `Language: ${el.original_language}`

    const img = createNode('img')
    img.setAttribute('class', 'poster')
    img.src = `${'https://image.tmdb.org/t/p/w154' + el.poster_path}`
    append(container, movieDetails)
    append(movieDetails, img)
    append(movieDetails, title)
    append(movieDetails, language)
  })
}

getUpcoming()
// const ul = document.getElementById('movies')
// const url = `https://api.themoviedb.org/3/movie/550?api_key=${api_key}`
// const li = document.createElement('li')
// li.innerHTML = 'works'
// ul.appendChild(li)

// window.fetch(url)
//   .then(data => {
//     return data.json()
//   }).then(res => {
//     const ul = document.getElementById('movies')
//     const url = 'https://api.themoviedb.org/3/movie/550?api_key=b0b371271a4f917bf40f513c72c92810'
//     const li = document.createElement('li')
//     li.innerHTML = res.original_title
//     ul.appendChild(li)
//     // console.log(res.original_title)
//   }).catch(err => {
//     console.log(err)
//   })
