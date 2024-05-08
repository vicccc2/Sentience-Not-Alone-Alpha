//class to manage conversations between different characters
/*export*/  class DialogueScript {
  // public variables 
  isActive = false; // wether it is active
  characters; // array of characters
  script; // string 

  // private variables
  #dialogueManager; // my custom dialogue manager
  #arrayCount = 0; // how far the script you are in
  #converstaionArray = []; // array that holds teh conversations
  #keyZ; // key press to move onto the next text
  #keyDown; // down key to start text


  // public functions
  constructor(dialogueManager, keyZ, keyDown) {
    this.#dialogueManager = dialogueManager;
    this.#keyZ = keyZ;
    this.#keyDown = keyDown;
  }

  // adds a conversation to the array of conversations
  newConversation(conversation) {
    this.#converstaionArray[this.#converstaionArray.length] = conversation;
  }

  // listens for the player to click for the next group of text or start the text 
  listen(conversationNumber) {
    if ((this.#keyDown.isDown === true) && this.isActive !== true && this.#dialogueManager.speaking !== true) {
      this.characters = this.#converstaionArray[conversationNumber - 1].characters;
      this.script = this.#converstaionArray[conversationNumber - 1].script;
      this.#startScript();
    }
    else if (this.#keyZ.isDown === true && this.#dialogueManager.speaking === true && this.isActive === true && this.#dialogueManager.dialogueSize > 3 && this.#dialogueManager.delay === false) {
      this.#dialogueManager.showAll();
    }
    else if (this.#keyZ.isDown === true && this.#dialogueManager.speaking === false && this.isActive === true && this.#dialogueManager.delay === false) {
      this.#next();
    }
  }

  // private functions

  // activates self and dialogue manager
  #startScript() {
    this.#dialogueManager.dialogueStart();
    this.isActive = true;
    this.#next();
  }

  // goes to the text group of text
  #next() {
    if (this.#arrayCount !== this.characters.length) {
      this.#dialogueManager.speak(this.characters[this.#arrayCount], this.script[this.#arrayCount]);
      this.#arrayCount = this.#arrayCount + 1;
    }
    else {
      this.#endScript();
    }
  }

  // ends the conversation
  #endScript() {
    this.#dialogueManager.dialogueOver();
    this.isActive = false;
    this.#arrayCount = 0;
  }
}