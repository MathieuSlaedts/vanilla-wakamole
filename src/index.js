let level = 1;
let speed = 2000;
let playerLives = 5;
let moles = [
  { name: 0, alive: true },
  { name: 1, alive: true },
  { name: 2, alive: true },
  { name: 3, alive: true },
  { name: 4, alive: true },
  { name: 5, alive: true }
];
let molesLives = moles.length;

/*
 * Get a random Number between min (included) and max (included)
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Get living Moles
 * - return a new array of Living Moles
 */
const getLivingMoles = (moles) => moles.filter((el) => el.alive === true);

/*
 * get a random number of Randow Living Moles
 * - declare a new empty array of Random Moles
 * - Create a new array of Living Moles
 * - Get a random number between 1 and the number of Living Moles
 * - For each of this random number:
 * - Get a randow item from the array of Living Moles
 * - Push this item in the array of Random Moles
 * - Remove the item from the array of Living Moles so the item is not randomly selected a second time
 */
const getRandomMoles = () => {
  let randomMoles = [];
  let livingMoles = getLivingMoles(moles);
  const randomNum = getRandomInt(1, livingMoles.length);
  for (let i = 0; i < randomNum; i++) {
    const randomMole = getRandomInt(0, livingMoles.length);
    randomMoles.push(livingMoles[randomMole]);
    livingMoles = livingMoles.filter((el, index) => index !== randomMole);
  }
  return randomMoles;
};

/*
 * get a random number of Positions (holes)
 * - declare a new empty array of Random Positions
 * - Create a new array of available Holes
 * - Get a random number between 1 and the number of available Holes
 * - For each of this random number:
 * - Get a randow item from the array of available Holes
 * - Push this item in the array of Random Positions
 * - Remove the item from the array of available Holes so the item is not randomly selected a second time
 */
const getRandomPositions = (molesCount) => {
  let positions = [];
  let holesAvailable = [0, 1, 2, 3, 4, 5];
  for (let i = 0; i < molesCount; i++) {
    const position = getRandomInt(0, holesAvailable.length);
    positions.push(holesAvailable[position]);
    holesAvailable = holesAvailable.filter((el, index) => index !== position);
  }
  return positions;
};

/**
 * insert Moles in Holes
 * - Get Random Moles
 * - Get Random positions
 * - For each Position:
 * - Duplicate HTML Mole
 * - Add .in class to HTML Mole Duplicata (for css animation)
 * - Append HTML Mole Duplicata in HTML Hole
 */
const insertMolesInHoles = () => {
  const randomMoles = getRandomMoles();
  const randomPositions = getRandomPositions(randomMoles.length);
  randomPositions.forEach((el, index) => {
    const holeHtml = document.querySelector(".hole-" + el);
    const moleHtml = document.querySelector(".mole-" + randomMoles[index].name);
    const moleHtmlDuplicated = moleHtml.cloneNode(true);
    moleHtmlDuplicated.classList.add("in");
    holeHtml.append(moleHtmlDuplicated);
  });
};

/**
 * Remove Moles in Holes
 * - Add .out class to HTML Moles in HTML Holes (for css animation)
 * - Remove HTML Moles in HTML Holes
 */
const removeMolesFromHoles = () => {
  const molesInHoles = document.querySelectorAll(".hole .mole");
  molesInHoles.forEach((el) => {
    el.classList.add("out");
    setTimeout(function () {
      el.remove();
    }, 200);
  });
};

/*
 * Interval for the Moles
 * - Removes Moles from Holes
 * - Insert Moles in Holes
 */
let myInterval;
const SetMyInterval = (speed) => {
  myInterval = setInterval(function () {
    removeMolesFromHoles();
    setTimeout(function () {
      insertMolesInHoles();
    }, 300);
  }, speed);
};
SetMyInterval(speed);

/*
 * handle the click event
 */
const boardHtml = document.querySelector("#board");
boardHtml.addEventListener("click", (ev) => clickHandler(ev));

const clickHandler = (ev) => {
  if (ev.target.classList.contains("in")) {
    const moleIndex = ev.target.dataset.mole;
    killAMole(moleIndex);
    updateMolesLivesHtml(getLivingMoles(moles).length);
    winCheck(getLivingMoles(moles));
  } else {
    console.log("no");
    playerLives--;
    updatePlayerLivesHtml(playerLives);
    looseCheck(playerLives);
  }
};

/*
 * Kill a mole
 * - update the alive property of the Mole
 */
const killAMole = (moleIndex) => {
  moles[moleIndex].alive = false;
};

/*
 * Update Player lifes in the HTML
 */
const updatePlayerLivesHtml = (playerLives) => {
  const playerLivesHtml = document.querySelector("#player-lives");
  playerLivesHtml.innerHTML = playerLives;
};

/*
 * Update Moles lifes in the HTML
 */
const updateMolesLivesHtml = (molesLives) => {
  const molesLivesHtml = document.querySelector("#moles-lives");
  molesLivesHtml.innerHTML = molesLives;
};

/*
 * Update Level in the HTML
 */
const updateLevelHtml = (level) => {
  const levelHtml = document.querySelector("#level");
  levelHtml.innerHTML = level;
};

/*
 * Check if Moles have any lives left
 */
const winCheck = (molesLives) => {
  if (molesLives <= 0) {
    alert("You killed everything. Hoora. Now here is the next level.");
    nextLevel();
  }
};

/*
 * Check if Player has any lives left
 */
const looseCheck = (playerLives) => {
  if (playerLives <= 0) {
    alert("You missed too many times loser.");
    document.location.reload(true);
  }
};

const resurrectAllMoles = (moles) => {
  moles.forEach((el) => {
    el.alive = true;
  });
};

const nextLevel = () => {
  resurrectAllMoles(moles);
  speed -= 200;
  console.log(speed);
  clearInterval(myInterval);
  SetMyInterval(speed);
  level++;
  updateLevelHtml(level);
};
