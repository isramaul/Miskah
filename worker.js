var fs = require("fs");
const { ethers } = require("ethers");
var tries = 0, hits = 0;
const delay = time => new Promise(res => setTimeout(res, time));

// Load words from bip39.txt (make sure the file contains the BIP39 wordlist)
var words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' })
    .replace(/(\r)/gm, "")  // Remove carriage returns
    .toLowerCase()  // Convert all words to lowercase
    .split("\n");  // Split the file content into an array of words

// Helper function to generate a random 12-word mnemonic



function generateMnemonic() {
  let mnemonic = "";
  let selectedWords = new Set();

  for (let i = 0; i < 12; i++) {
    let word;
    
    // Lakukan 5 kali acakan sebelum memilih kata
    for (let j = 0; j < 5; j++) {
      word = words[Math.floor(Math.random() * words.length)];
    }

    // Pastikan kata yang dipilih unik
    while (selectedWords.has(word)) {
      word = words[Math.floor(Math.random() * words.length)];
    }
    
    selectedWords.add(word);
    mnemonic += word;

    // Tambahkan spasi kecuali di akhir
    if (i < 11) {
      mnemonic += " ";
    }
  }
  
  return mnemonic;
}





async function doCheck() {
  tries++;
  try {
    const mnemonic = generateMnemonic();  // Generate a random 12-word mnemonic
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);  // Create a wallet from the mnemonic

    // Log only the wallet address and mnemonic to ahits.txt (no private key)
    fs.appendFileSync('eho.txt', `${wallet.address}, ${mnemonic}\n`);
    hits++;
    process.stdout.write("+");  // Log success (wallet created)
    } catch (e) {
        // Handle any errors silently and move on
    }

    await delay(0);  // Prevent call stack overflow by adding a slight delay
    process.stdout.write("-");  // Log failure (wallet not created)
    doCheck();  // Recursively call doCheck to keep generating mnemonics
}

// Start the process
doCheck();
