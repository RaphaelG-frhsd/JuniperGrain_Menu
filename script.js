// =============================================================
// 2.04 Juniper & Grain Menu
// Paste your /exec web address from the Setup Guide below.
// Write the rest of the JavaScript yourself.
// =============================================================

const API =
  'https://script.google.com/macros/s/AKfycbwXROpVONbwGyXE_9OggCYznSzMSWdmvajZ4JmQVQFq8ysqLrsloKBpvd4NBo6dZESyzA/exec'

const statusMessage = document.getElementById('status')
const menuContainer = document.getElementById('menu')
const filterContainer = document.getElementById('filters')

let allItems = []

// 1. async function loadMenu()
//    fetch the API, check response.ok, return the JSON.

async function loadMenu () {
  const response = await fetch(API)

  if (!response.ok) {
    throw new Error('HTTP' + response.status)
  }

  const items = await response.json()
  return items
}

// 2. async function startMenu()
//    Show a loading message. In try: load the menu, build the
//    buttons, show every item. In catch: show a friendly error.

async function startMenu () {
  statusMessage.textContent = 'Loading the Menu.....'

  try {
    allItems = await loadMenu()
    buildFilters()
    showMenu('All')
    statusMessage.textContent = ''
  } catch (error) {
    statusMessage.textContent =
      "Sorry, the menu didn't load. Please call us at (732) 555-0187."
    console.log(error)
  }
}

//Get Categories
function getCategories () {
  console.log('getCats')
  let categories = []

  allItems.forEach(function (item) {
    if (!categories.includes(item.category)) {
      categories.push(item.category)
    }
  })
  return categories
}

//build cards
function makeCard (item) {
  console.log('made card runnin')
  let cardClass = 'card'
  let badge = ''
  let soldText = ''
  let tagsHTML = ''

  if (item.poplar) {
    badge = `<span class="badge">Popular</span>`
  }
  if (item.soldOut) {
    cardClass = 'card is-sold'
    soldText = `<p class="sold">Sold out</p>`
  }

  item.tags.forEach(function (tag) {
    tagsHTML += `<li>${tag}</li>`
  })

  return `  
    <article class="${cardClass}">
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name} ${badge}</h3>
        <p>${item.description}</p>
        <ul class="tags">${tagsHTML}</ul>
        <p class="price">$${item.price.toFixed(2)}</p>
        ${soldText}
      </div>
    </article>`
}

// 3. function showMenu(items)
//    One heading per category, then a card for each item:
//    photo, name, description, price, popular badge, tags, sold out.
function showMenu (chosen) {
  let menuHTML = ''

  getCategories().forEach(function (category) {
    if (chosen === 'All' || chosen === category) {
      let cardsHTML = ''

      allItems.forEach(function (item) {
        if (item.category === category) {
          cardsHTML += makeCard(item)
        }
      })
      menuHTML += `<h2>${category}</h2><div class="grid">${cardsHTML}</div>`
    }
  })
  menuContainer.innerHTML = menuHTML
}

// 4. function buildFilters(items)
//    One "All" button, plus one button per category in the data.
//    A click shows only that category's items.
function buildFilters () {
  let buttonsHTML = `<button class="active">All</button>`

  getCategories().forEach(function (category) {
    buttonsHTML += `<button>${category}</button>`
  })

  filterContainer.innerHTML = buttonsHTML
  // Give every button a click listener.
  const buttons = filterContainer.querySelectorAll('button')

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Move the "active" style to the clicked button.
      buttons.forEach(function (otherButton) {
        otherButton.classList.remove('active')
      })
      button.classList.add('active')

      // The button's text is the category name.
      showMenu(button.textContent)
    })
  })
}

// 5. Call startMenu() when the page opens.
startMenu()