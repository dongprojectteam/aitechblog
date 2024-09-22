import fs from 'fs'
import path from 'path'

const aiSitesFile = path.join(process.cwd(), 'data', 'aiSites.json')

interface AISite {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

interface AISiteCategory {
  category: string;
  sites: AISite[];
}

interface AISitesData {
  aiSites: AISiteCategory[];
}

// AI 사이트 데이터 가져오기
export function getAISites(): AISitesData {
  if (!fs.existsSync(aiSitesFile)) {
    return { aiSites: [] }
  }
  const fileContents = fs.readFileSync(aiSitesFile, 'utf8')
  return JSON.parse(fileContents)
}

// AI 사이트 데이터 저장하기
export function saveAISites(data: AISitesData) {
  fs.writeFileSync(aiSitesFile, JSON.stringify(data, null, 2))
}
