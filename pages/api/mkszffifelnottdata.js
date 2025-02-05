import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'scrapes', 'mkszffifelnott.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  res.status(200).json(JSON.parse(jsonData));
}
