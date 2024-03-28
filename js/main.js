document.getElementById("mainTitle").innerText = "Point and Click adventure game";

//game state
let gameState = {
    "door2locked": true,
    "escapedoorlocked": true,
    "inventory": [],
}

localStorage.removeItem("gameState");

// handle browser storage
if (typeof (Storage) !== "undefined") {
    //check if gamestate already exists
    if (localStorage.gameState) {
        // load savegame into local variable
        gameState = JSON.parse(localStorage.gameState)

    } else {
        // save local gamestate into browser storage
        localStorage.setItem("gameState", JSON.stringify(gameState))
    }
} else {
    // sorry! no web storage support
    alert('Web storage not supported')
}

//Game window reference
const gameWindow = document.getElementById("gameWindow");

if (gameState.keyPickedUp) {
    document.getElementById("key1").remove();
}

if (gameState.potionPickedUp) {
    document.getElementById("potion").remove();
}


const sec = 1000;

//Main Character
const mainCharacter = document.getElementById("mainCharacter");
const offsetCharacter = 16;

//speech bubbles
const mainCharacterSpeech = document.getElementById("mainCharacterSpeech");
const counterSpeech = document.getElementById("counterSpeech");

//Audio
const mcAudio = document.getElementById("mcAudio");
const cAudio = document.getElementById("cAudio");

//Inventory
const inventoryBox = document.getElementById("inventoryBox"); //div
const inventoryList = document.getElementById("inventoryList"); //ul

//Foreground Items
const door1 = document.getElementById("door1");
const sign = document.getElementById("sign");


//update inventory with gamestate items
updateInventory(gameState.inventory, inventoryList);

gameWindow.onclick = function (e) {
    var rect = gameWindow.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (e.target.id !== "mainCharacter") {
        mainCharacter.style.left = x - offsetCharacter + "px";
        mainCharacter.style.top = y - offsetCharacter + "px";
    }

    console.log(e.target.id);
    switch (e.target.id) {


        case "wall":
            return;

        case "door1":
            door1.style.opacity = 0;
            if (document.getElementById("key1") !== null) {
                console.log('Found key!');
                document.getElementById("key1").remove();
                changeInventory('key', 'add');
                gameState.keyPickedUp = true
                saveToBrowser(gameState);
            }

            case "potion":
            if (document.getElementById("potion") !== null) {
                console.log('Found potion!');
                document.getElementById("potion").remove();
                changeInventory('potion', 'add');
                gameState.potionPickedUp = true
                saveToBrowser(gameState);
            }

            break;
        case "door2":
            if (gameState.door2locked == true) {
                // check if we have key
                if (document.getElementById("inv-key") !== null) {
                    //yes -> unlock door?
                    gameState.door2locked = false;
                    changeInventory('key', 'delete');
                    console.log('Door unlocked!');
                    saveToBrowser(gameState);
                } else {
                    //no -> alert 'door locked'
                    alert("Door is locked!");
                }
            } else {
                console.log('enter building');
                window.location.href = 'Level2.html';
            }
            break;

            case "escapedoor":
                if (gameState.escapedoorlocked == true) {
                    // check if we have a potion
                    if (document.getElementById("inv-potion") !== null) {
                        //yes -> unlock escape door?
                        gameState.escapedoorlocked = false;
                        changeInventory('potion', 'delete');
                        console.log('Door unlocked!');
                        saveToBrowser(gameState);
                        window.location.href = 'Victory.html';
                    } else {
                        //no -> alert 'door locked'
                        alert("Door is locked!");
                    }
                }
                break;

            function showEscapeDialog(message) {
                const endScreen = document.getElementById("endScreen");
                endScreen.style.display = "block";

                const endMessage = document.getElementById("endMessage");
                endMessage.innerText = message;
            }


        case "statue":
            setTimeout(function () { counterAvatar.style.opacity = 1; }, 0 * sec);
            showMessage(mainCharacterSpeech, mcAudio, "Whoah, cool statue.")
            setTimeout(showMessage, 4 * sec, counterSpeech, cAudio, "Thanks, im the essence guardian")
            setTimeout(showMessage, 8 * sec, mainCharacterSpeech, mcAudio, "Sounds cool, but how do i get into the dungeon?")
            setTimeout(showMessage, 12 * sec, counterSpeech, cAudio, "Search for the key hidden in one of the trees.")
            setTimeout(showMessage, 16 * sec, mainCharacterSpeech, mcAudio, "Okay, thanks for the help!")
            setTimeout(function () { counterAvatar.style.opacity = 0; }, 16 * sec);
            break;

        default:
            //explode
            
            break;

    }

}

/**
 * function to change inventory
 * @param {string} itemName 
 * @param {string} action "add", "delete"
 * @returns 
 */
function changeInventory(itemName, action) {
    if (itemName == null || action == null) {
        console.log('wrong parameters given to changeInventory()');
        return
    }

    switch (action) {
        case 'add':
            gameState.inventory.push(itemName);
            break
        case 'delete':
            gameState.inventory.find(function (item, index) {
                if (item == itemName) {
                    var index = gameState.inventory.indexOf(item);
                    if (index !== -1) {
                        gameState.inventory.splice(index, 1);
                    }
                }
            })
            break

        default:
            break;
    }
    updateInventory(gameState.inventory, inventoryList);
}

/**
 * update inventoryList
 * @param {Array} inventory array of items 
 * @param {HTMLElement} inventoryList html <ul> element 
 */
function updateInventory(inventory, inventoryList) {
    inventoryList.innerHTML = '';
    inventory.forEach(function (item) {
        const inventoryItem = document.createElement("li");
        inventoryItem.id = "inv-" + item;
        inventoryItem.innerText = item;
        inventoryList.appendChild(inventoryItem);
    })
}

/**
 * shows a message in a speech bubble
 * @param {*} targetBalloon
 * @param {*} targetSound
 * @param {string} message
 */

function showMessage(targetBalloon, targetSound, message) {
    targetSound.currentTime = 0;
    targetSound.play();
    targetBalloon.style.opacity = "1";
    targetBalloon.innerText = message;
    setTimeout(hideMessage, 4 * sec, targetBalloon, targetSound);
}

function hideMessage(targetBalloon, targetSound) {
    targetSound.pause();
    targetBalloon.style.opacity = "0";
}
/**
 * store gameState into LocalStorage.gameState
 * @param {object} gameState our game object
 */
function saveToBrowser(gamestate) {
    localStorage.gameState = JSON.stringify(gameState);
}