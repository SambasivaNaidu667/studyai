const fs = require('fs');

const win1252ToByte = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
  0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91,
  0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98,
  0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
};

let content = fs.readFileSync('c:/Users/prava/Downloads/studyai-project/studyai/src/pages/Dashboard.jsx', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1); // remove BOM
}

let bytes = [];
for(let i=0; i<content.length; i++) {
  let code = content.charCodeAt(i);
  let byte = win1252ToByte[code];
  if (byte === undefined) {
    if (code <= 255) {
      byte = code;
    } else {
      console.log("Unmapped high character:", code, String.fromCharCode(code), "at pos", i, "context:", content.substring(i-5, i+5));
      byte = 0x3F;
    }
  }
  bytes.push(byte);
}

let recovered = Buffer.from(bytes).toString('utf8');
console.log("Recovered text snippet:");
console.log(recovered.substring(recovered.indexOf("You're on fire!"), recovered.indexOf("You're on fire!") + 100));

fs.writeFileSync('c:/Users/prava/Downloads/studyai-project/studyai/test_recover.txt', recovered, 'utf8');
