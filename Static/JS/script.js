
//blackjack 

let blackjackgame = 
{
    'you':  
    {
        'scorespan': '#your-blackjack-result',
        'div': '#your-box',
        'score': 0
    },
    'dealer': 
    {
        'scorespan': '#dealer-blackjack-result',
        'div': '#dealer-box',
        'score': 0
    },
    'cards':
    [
        '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'K', 'Q', 'A' 
    ],
    'cardsMap':
    {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'K': 10,
        'Q': 10,
        'J': 10,
        'A': [1,11]
    },
    'wins': 0,
    'losses': 0,
    'draws' : 0,
    'isStand': false,
    'turnsOver': false
};

const YOU = blackjackgame['you'];

const DEALER = blackjackgame['dealer'];

const hitSound = new Audio('Static/sounds/swish.m4a');

const winSound = new Audio('Static/sounds/cash.mp3');

const lossSound = new Audio('Static/sounds/aww.mp3');

document.querySelector('#hit-btn').addEventListener('click', blackjackhit);

document.querySelector('#deal-btn').addEventListener('click',blackjackDeal);

document.querySelector('#stand-btn').addEventListener('click',dealerLogic);

function blackjackhit()
{
    if( blackjackgame['isStand'] === false)
    {
        let card = randomCard();
        //console.log(card);
        showCard(card, YOU);
        //showCard(DEALER);
        updateScore(card, YOU);
        //console.log(YOU['score']);
        showScore(YOU);
    }
    
}

function randomCard()
{
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackgame['cards'][randomIndex];
}

function showCard(card, activePlayer)
{
    if (activePlayer['score']<=21)
    {
        let cardImage = document.createElement('img');
        cardImage.src = `Static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal()
{
    if(blackjackgame['turnsOver'] === true)
    {
        blackjackgame['isStand'] = false;
        //showResult(computeWinner());
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for(let i = 0; i < yourImages.length; i++)
            yourImages[i].remove();

        for(let i = 0; i < dealerImages.length; i++)
            dealerImages[i].remove();


        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        document.querySelector('#Blackjack-result').textContent = "Let's play";
        document.querySelector('#Blackjack-result').style.color = 'black';

        blackjackgame['turnsOver'] = false;
    }
    
}

function updateScore(card, activePlayer)
{
    // For ACE, If adding 11 keeps me below 21, otherwise add 1

    if(card == 'A')
    {
    
        if ((activePlayer['score'] + blackjackgame['cardsMap'][card][1] ) <= 21)
            activePlayer['score'] += blackjackgame['cardsMap'][card][1];
        else
            activePlayer['score'] += blackjackgame['cardsMap'][card][0];

    }
    else
    {
        activePlayer['score'] += blackjackgame['cardsMap'][card];
    }


}

function showScore(activePlayer)
{
    if (activePlayer['score'] > 21)
    {
        document.querySelector(activePlayer['scorespan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    }
    else
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic()
{
    blackjackgame['isStand'] = true;

    while(DEALER['score'] < 16 && blackjackgame['isStand'] === true)
    {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackgame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    //console.log(blackjackgame['turnsOver']);

}

// compute winner

function computeWinner()
{
    let winner;

    if (YOU['score'] <= 21)
    {
        if((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21))
        {
            //console.log("You won");
            //blackjackgame['wins'] += 1;
            winner = YOU;
        }
        else
            if(YOU['score'] < DEALER['score'])
            {
                //console.log("You lost");
                winner = DEALER;
                //blackjackgame['losses'] += 1;
            }
            else
                if(YOU['score'] === DEALER['score'])
                {
                    //console.log("You drew");
                    //blackjackgame['draws'] += 1;
                }

    }
    else
        if((YOU['score'] > 21) && (DEALER['score'] <= 21))
        {
            console.log("You lost");
            winner = DEALER;
        }
        else
        if ((YOU['score'] > 21) && (DEALER['score'] > 21))
        {
            console.log("You drew");
        }

    if (winner === YOU)
    {
        blackjackgame['wins'] += 1;
        document.querySelector('#wins').textContent = blackjackgame['wins'];
    }
    else
        if(winner === DEALER)
        {
            blackjackgame['losses'] += 1;
            document.querySelector('#losses').textContent = blackjackgame['losses'];
        }

        else
        {
            blackjackgame['draws'] += 1;
            document.querySelector('#draws').textContent = blackjackgame['draws'];
        }
    //console.log("Winner is ", winner);

        console.log(blackjackgame);

    return winner;
}

function showResult(winner)
{
    let message, messageColor;

    if(winner === YOU)
    {
        message = 'You won!';
        messageColor = 'green';
        winSound.play();
    }
    else
        if(winner === DEALER)
        {
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();
        }
        else
        {
            message = 'You drew!';
            messageColor = 'black';
        }

    document.querySelector('#Blackjack-result').textContent = message;
    document.querySelector('#Blackjack-result').style.color = messageColor;

}

//7:41:14