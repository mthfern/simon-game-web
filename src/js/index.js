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
      DOM.start.addEventListener('click', () => {
        UI.chooseLevel();
      });

      // levels
      for (const level of DOM.levels) {
        level.addEventListener('click', () => {
          currLevel = level.dataset.level;
          UI.startGame();
          game.startNewGame(currLevel);
        });
      }

      // game interaction
      DOM.boardBtn.forEach((btn, index) => {
        btn.addEventListener('mousedown', () => {
          if (game.gameStarted && game.userTurn) {
            game.userAction('press', index);
          }
        });
        btn.addEventListener('mouseup', () => {
          if (game.gameStarted && game.userTurn) {
            game.userAction('release', index);
          }
        });
      });

      // end panel
      DOM.restartBtn.addEventListener('click', (e) => {
        UI.restartGame();
        game.startNewGame(currLevel);
      });
      DOM.chgLvlBtn.addEventListener('click', (e) => {
        UI.changeLevel();
      });
    },
  };
})(UI.DOMElements);

// init game flow
uiControl.init();
