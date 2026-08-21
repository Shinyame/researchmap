const fs = require('fs');
const readline = require('readline');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../raw_data/researchmap.jsonl');
const OUTPUT_FILE = path.join(__dirname, '../data/researchmap.json');

async function parseJsonl() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.warn(`Warning: ${INPUT_FILE} is missing. Please place the sanitized jsonl file.`);
    process.exit(0);
  }

  const fileStream = fs.createReadStream(INPUT_FILE);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  // 必要な全カテゴリを網羅
  const db = {
    profile: {},
    research_interests: [],
    research_areas: [],
    association_memberships: [],
    research_experience: [],
    education: [],
    committee_memberships: [],
    published_papers: [],
    misc: [],
    social_contribution: [],
    awards: [],
    research_projects: [],
    academic_contribution: [],
    misc_others: []
  };

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const record = JSON.parse(trimmed);
      const type = record.insert?.type;
      const data = record.merge;

      if (!type || !data) continue;

      if (type === 'researchers') {
        db.profile = data;
      } else if (db[type]) {
        db[type].push(data);
      } else {
        db.misc_others.push(data);
      }
    } catch (err) {
      console.error('Parse error on line:', trimmed);
    }
  }

  // 汎用的な日付取得関数（新しい順にソートするため）
  const getDate = (item) => {
    return item.publication_date || item.award_date || item.from_event_date || item.from_date || '0000';
  };
  const sortByDateDesc = (a, b) => getDate(b).localeCompare(getDate(a));

  // 各配列をソート
  Object.keys(db).forEach(key => {
    if (Array.isArray(db[key])) {
      db[key].sort(sortByDateDesc);
    }
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Conversion completed. All requested sections structured for Hugo.`);
}

parseJsonl();