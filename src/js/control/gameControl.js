import Audio from '../model/audio';
import * as UI from '../view/appUI';

// Controls game state and behaviour
export default class GameControl {
  constructor() {
    this.gameStarted = false;
    this.currentFrequency = null;

    // the audio component
    this.audioComp = new Audio();

    // game interaction buttons
    this.gameButtons = [
      { frequency: this.audioComp.getNoteFrequency(3, 'G') },
      { frequency: this.audioComp.getNoteFrequency(4, 'C') },
      { frequency: this.audioComp.getNoteFrequency(4, 'D') },
      { frequency: this.audioComp.getNoteFrequency(4, 'E') },
    ];

    // difficulty will be set by user
    this.difficulty = new Map([
      [0, 8],
      [1, 13],
      [2, 21],
      [3, 34],
    ]);

    // decrease time every 'n' rounds
    this.decreaseTimeAt = 5;
    this.decreaseFactor = 0.85;

    // end panel messages
    this.messages = new Map([
      [0, 'Game Over!'],
      [1, 'Congratulations!'],
    ]);
  }

  startNewGame(level) {
    this.gameStarted = true;
    this.userTurn = false;
    this.score = 0;
    this.round = 1;

    // store user round input sequence
    this.roundInputs = [];

    // nbr of rounds defined by user's level choice
    this.lastRound = this.difficulty.get(Number(level));

    this.timePressets = this.loadTimePressets();

    // initialize UI scoreboard
    UI.updateScore(this.score);
    UI.updateRound(this.round);

    // create random sound sequence
    this.gameSequence = Array.from({ length: this.lastRound }, () =>
      Math.floor(Math.random() * 4)
    );

    // automatically play sequence and begins the game
    this.playGameSequence();
  }

  loadTimePressets(){
    return {
      sequenceBefore: 0.5,
      sequenceBetween: 0.1,
      padDuration: 0.5,
      gameOverBefore: 0.1,
      gameOverBetween: 0.13,
      nextRoundBefore: 0.5,
    }
  }

  async playGameSequence() {
    // play sequence until it reaches current round
    let i = 0;
    await this.timer(this.timePressets.sequenceBefore);

    for (const padId of this.gameSequence) {
      if (++i > this.round) {
        break;
      }

      // play
      await this.playAwaitStop(
        padId,
        'triangle',
        this.getButtonFrequency(padId),
        this.timePressets.padDuration
      );

      await this.timer(this.timePressets.sequenceBetween);
    }

    // shift turn
    this.userTurn = true;
  }

  async playAwaitStop(btnId, aspect, frequency, time) {
    this.play(btnId, aspect, frequency);
    await this.timer(time);
    this.stop(btnId);
  }

  // receives user input
  userAction(action, btnId) {
    if (action == 'press') {
      this.play(btnId, 'triangle', this.getButtonFrequency(btnId));
    } else {
      this.stop(btnId);
      this.roundInputs.push(btnId);

      // check if it's the correct input acordig to game sequence
      if (btnId !== this.gameSequence[this.roundInputs.length - 1]) {
        // wrong input, end game
        this.userTurn = false;
        this.gameOver();
      } else {
        // correct input, update score
        UI.updateScore(++this.score);

        // check if end of round
        if (this.roundInputs.length === this.round) {
          // shift turn
          this.userTurn = false;

          // check if last round
          if (this.round === this.lastRound) {
            // winner, show result
            this.showResult(1);
          } else {
            // continue to next round
            this.nextRound();
          }
        }
      }
    }
  }

  async gameOver() {
    // an iterator to help playing the game over sequence
    const padIterator = (function* (v) {
      while (true) {
        if (v > 3) {
          v = 0;
        }
        yield v++;
      }
    })(0);

    await this.timer(this.timePressets.gameOverBefore);

    // play gameover sequence
    for (let n of Array.from({ length: 4 })) {
      await this.playAwaitStop(
        padIterator.next().value,
        'triangle',
        this.audioComp.getNoteFrequency(4, 'D#'),
        this.timePressets.gameOverBetween
      );
    }

    // show result
    this.showResult(0);
  }

  showResult(type) {
    this.gameStarted = false;
    UI.showEndPanel(this.messages.get(type));
  }

  async nextRound() {
    // prepare state for next round

    this.roundInputs = [];

    // check if it's time to increse speed
    if (this.round % this.decreaseTimeAt == 0) {
      this.timePressets.padDuration *= this.decreaseFactor;
      this.timePressets.sequenceBetween *= this.decreaseFactor;
    }

    // update UI
    UI.updateRound(++this.round);

    // play game sequence
    await this.timer(this.timePressets.nextRoundBefore);
    this.playGameSequence();
  }

  play(btnId, aspect, frequency) {
    // uses audio component to produce a sound from a frequency, also "activate" (highlight) a game button
    if (!this.currentFrequency) {
      this.currentFrequency = this.audioComp.createSound(aspect, frequency);
      this.currentFrequency.start();
      UI.activateGameButton(btnId);
    }
  }

  stop(btnId) {
    // stop current sound, "deactivate" a game button
    if (this.currentFrequency) {
      this.currentFrequency.stop();
      this.currentFrequency = null;
      UI.deactivateGameButton(btnId);
    }
  }

  getButtonFrequency(btnId) {
    return this.gameButtons.find((el, index) => index === btnId).frequency;
  }

  // playTetrisSound(){
  // An idea for the future, play at game over
  //   //A4 | G4-F4-E4   | E4-F4-D4  | D4-F4-A4 | G4-F4-E4 | E4-F4-G4 | A4 | F4 | D4 | D4.
  //   //G4 | G4-A#4-D5  | C5-A#4-A4 | A4-G4-A4 | G4-F4-E4 | E4-F4-G4 | A4 | F4 | D4 | D4.
  // }

  // timer function, to control game flow
  timer(sec) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, sec * 1000);
    });
  }
}
