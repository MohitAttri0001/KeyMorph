let outputDiv = document.getElementById('output');
let headerDiv = document.getElementById('welcome-header');
let currentIndex = 0;
let currentText = '';

function typeWrite(text, targetDiv, callback) {
    currentText = text;
    currentIndex = 0;
    targetDiv.textContent = '';
    function type() {
        if (currentIndex < currentText.length) {
            targetDiv.textContent += currentText[currentIndex];
            currentIndex++;
            setTimeout(type, 50);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// Trigger typewriter effect on header on page load
window.addEventListener('load', function() {
    typeWrite('Welcome to the Key Morph Vigenere Cipher Converter ', headerDiv);
});

function keyExtender(key, length, showCycles) {
    let extended = '';
    let current = key;
    let cycle = 0;
    let cyclesText = '';
    if (showCycles) {
        cyclesText += 'Key Extension Cycles:\n';
    }
    while (extended.length < length) {
        // Morph current at the start of each cycle
        let newCurrent = '';
        for (let i = 0; i < current.length; i++) {
            let char = current[i];
            let shift = i + 1;
            if (char >= 'A' && char <= 'Z') {
                newCurrent += String.fromCharCode((char.charCodeAt(0) - 65 + shift) % 26 + 65);
            } else if (char >= 'a' && char <= 'z') {
                newCurrent += String.fromCharCode((char.charCodeAt(0) - 97 + shift) % 26 + 97);
            } else {
                newCurrent += char;
            }
        }
        current = newCurrent;
        cycle++;
        // Add up to key.length characters, but not more than needed
        let toAdd = Math.min(key.length, length - extended.length);
        for (let i = 0; i < toAdd; i++) {
            extended += current[i];
        }
        // Display cycle only if it was fully added
        if (toAdd === key.length && showCycles) {
            cyclesText += 'Cycle ' + cycle + ': ' + current + '\n';
        }
    }
    if (showCycles) {
        cyclesText += 'Final Extended Key: ' + extended.substr(0, length) + '\n\n';
    }
    return { extended: extended.substr(0, length), cyclesText };
}

function encrypt(ptext, ekey) {
    let ctext = '';
    for (let i = 0; i < ptext.length; i++) {
        let p = ptext[i];
        let k = ekey[i];
        let encrypted_char;
        if (p >= 'A' && p <= 'Z') {
            let shift = k.toUpperCase().charCodeAt(0) - 65;
            encrypted_char = String.fromCharCode((p.charCodeAt(0) - 65 + shift) % 26 + 65);
        } else if (p >= 'a' && p <= 'z') {
            
            let shift = k.toLowerCase().charCodeAt(0) - 97;
            encrypted_char = String.fromCharCode((p.charCodeAt(0) - 97 + shift) % 26 + 97);
        } else {
            encrypted_char = p;
        }
        ctext += encrypted_char;
    }
    return ctext;
}

function decrypt(ctext, ekey) {
    let ptext = '';
    for (let i = 0; i < ctext.length; i++) {
        let c = ctext[i];
        let k = ekey[i];
        if (c >= 'A' && c <= 'Z') {
            let shift = k.toUpperCase().charCodeAt(0) - 65;
            ptext += String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
        } else if (c >= 'a' && c <= 'z') {
            let shift = k.toLowerCase().charCodeAt(0) - 97;
            ptext += String.fromCharCode((c.charCodeAt(0) - 97 - shift + 26) % 26 + 97);
        } else {
            ptext += c;
        }
    }
    // Replace %20 with spaces
    ptext = ptext.replace(/%20/g, ' ');
    return ptext;
}

document.getElementById('encryptBtn').addEventListener('click', function() {
    let ptext = document.getElementById('text').value;
    let key = document.getElementById('key').value;
    let showCycles = document.getElementById('showCycles').checked;

    // Replace spaces with %20
    ptext = ptext.replace(/ /g, '%20');
    key = key.replace(/ /g, '%20');

    let plen = ptext.length;
    let { extended: extendedKey } = keyExtender(key, plen, showCycles);
    let ctext = encrypt(ptext, extendedKey);
    lastCipherText = ctext; // Store the cipher text for decrypt

    let outputText = 'Cipher Text: ' + ctext + '\n\n';

    typeWrite(outputText, outputDiv);
});

document.getElementById('decryptBtn').addEventListener('click', function() {
    let ctext = lastCipherText || document.getElementById('text').value;
    let key = document.getElementById('key').value;
    let showCycles = document.getElementById('showCycles').checked;

    // Replace spaces with %20
    ctext = ctext.replace(/ /g, '%20');
    key = key.replace(/ /g, '%20');

    let clen = ctext.length;
    let { extended: extendedKey } = keyExtender(key, clen, showCycles);
    let dtext = decrypt(ctext, extendedKey);

    let outputText = 'Decrypted Text: ' + dtext + '\n\n';

    typeWrite(outputText, outputDiv);
});

document.getElementById('infoBtn').addEventListener('click', function() {
    let outputText = 'It works by extending the key by shifting each character based on its position in the key (position + 1) after every full cycle through the key characters.\n\n' +
        'It is a type of Symmetric Key Cryptography.\n\n';
    typeWrite(outputText, outputDiv);
});

document.getElementById('extendedKeyBtn').addEventListener('click', function() {
    let text = document.getElementById('text').value;
    let key = document.getElementById('key').value;
    let showCycles = document.getElementById('showCycles').checked;

    // Replace spaces with %20
    text = text.replace(/ /g, '%20');
    key = key.replace(/ /g, '%20');

    let length = text.length;
    let { extended: extendedKey, cyclesText } = keyExtender(key, length, showCycles);
    let outputText = cyclesText + 'Extended Key: ' + extendedKey + '\n\n';
    typeWrite(outputText, outputDiv);
});
