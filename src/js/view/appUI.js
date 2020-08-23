// Organize user interface manipulation

// all class and id references
const DOMSelectors = {
  menu: 'menu',
  menuStart: 'start',
  menuLevel: 'level',
  scoreboard: 'scoreboard',
  scoreValue: 'score-value',
  roundValue: 'round-value',
  gameboard: 'gameboard',
  btn0: 'btn-red',
  btn1: 'btn-yellow',
  btn2: 'btn-green',
  btn3: 'btn-blue',
  endPanel: 'end-panel',
  endMsg: 'end-msg',
  restartBtn: 'restart',
  chgLvlBtn: 'change-lvl',
  hidden: 'hidden',
};

// expose DOM elements
export const DOMElements = {
  menu: document.querySelector(`.${DOMSelectors.menu}`),
  start: document.querySelector(`#${DOMSelectors.menuStart}`),
  levels: [...document.querySelectorAll(`.${DOMSelectors.menuLevel}`)],
  scoreboard: document.querySelector(`.${DOMSelectors.scoreboard}`),
  scoreValue: document.querySelector(`#${DOMSelectors.scoreValue}`),
  roundValue: document.querySelector(`#${DOMSelectors.roundValue}`),
  gameboard: document.querySelector(`.${DOMSelectors.gameboard}`),
  boardBtn: [
    document.querySelector(`.${DOMSelectors.btn0}`),
    document.querySelector(`.${DOMSelectors.btn1}`),
    document.querySelector(`.${DOMSelectors.btn2}`),
    document.querySelector(`.${DOMSelectors.btn3}`),
  ],
  endPanel: document.querySelector(`.${DOMSelectors.endPanel}`),
  endMsg: document.querySelector(`#${DOMSelectors.endMsg}`),
  restartBtn: document.querySelector(`#${DOMSelectors.restartBtn}`),
  chgLvlBtn: document.querySelector(`#${DOMSelectors.chgLvlBtn}`),
};

const hideMenuButton = (elem) => {
  elem.style.display = 'none';
};

const showMenuButton = (elem) => {
  elem.style.display = 'flex';
};

const toggleVisible = (elem) => {
  elem.classList.toggle(DOMSelectors.hidden);
};


// expose UI functions
export const toggleGameButtonActive = (index) => {
  DOMElements.boardBtn[index].classList.toggle(
    `${DOMSelectors[`btn${index}`]}-active`
  );
};

export const updateScore = (value) => {
  DOMElements.scoreValue.dataset.score = value;
};

export const updateRound = (value) => {
  DOMElements.roundValue.dataset.round = value;
};

export const showEndPanel = (content) => {
  toggleVisible(DOMElements.gameboard);
  toggleVisible(DOMElements.endPanel);
  DOMElements.endMsg.textContent = content;
};

export const init = () => {
  toggleVisible(DOMElements.scoreboard);
  toggleVisible(DOMElements.gameboard);
  toggleVisible(DOMElements.endPanel);
  for (const level of DOMElements.levels) {
    hideMenuButton(level);
  }
};

export const chooseLevel = () => {
  hideMenuButton(DOMElements.start);
  for (const level of DOMElements.levels) {
    showMenuButton(level);
  }
};

export const startGame = () => {
  toggleVisible(DOMElements.menu);
  toggleVisible(DOMElements.scoreboard);
  toggleVisible(DOMElements.gameboard);
};

export const restartGame = () => {
  toggleVisible(DOMElements.endPanel);
  toggleVisible(DOMElements.gameboard);
};

export const changeLevel = () => {
  toggleVisible(DOMElements.scoreboard);
  toggleVisible(DOMElements.endPanel);
  toggleVisible(DOMElements.menu);
};
