// encapsulates Web Audio API into a simple class for easy use in the game
export default class Audio {
  constructor() {
    this.audioContext = new AudioContext();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.noteTable = this.createNoteTable();
  }

  // a bank of musical notes frequencies
  createNoteTable() {
    let noteTable = Array.from({ length: 14 }, () => []);
    noteTable[2]['B'] = 123.47082531403103;
    noteTable[3]['G'] = 195.9977179908746;
    noteTable[3]['B'] = 246.94165062806206;
    noteTable[4]['C'] = 261.6255653005986;
    noteTable[4]['C#'] = 277.1826309768721;
    noteTable[4]['D'] = 293.6647679174076;
    noteTable[4]['D#'] = 311.12698372208087;
    noteTable[4]['E'] = 329.6275569128699;
    noteTable[4]['F'] = 349.2282314330039;
    noteTable[4]['G'] = 391.99543598174927;
    noteTable[4]['A'] = 440;
    noteTable[4]['A#'] = 466.1637615180899;
    noteTable[5]['C'] = 523.2511306011972;
    noteTable[5]['D'] = 587.3295358348151;
    return noteTable;
  }

  // get a note frequency from note table
  getNoteFrequency(octave, note) {
    return this.noteTable[octave][note];
  }

  // create a sound
  createSound(aspect, frequency) {
    let osc;

    osc = this.audioContext.createOscillator();
    osc.connect(this.masterGainNode);
    osc.type = aspect;
    osc.frequency.value = frequency;

    return osc;
  }
}
