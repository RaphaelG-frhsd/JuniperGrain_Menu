// =============================================================
// 2.04 Juniper & Grain Menu
// Paste your /exec web address from the Setup Guide below.
// Write the rest of the JavaScript yourself.
// =============================================================

const API = "https://script.googleusercontent.com/a/macros/frhsd.com/echo?user_content_key=AUkAhnSjCrE0DDIWBNLcF016I9mf0opjlwWKYwR4zOpTi2GhepZB2AnyaEMhKQpf4LF_91XI1F_sxG5ZkSJZo6VoCtKoo94DqYOrYrMVTsxtW-eLxgPSo5t6fYQJNfW69Uyl0LMgZa5kvnhFudIERRO_zn21d4jy6E2-iqrRymrnKSsxsPJlHykZqBhBYWMiy_DjKxPob4XmWwsNFGOJZ0AB2I9qUp74dmIkDiPgrUM-HNitiznziR5fBe9t7RggjLWeDSbk6DjhBRZqvgAmYLMJyf8GcYGRSlOXHMuEPME6&lib=MsuaOXjjx8ppCWd-VOYT7MmS1Rtfp0tvW";

const statusMessage = document.getElementById("status")
const menuContainer = document.getElementById("menu")
const filterContainer = document.getElementById("filters")

let AllItems = []

// 1. async function loadMenu()
//    fetch the API, check response.ok, re
// g    turn the JSON.
async function loadMenu() {
    const response = await fetch(API);

    if (!response.ok) {
        throw new Error("yoooo something went wrong with the fetch fam i think its " + response.status);
    }

    const items = await response.json();
    return items}


// 2. async function startMenu()
//    Show a loading message. In try: load the menu, build the
//    buttons, show every item. In catch: show a friendly error.



async function startMenu() {
statusMessage.textContent = "Loading menu...";
 try {
   allItems = await loadMenu();
   buildFilters();
   //showMenu()
    statusMessage.textContent = ""
 }

 catch(error) {
    statusMessage.textContent = "Mb fam, we working on it rn, yes exactly when you saw this we started working on it.";
    
    }
}

function getCategories(){
    let categories = []

    allItems.forEach(function(item){
        if(!categories.includes(item.category)){
            categories.push(item.category)
        }
    })
    return categories;

}


function makeCard(item){
    let cardClass = 'card'
    let badge = ''
    let soldText = ''
    let tagsHTML = ''

if(item.popular){
    badge = `<span class="badge">Popular</span>`
}

if(item.soldOut){
    cardClass += ' sold-out'
    soldText = `<p class="sold-out-text">Sold Out</p>`
}

item.tags.forEach(function(tag){
    tagsHTML += `<li>${tag}</li>`
})


return`
<article class="${cardClass}">
    <img src="${item.photo}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p class="price">$${item.price.toFixed(2)}</p>
    ${badge}
    ${soldText} 
    <ul class="tags">
        ${tagsHTML}
    </ul>
</article>`
}


function showMenu(chosen){
    let menuHTML = ''
    getCategories().forEach(function(category){
        if(chosen === 'All' || chosen === category){
            let cardsHTML = ''

            allItems.forEach(function(item){
                if(item.category === category){
                    cardsHTML += makeCard(item)
                }
            })

        menuHTML += `<h2>${category}</h2><div class="cards">${cardsHTML}</div>`
        }
    })
    menuContainer.innerHTML = menuHTML
}



function buildFilters(){
    let buttonHTML = `<button class="active">All</button>`

    getCategories().forEach(function(category){
        buttonHTML += `<button>${category}</button>`
    })
    filterContainer.innerHTML = buttonHTML
}




// 3. function showMenu(items)
//    One heading per category, then a card for each item:
//    photo, name, description, price, popular badge, tags, sold out.

// 4. function buildFilters(items)
//    One "All" button, plus one button per category in the data.
//    A click shows only that category's items.

// 5. Call startMenu() when the page opens.
startMenu()
