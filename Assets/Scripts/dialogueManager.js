// class to manage dialogue
/*export*/ class DialogueManager {
  // public variables
  delay = false; // adds delay between pressing the continue button
  speaking = false; // if the dialogue manager is displaying text
  dialogueSize = 0; // int to keep tract of text

  // private variables
  #audio; // the audio for the text
  #volume; // the volume of the text noises
  #dialogue; // saves the dialogue for later use
  #text; // main text object
  #nameText; // name text object
  #textBox; // text box image
  #image; // character portrait image object
  #dialogueSpoken = ''; // string to keep track of text
  #continueText; // text that tells you what button it is to continue the dialogue
  #dialogueTween; // saves the tween game object for later use
  #newLength; // updates the length of the string becuase of \n
  #spaceCounter = 0; // counts characters for adding a new line in the text so it wont go off the screen

  // public functions
  constructor(image, textBox, text, nameText, continueText, audio, volume) {
    //volume of text
    this.#volume = volume;

    // adding text object for main dialogue
    this.#text = text;
    this.#text.setScrollFactor(0);
    this.#text.setScale(0.5);

    // add textBox image object
    this.#textBox = textBox;
    this.#textBox.setScrollFactor(0);

    // adding image object, character portrait
    this.#image = image;
    this.#image.setScale(0.15);
    this.#image.setScrollFactor(0);
    // this.image.setFlipX(true); FIX IMAGES 

    // adding text object
    this.#nameText = nameText;
    this.#nameText.setScrollFactor(0);
    this.#nameText.setScale(0.5);

    // save continue text
    this.#continueText = continueText;
    continueText.setText(continueText.text + ' to continue');
    this.#continueText.setScrollFactor(0);
    this.#continueText.setScale(0.5);

    //setting everything invisable
    this.#text.setVisible(false);
    this.#nameText.setVisible(false);
    this.#image.setVisible(false);
    this.#textBox.setVisible(false);
    this.#continueText.setVisible(false);

    // saving tween manager from phaser
    this.#audio = audio;

  }

  // if player changes the volume of effects then it is updated
  updateVolume(volume) {
    this.#volume = volume / 2;
  }

  //Speak function, takes a character class and string
  speak(character, dialogue) {
    this.#newLength = dialogue.length;
    this.#dialogue = dialogue;
    this.speaking = true;
    this.#image.setTexture(character.portrait);
    this.#nameText.setText(character.name + ':');
    this.#text.setText('');

    // text animation
    this.#nameText.setColor(character.color);

    this.#dialogueTween = currentScene.tweens.add({
      targets: this.#text,
      loop: dialogue.length,
      loopDelay: 50,
      onLoop: () => {
        if (this.#spaceCounter >= 50 && dialogue[this.dialogueSize - 1] === ' ') {
          console.log('NEW SPACE');
          this.#dialogueSpoken = this.#dialogueSpoken + '\n' + dialogue[this.dialogueSize];
          this.dialogueSize = this.dialogueSize + 1;
          this.#text.setText(this.#dialogueSpoken);
          this.#audio.play({
            volume: this.#volume / 2,
            loop: false
          });
          this.#spaceCounter = 0;
          this.#newLength = this.#newLength + 1;
        }
        else {
          this.#dialogueSpoken = this.#dialogueSpoken + dialogue[this.dialogueSize];
          this.dialogueSize = this.dialogueSize + 1;
          this.#text.setText(this.#dialogueSpoken);
          this.#audio.play({
            volume: this.#volume,
            loop: false
          });
          this.#spaceCounter = this.#spaceCounter + 1;
        }
      },
      onComplete: this.#textComplete.bind(this)
    });
  }

  // if player wants to skip the text
  showAll() {
    this.#dialogueTween.stop();
    let j = this.#newLength - this.#dialogueSpoken.length

    for (let i = 0; i < j; i++) {
      if (this.#spaceCounter >= 50 && this.#dialogue[this.dialogueSize - 1] === ' ') {
        this.#dialogueSpoken = this.#dialogueSpoken + '\n' + this.#dialogue[this.dialogueSize];
        this.dialogueSize = this.dialogueSize + 1;
        this.#spaceCounter = 0;
      }
      else {
        this.#dialogueSpoken = this.#dialogueSpoken + this.#dialogue[this.dialogueSize];
        this.dialogueSize = this.dialogueSize + 1;
        this.#spaceCounter = this.#spaceCounter + 1;
      }
    }
    this.#text.setText(this.#dialogueSpoken);
    if (this.delay === false) {
      this.#textComplete();
      this.delay = true;
      currentScene.tweens.add({
        targets: this.#text,
        loop: 3,
        loopDelay: 50,
        onComplete: this.delayOver.bind(this)
      });
    }
  }

  delayOver() {
    this.delay = false;
  }

  // private functions
  // when tween completes
  #textComplete() {
    this.speaking = false;
    this.#dialogueSpoken = '';
    this.dialogueSize = 0;
    this.#spaceCounter = 0;
  }

  // ends the dialogue
  dialogueOver() {
    this.#text.setVisible(false);
    this.#nameText.setVisible(false);
    this.#image.setVisible(false);
    this.#textBox.setVisible(false);
    this.#continueText.setVisible(false);
  }

  // starts the dialogue
  dialogueStart() {
    this.#continueText.setVisible(true);
    this.#text.setVisible(true);
    this.#nameText.setVisible(true);
    this.#image.setVisible(true);
    this.#textBox.setVisible(true);
    this.#nameText.setText('');
    this.#text.setText('');
  }
}
