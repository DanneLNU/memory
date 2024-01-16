const cardsContainer = document.querySelector('.cards')
const imageFolder = './images/'
const imageFileNames = ['akali.jpg', 'amumu.jpg', 'bard.jpg', 'briar.jpg', 'caitlyn.jpg', 'katarina.jpg', 'malhazar.jpg', 'mundo.jpg', 'nautilus.jpg', 'rakan.jpg', 'renekton.jpg', 'samira.jpg', 'taric.jpg', 'teemo.jpg', 'urgot.jpg', 'warwick.jpg', 'ziggs.jpg', 'annie.jpg', 'brand.jpg', 'braum.jpg', 'khazix.jpg', 'lee.jpg', 'orn.jpg', 'shaco.jpg', 'draven.jpg', 'ekko.jpg', 'jinx.jpg', 'rammus.jpg', 'soraka.jpg', 'veigar.jpg', 'vex.jpg', 'zyra.jpg']
let imagesPicklist = [...imageFileNames, ...imageFileNames] // Duplicate the array because we need pairs of images aka spreadoperator
let cardCount = imagesPicklist.length

// Game state
let revealedCount = 0
let activeCard = null
let awaitingEndOfMove = false
let turnCount = 0

/** Build a memory card element with click event listener.
 *
 * @param {string} image - The image filename associated with the card.
 * @returns {HTMLElement} - The generated card element.
 * @param {number} index - The index of the card in the grid.
 */
function buildCard (image, index) {
  const element = document.createElement('div')

  element.classList.add('card')
  element.setAttribute('data-image', image)
  element.setAttribute('data-revealed', 'false')
  element.tabIndex = index // Add this line

  element.addEventListener('click', cardClickHandler)
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      cardClickHandler.call(element)
    }
  })

  return element
}

/**
 * Handle click events on memory cards.
 *
 */
function cardClickHandler () {
  const revealed = this.getAttribute('data-revealed')

  if (revealed === 'true' || awaitingEndOfMove) {
    return
  }

  if (awaitingEndOfMove) {
    return
  }

  // Increment turnCount each time a card is clicked, even if it's the same card
  turnCount += 1

  this.style.background = 'none'
  this.style.backgroundImage = `url(${imageFolder}${this.getAttribute('data-image')})`

  if (!activeCard) {
    activeCard = this
    return
  }

  const imageToMatch = activeCard.getAttribute('data-image')

  if (imageToMatch === this.getAttribute('data-image')) {
    this.setAttribute('data-revealed', 'true')
    activeCard.setAttribute('data-revealed', 'true')

    activeCard = null
    awaitingEndOfMove = false
    revealedCount += 2

    if (revealedCount === cardCount) {
      // Divide turnCount by 2 when displaying the number of tries
      alert(`Grattis!! Du vann!! Det tog dig ${Math.floor(turnCount / 2)} försök`)
    }
  } else {
    awaitingEndOfMove = true

    setTimeout(() => {
      activeCard.style.background = null
      this.style.background = null
      activeCard = null
      awaitingEndOfMove = false
    }, 1000)
  }
}

/**
 * Build the game board with a memory cards of specified size.
 *
 * @param {number} size - The size of the game board
 */
function buildGameBoard (size) {
  const n = size
  cardCount = n * n

  // Reset game state
  revealedCount = 0
  activeCard = null
  awaitingEndOfMove = false
  turnCount = 0

  // Reset imagesPicklist
  imagesPicklist = [...imageFileNames, ...imageFileNames]

  // Ensure we have enough pairs for the board
  while (imagesPicklist.length < cardCount / 2) {
    imagesPicklist = [...imageFileNames, ...imageFileNames]
  }

  cardsContainer.innerHTML = ''
  imagesPicklist = imagesPicklist.slice(0, cardCount / 2) // Trim to needed pairs
  imagesPicklist = [...imagesPicklist, ...imagesPicklist] // Duplicate for pairs
  revealedCount = 0

  for (let i = 0; i < cardCount; i++) {
    const randomIndex = Math.floor(Math.random() * imagesPicklist.length)
    const image = imagesPicklist[randomIndex]
    const card = buildCard(image, i)

    imagesPicklist.splice(randomIndex, 1)
    cardsContainer.appendChild(card)
  }

  cardsContainer.style.gridTemplateColumns = `repeat(${n}, 100px)`
}

const size2x2Button = document.getElementById('size2x2Button')
const size4x4Button = document.getElementById('size4x4Button')
const size6x6Button = document.getElementById('size6x6Button')
const size8x8Button = document.getElementById('size8x8Button')

size2x2Button.addEventListener('click', () => buildGameBoard(2))
size4x4Button.addEventListener('click', () => buildGameBoard(4))
size6x6Button.addEventListener('click', () => buildGameBoard(6))
size8x8Button.addEventListener('click', () => buildGameBoard(8))

// Initial game setup
buildGameBoard(4)

/**
 * Keyboard navigation
 *
 * @param {KeyboardEvent} event The event object
 */

document.addEventListener('keydown', (event) => {
  const currentElement = document.activeElement

  if (currentElement.classList.contains('card')) {
    let newElement
    const currentElementIndex = Array.from(cardsContainer.children).indexOf(currentElement)
    const rowLength = Math.sqrt(cardCount)

    switch (event.key) {
      case 'ArrowUp':
        if (currentElementIndex >= rowLength) {
          newElement = cardsContainer.children[currentElementIndex - rowLength]
        }
        break
      case 'ArrowDown':
        if (currentElementIndex < cardCount - rowLength) {
          newElement = cardsContainer.children[currentElementIndex + rowLength]
        }
        break
      case 'ArrowLeft':
        if (currentElementIndex % rowLength !== 0) {
          newElement = cardsContainer.children[currentElementIndex - 1]
        }
        break
      case 'ArrowRight':
        if (currentElementIndex % rowLength !== rowLength - 1) {
          newElement = cardsContainer.children[currentElementIndex + 1]
        }
        break
    }

    if (newElement) {
      newElement.focus()
    }
  }
})
