const fs = require('fs');
const file = 'src/pages/Integrity.tsx';
let content = fs.readFileSync(file, 'utf8');

const map = {
  'Ã¶': 'ö',
  'Ã¤': 'ä',
  'Ã¥': 'å',
  'Ã„': 'Ä',
  'Ã–': 'Ö',
  'Ã…': 'Å',
  'â€“': '–'
};

for (const [bad, good] of Object.entries(map)) {
  content = content.split(bad).join(good);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed encodings in Integrity.tsx');
