import '../css/styles.css';
import GameControl from './control/gameControl';
import * as UI from './view/appUI';

// controls game flow
const uiControl = ((DOM) => {
  const game = new GameControl();

  return {
    init: () => {
      let currLevel;

      // set initial view
      UI.init();

      // add event listeners

      // after clicking 'start', user must choose a level
      ['touchend', 'click'].forEach((event) => {
        DOM.start.addEventListener(event, (e) => {
          e.preventDefault();
          UI.chooseLevel();
        });
      });

      // levels
      for (const level of DOM.levels) {
        ['touchend', 'click'].forEach((event) => {
          level.addEventListener(event, (e) => {
            e.preventDefault();
            currLevel = level.dataset.level;
            UI.startGame();
            game.startNewGame(currLevel);
          });
        });
      }

      // game interaction
      DOM.boardBtn.forEach((btn, index) => {
        ['touchstart', 'mousedown'].forEach((event) => {
          btn.addEventListener(event, (e) => {
            e.preventDefault();
            if (game.gameStarted && game.userTurn) {
              game.userAction('press', index);
            }
          });
        });
        ['touchend', 'mouseup'].forEach((event) => {
          btn.addEventListener(event, (e) => {
            e.preventDefault();
            if (game.gameStarted && game.userTurn) {
              game.userAction('release', index);
            }
          });
        });
      });

      // end panel
      ['touchend', 'click'].forEach((event) => {
        DOM.restartBtn.addEventListener(event, (e) => {
          e.preventDefault();
          UI.restartGame();
          game.startNewGame(currLevel);
        });
        DOM.chgLvlBtn.addEventListener(event, (e) => {
          e.preventDefault();
          UI.changeLevel();
        });
      });
    },
  };
})(UI.DOMElements);

// init game flow
uiControl.init();
