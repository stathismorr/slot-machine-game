// script.js
document.addEventListener('DOMContentLoaded', () => {
    const bankDisplay = document.getElementById('bankAmount');
    const spinCountDisplay = document.getElementById('spinCount');
    const messageDisplay = document.getElementById('message');
    const spinButton = document.getElementById('spinButton');
    const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    const emojis = ['🤡', '👽', '👹', '🐓', '🖤'];
    const spinSound = document.getElementById('spinSound');
    const jackpotSound = document.getElementById('jackpotSound');
    let bank = 100000;
    let spinCount = 0;

    function spin() {
        if (bank <= 0) {
            messageDisplay.textContent = 'Sell your car and try again!';
            spinButton.disabled = true;
            return;
        }

        disableSpinButton();

        playSound(spinSound);
        spinCount++;
        spinCountDisplay.textContent = spinCount;

        let results = [];
        for (let slot of slots) {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const slotContent = document.createElement('span');
            slotContent.textContent = randomEmoji;
            slot.innerHTML = ''; // clear previous content
            slot.appendChild(slotContent);
            results.push(randomEmoji);
        }
        evaluateSpin(results);
    }

    function evaluateSpin(results) {
        const counts = results.reduce((acc, emoji) => {
            acc[emoji] = (acc[emoji] || 0) + 1;
            return acc;
        }, {});
        
        if (Object.values(counts).includes(3)) {
            bank *= 30;
            messageDisplay.textContent = 'Jackpot! You won x30!';
            playSound(jackpotSound);
            messageDisplay.classList.add('jackpot');
        } else if (Object.values(counts).includes(2)) {
            bank += Math.floor(bank / 3);
            messageDisplay.textContent = 'Two of a kind! You gain 1/3 of your money.';
            messageDisplay.classList.remove('jackpot');
        } else {
            if (bank == 1) {
                bank = 0;
                messageDisplay.textContent = 'No match and you have 1 euro left! You lose!';
                spinButton.disabled = true;
            } else {
                bank -= Math.floor(bank / 2);
                if (bank <= 0) {
                    bank = 0;
                    messageDisplay.textContent = 'Sell your car and try again!';
                    spinButton.disabled = true;
                } else {
                    messageDisplay.textContent = 'No match! You lose 1/2 of your money.';
                    messageDisplay.classList.remove('jackpot');
                }
            }
        }

        bankDisplay.textContent = bank;
    }

    function playSound(sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
    }

    function disableSpinButton() {
        spinButton.disabled = true;
        setTimeout(() => {
            spinButton.disabled = false;
        }, 1000);
    }

    spinButton.addEventListener('click', spin);
});
