class View {

    showMessage(message, avatar) {
        const gameWindow = document.getElementById("screen");
        let isComputer = avatar === "robot";
        message = `<div class="message">${message}</div>`
        avatar = `<div class="avatar"><i class="fa-solid fa-${avatar}"></i></div>`
        
        if (isComputer) {
            gameWindow.insertAdjacentHTML("beforeend", `<div class="game-item computer">${avatar}${message}</div>`);
        } else {
            gameWindow.insertAdjacentHTML("beforeend", `<div class="game-item user">${avatar}${message}</div>`);            
        }

    }

    showMenu() {
        const gameWindow = document.getElementById("screen");

        gameWindow.insertAdjacentHTML("beforeend", `<div>
            <input type="text" class="message" id="usernameInput" placeholder="Введите ваше имя"/>
            <button class="menu-item" id="start" >New Game</button></div>`);
    }
}

export default View;