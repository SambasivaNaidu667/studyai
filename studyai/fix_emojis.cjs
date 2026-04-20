const fs = require('fs');
const path = require('path');

const charsToFix = [
  '🔥', '📈', '💻', '☕', '⚛️', '📊', '🧠', '🤖', '🌐', '🚀', '⚙️', '📱', '🎮', 
  '📐', '📖', '🔬', '📜', '🌍', '🎨', '💰', '🏛️', '🧬', '🗺️', '🎵', '⚖️', '🏋️', 
  '🎓', '🏆', '👏', '💪', '📋', '🔴', '🎯', '👋', '🗓️', '✦', '↑', '—', '✨', 
  '🤔', '⚠️', '👤', '📅', '🔔', '📥', '🗑️', '🚪', '📚', '📌', '💡', '💬', '👎', '👍',
  '✔️', '❌', '➡️', '⬅️', '⬇️', '⚙', '✅', '⛔', '❤️', '⏱️', '💯', '🙏',
  '•', '“', '”', '‘', '’', '×', '÷', '−', '±', '™', '©', '®', '✏️', '✈️', '⚡', '⭐', '🌟', '🎉',
  '👉', '👇', '💎', '🛑', '✋', '📝', '🔒', '🔑', '🔓', '🎧', '📸', '📽️', '🔗'
];

function mangle(str) {
  let utf8Bytes = Buffer.from(str, 'utf8');
  let mangled = '';
  const byteToWin1252 = { 
    0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 
    0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 
    0x92: 0x2019, 0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC, 
    0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178 
  };
  for(let i=0; i<utf8Bytes.length; i++) {
    let b = utf8Bytes[i];
    let code = byteToWin1252[b] || b;
    mangled += String.fromCharCode(code);
  }
  return mangled;
}

const directory = 'c:/Users/prava/Downloads/studyai-project/studyai/src';

const repairs = charsToFix.map(c => ({
  target: mangle(c),
  replacement: c
})).sort((a, b) => b.target.length - a.target.length);

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  if (newContent.charCodeAt(0) === 0xFEFF) {
    newContent = newContent.slice(1);
  }

  for (let repair of repairs) {
    newContent = newContent.split(repair.target).join(repair.replacement);
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed emojis in: ' + filePath);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

traverse(directory);
