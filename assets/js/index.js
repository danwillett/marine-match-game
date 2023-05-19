// On page load show modal to start game
const startModal = document.getElementById('startModal');
startModal.classList.add('show');
startModal.style.display = 'block';
document.body.classList.add('modal-open');

// when user clicks start button, the timer starts and modal disappears

const startBtn = document.getElementById('startBtn')
const stopwatchElement = document.getElementById('stopwatch');
const stopwatch = new easytimer.Timer();

// audio controls
const flipSound = document.getElementById('flip')
const rightSound = document.getElementById('right')
const wrongSound = document.getElementById('wrong')

const introModal = () => {
    document.body.classList.remove('modal-open');
    startModal.classList.remove('show');
    startModal.style.display = 'none';
    // start stopwatch
    
    stopwatch.addEventListener('secondsUpdated', function (e) {
        stopwatchElement.textContent = stopwatch.getTimeValues().toString();
      });

    stopwatch.start()
    startGame()
}

startBtn.addEventListener('click', introModal)


const startGame = () => {
    let matchCount = 0;
    // 
    const grid = $('#grid')
    const cardBack = "./assets/images/cards/cardback.png"
    let cardCheck = {
        png: [],
        id: [],
    };
    // load cards and assign a random card
    
    // function to generate heart png deck
    const genHearts = () => {
        let hearts = [];
        for (let i = 1; i < 14; i++) {
            hearts.push(`H${i}.png`);
        }
        return hearts
    }
    
    // generates heart png pool
    const hearts = genHearts();
    let heartPool = hearts.concat(hearts);
    
    const randomCard = (cardPool) => {
        let i = Math.floor(cardPool.length * Math.random());
        let png = cardPool[i]
        console.log(png)
        console.log(cardPool)
    
        return [png, i]
    }
    
    for (let i = 1; i < 27; i++){
    
        let id = i;
        let newCard = $('<img>')
        $(newCard).attr('class', 'card')
        $(newCard).attr('src', cardBack)
    
        let [png, pngId] = randomCard(heartPool)
        heartPool.splice(pngId, 1)
        // console.log("png" + png)
        
    
        // create new flip card set up 
        let flipCardEl = $('<div>');
        $(flipCardEl).attr('id', `card_${id}`)
        flipCardEl.attr('class', 'flip-card');
        let innerCardEl = $('<div>');
        innerCardEl.attr('class', 'flip-card-inner');
        let frontCardEl = $('<div>');
        frontCardEl.attr('class', 'flip-card-front');
        let cardbackEl = $('<img src="./assets/images/cards/cardback.png" alt="back" style="width:75px;height:105px;">')
        $(frontCardEl).append(cardbackEl);
        innerCardEl.append(frontCardEl);
    
        let backCardEl = $('<div>');
        backCardEl.attr('class', 'flip-card-back');
        let cardFrontEl = $(`<img src= "./assets/images/cards/${png}" alt="face" style="width:75px;height:105px;">`)
        $(backCardEl).append(cardFrontEl);
        innerCardEl.append(backCardEl);
        
        flipCardEl.append(innerCardEl);
        $(flipCardEl).data('card', png)
    
        $(grid).append(flipCardEl)
    
    }
    
    const flipCards = document.querySelectorAll('.flip-card');
    console.log(flipCards)

    let isHandlingFlip = false;

    const flipCard = async (event) => {
        if (isHandlingFlip) {
            return;
        }
        isHandlingFlip = true;

        let matchClass = $(event.target).parent().parent().parent().attr('class')
        if (matchClass === "match") {
            return isHandlingFlip = false
        }
        let flipTarget = $(event.target).parent().parent().parent().attr("id");
        console.log($(event.target).parent().parent())
        console.log(flipTarget)

        let transform = $(`#${flipTarget} .flip-card-inner`).css('transform');
        flipSound.play()
        
        // transform will start as none if the cardback is showing
        if (transform === 'none') {
            console.log(isHandlingFlip)
            console.log("backside")
            let png = $(event.target).parent().parent().parent().data("card")
            console.log(png)
            cardCheck.png.push(png);
            cardCheck.id.push(flipTarget)
            $(`#${flipTarget} .flip-card-inner`).css('transform','rotateY(180deg)')
            
            if (cardCheck.png.length == 2) {
                const waitCheck = () => {
                    return new Promise((resolveOuter) => {
                        resolveOuter(
                            new Promise((resolveInner) => {
                                return setTimeout(async() => {
                                    console.log("delay 1 sec")
                                    await checkAnswer(cardCheck)  
                                    resolveInner()                 
                                }, 1000)
                            }),
                            
                        );
                    })
                }
                await waitCheck()
                console.log(isHandlingFlip)
            }
            console.log(cardCheck)
            return isHandlingFlip =false
        } else {
            console.log("faceup")
            $(`#${flipTarget} .flip-card-inner`).css('transform','')
            let removeId = cardCheck.id.indexOf(flipTarget)
            cardCheck.png.splice(removeId, 1);
            cardCheck.id.splice(removeId, 1);
            console.log(cardCheck)
        } 
        console.log("hi")
        isHandlingFlip = false
    
    }
    

    // flipCards.forEach((element) => {
    //     element.addEventListener('click', flipCard)
    // })
    $('#grid').click(flipCard)
    
    const checkAnswer = (check) => {
        // check if match is correct
        if (check.png[0] === check.png[1]) {
            matchCount++
            console.log("correct answer!")
    
            let card1 = document.getElementById(check.id[0])
            card1.removeEventListener('click', flipCard)
            card1.setAttribute('class', 'match')
            let card2 = document.getElementById(check.id[1])
            card2.removeEventListener('click', flipCard)
            card2.setAttribute('class', 'match')
            rightSound.play()
            
    
        } else {
            
            // flip and play wrong sound
            $(`#${check.id[0]}`).children().css('transform','')
            $(`#${check.id[1]}`).children().css('transform','')
            wrongSound.play()
            
        }

        // if all matches are complete, end the game
        if (matchCount === 13) {
            stopwatch.stop()
            endGame()
        }
        
        cardCheck = {
            png: [],
            id: []
        };

        return new Promise((resolve) => {
            resolve(cardCheck)
        })
    }

}

const endModal = document.getElementById('endModal')


const endGame = () => {
    endModal.classList.add('show');
    endModal.style.display = 'block';
    document.body.classList.add('modal-open');

    const timeEl = document.getElementById('finishTime')
    timeEl.textContent = stopwatchElement.textContent
    
    const restartBtn = document.getElementById('playAgainBtn')
    restartBtn.addEventListener("click", () => {
        location.reload()
    })
}

const pauseModal = document.getElementById("pauseModal")

const pauseGame = () => {
    stopwatch.pause();

    pauseModal.classList.add('show');
    pauseModal.style.display = 'block';
    document.body.classList.add('modal-open');

    const continueBtn = document.getElementById('continueBtn')
    continueBtn.addEventListener("click", () => {
        document.body.classList.remove('modal-open');
        pauseModal.classList.remove('show');
        pauseModal.style.display = 'none';
        stopwatch.start();
    })

    const restartBtn = document.getElementById('restartBtn')
    restartBtn.addEventListener("click", () => {
        location.reload()
    })

}

const pauseBtn = document.getElementById("pauseBtn")
pauseBtn.addEventListener("click", pauseGame)



