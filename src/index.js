import Controller from "./Controller.js";

document.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller();

    var secretNumber = controller.generateSecretNumber();

    // controller.startGame();    

    controller.menu(); 
})