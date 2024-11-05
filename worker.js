var fs = require("fs");
const { ethers } = require("ethers");
var tries = 0, hits = 0;
const delay = time => new Promise(res => setTimeout(res, time));

// Load words from bip39.txt (make sure the file contains the BIP39 wordlist)
var words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' })
    .replace(/(\r)/gm, "")  // Remove carriage returns
    .toLowerCase()  // Convert all words to lowercase
    .split("\n");  // Split the file content into an array of words
    
    
    
function getRandomChance(chance) {
  var randomNum = Math.floor(Math.random() * 100);
  return randomNum < chance;
}

function gen12(words) {
  let randomWords = [];
  while (randomWords.length < 12) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex].trim();
    randomWords.push(word);
  }
  return randomWords.join(" ");
}

console.log("starting....");

async function doCheck() {
  tries++;
  try {
    var mnemonic = gen12(words);
    if (getRandomChance(13)) {
      var wall = ethers.Wallet.fromMnemonic(mnemonic);
      // Menyimpan address di sebelah kiri dan mnemonic di sebelah kanan, dipisahkan dengan koma
      fs.appendFileSync('jjj', wall.address + "," + mnemonic + "\n");
      hits++;
      //console.log( ${wall.address}    ${mnemonic}  );
      process.stdout.write("+");
    }
  } catch (e) { }
  await delay(0); // Prevent Call Stack Overflow
  process.stdout.write("-");
  doCheck();
}
doCheck();
