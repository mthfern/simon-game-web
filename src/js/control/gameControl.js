import Audio from '../model/audio';
import * as UI from '../view/appUI';

export default class GameControl {
  constructor() {
    this.gameStarted = false;
    this.currentFrequency = null;

    this.audioComp = new Audio();

    this.gameButtons = [
      { frequency: this.audioComp.getNoteFrequency(3, 'G') },
      { frequency: this.audioComp.getNoteFrequency(4, 'C') },
      { frequency: this.audioComp.getNoteFrequency(4, 'D') },
      { frequency: this.audioComp.getNoteFrequency(4, 'E') },
    ];

    this.dificulty = new Map([
      [0, 8],
      [1, 13],
      [2, 21],
      [3, 34],
    ]);

    this.increseSpeedAt = 5;
    this.speedIncrement = 0.85;

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
    this.roundInputs = [];
    this.lastRound = this.dificulty.get(Number(level));

    this.timePressets = this.loadTimePressets();

    UI.updateScore(this.score);
    UI.updateRound(this.round);

    // create random sequence
    this.gameSequence = Array.from({ length: this.lastRound }, () =>
      Math.floor(Math.random() * 4)
    );

    // automatic play sequence
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

  userAction(action, btnId) {
    if (action == 'press') {
      this.play(btnId, 'triangle', this.getButtonFrequency(btnId));
    } else {
      this.stop(btnId);
      this.roundInputs.push(btnId);
      if (btnId !== this.gameSequence[this.roundInputs.length - 1]) {
        this.userTurn = false;
        this.gameOver();
      } else {
        UI.updateScore(++this.score);
        if (this.roundInputs.length === this.round) {
          this.userTurn = false;
          if (this.round === this.lastRound) {
            this.showResult(1);
          } else {
            this.nextRound();
          }
        }
      }
    }
  }

  async gameOver() {
    const padIterator = (function* (v) {
      while (true) {
        if (v > 3) {
          v = 0;
        }
        yield v++;
      }
    })(0);

    // play gameover sound
    await this.timer(this.timePressets.gameOverBefore);

    for (let n of Array.from({ length: 4 })) {
      await this.playAwaitStop(
        padIterator.next().value,
        'triangle',
        this.audioComp.getNoteFrequency(4, 'D#'),
        this.timePressets.gameOverBetween
      );
    }

    this.showResult(0);
  }

  showResult(type) {
    this.gameStarted = false;
    UI.showEndPanel(this.messages.get(type));
  }

  async nextRound() {
    this.roundInputs = [];

    if (this.round % this.increseSpeedAt == 0) {
      this.timePressets.padDuration *= this.speedIncrement;
      this.timePressets.sequenceBetween *= this.speedIncrement;
    }

    UI.updateRound(++this.round);

    await this.timer(this.timePressets.nextRoundBefore);
    this.playGameSequence();
  }

  play(btnId, aspect, frequency) {
    if (!this.currentFrequency) {
      this.currentFrequency = this.audioComp.createSound(aspect, frequency);
      this.currentFrequency.start();
      UI.toggleGameButtonActive(btnId);
    }
  }

  stop(btnId) {
    if (this.currentFrequency) {
      this.currentFrequency.stop();
      this.currentFrequency = null;
      UI.toggleGameButtonActive(btnId);
    }
  }

  getButtonFrequency(btnId) {
    return this.gameButtons.find((el, index) => index === btnId).frequency;
  }

  // playTetrisSound(){
  //   //A4 | G4-F4-E4   | E4-F4-D4  | D4-F4-A4 | G4-F4-E4 | E4-F4-G4 | A4 | F4 | D4 | D4.
  //   //G4 | G4-A#4-D5  | C5-A#4-A4 | A4-G4-A4 | G4-F4-E4 | E4-F4-G4 | A4 | F4 | D4 | D4.
  // }

  timer(sec) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, sec * 1000);
    });
  }
}
