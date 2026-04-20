const fs = require('fs');
try {
  let content = fs.readFileSync('c:/Users/prava/Downloads/studyai-project/studyai/src/pages/Dashboard.jsx', 'utf8');
  fs.writeFileSync('c:/Users/prava/Downloads/studyai-project/studyai/dashboard_raw.txt', JSON.stringify({ corruptedUrl: content.substring(content.indexOf("You're on fire!"), content.indexOf("You're on fire!") + 100) }), 'utf8');
} catch(e) {
  fs.writeFileSync('c:/Users/prava/Downloads/studyai-project/studyai/dashboard_raw.txt', e.stack, 'utf8');
}
