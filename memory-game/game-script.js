const imageArray = document.querySelectorAll('.image')
    const cardArray = document.querySelectorAll('.card')
    const downsideImage = "./Images/backside.jpg"
    let imgIdArray = []
    let points = 0

    function shuffle(array) { // Essa função embaralha um array de forma aletória
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function distribuiCards(imgIdArray) { // Essa função utiliza o array de ID's embaralhados para distribuir os Id's das imagens entre as cartas de forma embaralhada
        imgIdArray.forEach((imgId, index) => {
            cardArray[index].setAttribute('image-id', imageArray[imgId].getAttribute('image-id'))
            cardArray[index].setAttribute('downside', '')
            changeImage(cardArray[index])
        })
    }

    function newGame() {
        imgIdArray = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        imgIdArray = imgIdArray.concat(imgIdArray)
        points = 0
        updateScore(points)
        shuffle(imgIdArray)
        distribuiCards(imgIdArray)
    }

    newGame()

    // Essa primeira parte do código, distribui as cartas de forma aleatória

    function flipCard(card) {
        console.log(card)
        card.toggleAttribute('downside')
        changeImage(card)
    }

    function updateScore(points) {
        document.querySelector('[score]').innerHTML = points
    }

    function wonGame() {
        document.getElementById("popup-1").classList.add("active")
    }

    function invalidPlay() {
        document.getElementById("popup-2").classList.add("active")
    }

    let playGuess = 0
    let previousCardGuess
    let currentPlayStatus = 0

    async function play(vazio, card) {
        if (card.hasAttribute('downside')) { // A jogada só é válida se a carta estiver virada pra baixo
            if (playGuess == 0 && currentPlayStatus == 0) { // A jogada é composta por duas escolhas de carta
                flipCard(card)
                previousCardGuess = card
                playGuess = 1
                currentPlayStatus = 1
            }
            else if (playGuess == 1) {
                flipCard(card)
                let idCard1 = previousCardGuess.getAttribute('image-id')
                let idCard2 = card.getAttribute('image-id')
                playGuess = 0
                if (idCard1 == idCard2) { // caso as cartas escolhidas tenham a mesma imagem (aqui representado pelo id), as cartas seguem viradas pra cima, e a pontuação sobe
                    points += 1
                    updateScore(points)
                    if (points == 9) { // se a pontuação atingir 9 (pontuação máxima), o jogo acaba
                        wonGame()
                    }
                    currentPlayStatus = 0
                }
                else {
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    flipCard(previousCardGuess)
                    flipCard(card)
                    currentPlayStatus = 0
                }
            }
        }
        else {
            invalidPlay()
        }
    }

    cardArray.forEach(card => {
        card.addEventListener("click", play.bind(null, event, card), false)
    })

    function changeImage(card) {
        const id = card.getAttribute('image-id')
        if (card.hasAttribute('downside')) {
            card.firstElementChild.src = downsideImage
        }
        else {
            card.firstElementChild.src = imageArray[id].firstElementChild.src
        }
    }

    function removePopup() {
        document.getElementById("popup-1").classList.remove("active")
    }

    function removePopup1() {
        document.getElementById("popup-2").classList.remove("active")
    }
