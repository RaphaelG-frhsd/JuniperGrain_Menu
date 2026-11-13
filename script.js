
// =============================================================
// 2.04 Juniper & Grain Menu
// =============================================================

const API =
  'https://script.google.com/macros/s/AKfycbxrAg7RdBV31bbTMIGssNOl_zHck3U9T96HeSP5W0vTnHoHI0Zbnn8kDs1oXrOFxj2-/exec'

const statusMessage = document.getElementById('status')
const menuContainer = document.getElementById('menu')
const filterContainer = document.getElementById('filters')

let allItems = []

// 1. Load menu from API
async function loadMenu () {
  const response = await fetch(API)

  if (!response.ok) {
    throw new Error('HTTP ' + response.status)
  }

  const items = await response.json()
  return items
}

// 2. Start the menu
async function startMenu () {
  statusMessage.textContent = 'Loading the menu...'

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

// Get Categories
function getCategories () {
  let categories = []

  allItems.forEach(function (item) {
    if (!categories.includes(item.category)) {
      categories.push(item.category)
    }
  })

  return categories
}

// Build Cards
function makeCard (item) {
  let cardClass = 'card'
  let badge = ''
  let soldText = ''
  let tagsHTML = ''

  if (item.popular) {
    badge = `<span class="badge">Popular</span>`
  }

  if (item.soldOut) {
    cardClass = 'card is-sold'
    soldText = `<p class="sold">Sold out</p>`
  }

  if (item.tags) {
    item.tags.forEach(function (tag) {
      tagsHTML += `<li>${tag}</li>`
    })
  }

  return `
    <article class="${cardClass}">
      <img src="${item.image}" alt="${item.name}">

      <div class="card-body">
        <h3>${item.name} ${badge}</h3>

        <p>${item.description}</p>

        <ul class="tags">
          ${tagsHTML}
        </ul>

        <p class="price">$${Number(item.price).toFixed(2)}</p>

        ${soldText}
      </div>
    </article>
  `
}

// 3. Show Menu
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

      menuHTML += `
        <h2>${category}</h2>
        <div class="grid">
          ${cardsHTML}
        </div>
      `
    }
  })

  menuContainer.innerHTML = menuHTML
}

// 4. Build Filters
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

      // Move the active style to the clicked button.
      buttons.forEach(function (otherButton) {
        otherButton.classList.remove('active')
      })

      button.classList.add('active')

      // Show the selected category.
      showMenu(button.textContent)
    })
  })
}

// 5. Call startMenu() when the page opens.
startMenu()
