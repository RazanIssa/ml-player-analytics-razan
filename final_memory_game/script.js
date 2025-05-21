let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

let moves = 0;
let startTime;
let timerStarted = false;

function startGame() {
  const nameInput = document.getElementById("player-name");
  const playerName = nameInput.value.trim();

  if (playerName === "") {
    alert("يرجى إدخال اسمك أولاً!");
    return;
  }

  localStorage.setItem("playerName", playerName);
  document.querySelector(".player-input").style.display = "none";
  document.querySelector(".wrapper").style.display = "block";

  shuffleCard();
}

function flipCard({ target: clickedCard }) {
  if (
    cardOne !== clickedCard &&
    !disableDeck &&
    !clickedCard.classList.contains("flip")
  ) {
    if (!timerStarted) {
      startTime = new Date();
      timerStarted = true;
    }

    clickedCard.classList.add("flip");

    if (!cardOne) {
      cardOne = clickedCard;
      return;
    }

    cardTwo = clickedCard;
    disableDeck = true;
    moves++;

    const img1 = cardOne.querySelector(".back-view img").src;
    const img2 = cardTwo.querySelector(".back-view img").src;

    matchCards(img1, img2);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matched++;
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    resetCards();

    if (matched === 8) {
      setTimeout(() => {
        const endTime = new Date();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        const playerName = localStorage.getItem("playerName") || "لاعب";

        alert(`أحسنت يا ${playerName}! أنهيت اللعبة بـ ${moves} حركة خلال ${timeTaken} ثانية.`);

        const playerData = {
          playerId: playerName,
          moves: moves,
          timeTaken: timeTaken,
          success: 1,
          sessionTime: new Date().toISOString(),
        };

        let storedData = JSON.parse(localStorage.getItem("playerStats")) || [];
        storedData.push(playerData);
        localStorage.setItem("playerStats", JSON.stringify(storedData));

        shuffleCard();
      }, 1000);
    }

    return;
  }

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    resetCards();
  }, 1200);
}

function resetCards() {
  [cardOne, cardTwo] = [null, null];
  disableDeck = false;
}

function shuffleCard() {
  matched = 0;
  moves = 0;
  timerStarted = false;
  resetCards();

  const arr = [...Array(8).keys(), ...Array(8).keys()];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);

  const cards = document.querySelectorAll(".card");

  cards.forEach((card, i) => {
    card.classList.remove("flip");
    const imgTag = card.querySelector(".back-view img");
    imgTag.src = `images/img-${arr[i] + 1}.png`;

    card.removeEventListener("click", flipCard);
    card.addEventListener("click", flipCard);
  });
}
