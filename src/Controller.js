import View from "./View.js";
import Database from "./Database.js";

class Controller {
    constructor() {
        this.db = new Database();
        this.isGameActive = false;
        this.handleGuess = null; 
    }

    generateSecretNumber() {
        var arrayNumbers = [];
        const length = 3;

        while (arrayNumbers.length !== length) {
            var number = Math.floor(Math.random() * 9) + 1;

            if (!arrayNumbers.includes(number)) {
                arrayNumbers.push(number);
            }
        }

        var result = arrayNumbers.join("");

        return result;
    }

    menu() {
        this.isGameActive = false;
        const screen = document.getElementById("screen");

        screen.textContent = "";

        const view = new View();

        view.showMenu();

        const usernameInput = document.getElementById("usernameInput");
        const start = document.getElementById("start");            
        start.addEventListener("click", () => {
            const username = usernameInput.value.trim();
            if (username) {
                this.startGame(username);
            } else {
                alert("Пожалуйста, введите ваше имя!");
            }        
        });
        

        const viewResultsButton = document.getElementById("view-results");
        viewResultsButton.addEventListener("click", () => {
            this.viewResults();
        });

        viewResultsButton.removeAttribute("disabled");
    }

    startGame(username) {
        if (this.isGameActive) return;
        this.isGameActive = true;

        let hints = [];

        var secretNumber = this.generateSecretNumber();
        const view = new View();
        var screen = document.getElementById("screen");

        screen.textContent = "";

        let attempts = 0;
        console.log(secretNumber);

        var button = document.getElementById("submit");
        var exit = document.getElementById("exit");
        var data = document.getElementById("data");
        const viewResultsButton = document.getElementById("view-results");

        data.removeAttribute("hidden");
        button.removeAttribute("hidden");
        viewResultsButton.setAttribute("disabled", "true");

        view.showMessage("Введите число", "robot");

        if (this.handleGuess) {
            button.removeEventListener("click", this.handleGuess);
        }

        this.handleGuess = () => {
            const userData = document.getElementById("input").value;

            document.getElementById("input").value = "";
            attempts++;

            view.showMessage(userData, "user");

            if (userData.length === secretNumber.length) {
                hints = [];

                for (let i = 0; i < secretNumber.length; i++) {
                    if (secretNumber[i] === userData[i]) {
                        hints.push('Горячо');
                    } else if (secretNumber.includes(userData[i])) {
                        hints.push('Тепло');
                    } else {
                        hints.push('Холодно');
                    }
                }

                if (this.isWinning(hints)) {
                    view.showMessage("Ура! Победа!", "robot");
                    this.db.storeResult(username, secretNumber, attempts);
                    setTimeout(() => {
                        this.menu();
                    }, 1500);
                    data.setAttribute("hidden", true);
                    button.setAttribute("hidden", true);

                    viewResultsButton.removeAttribute("disabled");
                } else {
                    view.showMessage(hints, "robot");
                }
            }  
            
        };

        button.addEventListener("click", this.handleGuess);

        exit.addEventListener("click", () => {
            location.reload();
        })
    }

    isWinning(hints) {
        const word = "Горячо";

        return hints.every(item => item === word);
    }

    viewResults() {

        this.db.getResults((results) => {
            const screen = document.getElementById("screen");
            screen.textContent = "";
    
            const view = new View();
            view.showMessage("Результаты сыгранных игр:", "robot");
    
            if (results.length === 0) {
                view.showMessage("Нет сыгранных игр.", "robot");
                return;
            }
    
            results.forEach(result => {
                view.showMessage(`Игрок: ${result.username}, Загаданное число: ${result.secretNumber}, Попыток: ${result.attempts}`, "robot");
            });
        });

        exit.addEventListener("click", () => {
            location.reload();
        })
    }
    

   
    
}

export default Controller;


// public function startGame()
//     {
//         $isFinished = false;
//         $counter = 0;
//         $hints = [];
//         $triesCounter = 0;

//         $username = readline("Ваше имя: ");

//         if (! file_exists('cold-hot.db')) {
//             $model = new Model('cold-hot.db');
//             $model->createTables();
//         } else {
//             $model = new Model('cold-hot.db');
//         }

//         $secretNumber = $this->generateSecretNumber();
//         $gameId = $model->createId();

//         while (!$isFinished) {
//             $userData = readline("Ваше число (или 'exit' для выхода): ");

//             $triesCounter++;

//             $counter = 0;
//             $hints = [];

//             if ($userData === 'exit') {
//                 $model->storeResult($username, $secretNumber, 0);
//                 $model->storeTry($gameId, $triesCounter, $userData, 'Проигрыш');

//                 View::showLose($secretNumber);
//                 die();
//             } elseif (strlen($userData) === strlen($secretNumber)) {
//                 for ($i = 0; $i < strlen($secretNumber); $i++) {
//                     if (mb_strpos($secretNumber, $userData[$i]) !== false) {
//                         if (mb_strpos($secretNumber, $userData[$i]) === $i) {
//                             $hints[] = 'Горячо';
//                         } else {
//                             $hints[] = 'Тепло';
//                         }
//                     } else {
//                         $hints[] = 'Холодно';
//                     }
//                 }

//                 sort($hints);

//                 foreach ($hints as $status) {
//                     if ($status === 'Горячо') {
//                         $counter++;
//                     }
//                 }

//                 if ($counter === 3) {
//                     $isFinished = true;

//                     $model->storeResult($username, $secretNumber, 1);
//                     View::showWin($secretNumber);
//                 }

//                 View::showHints(implode(', ', $hints));

//                 $isFinished ? $model->storeTry($gameId, $triesCounter, $userData, 'Победа') : $model->storeTry($gameId, $triesCounter, $userData, implode(', ', $hints));
//             }
//         }
//     }