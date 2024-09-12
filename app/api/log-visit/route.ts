import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface VisitData {
  [url: string]: number;
}

export async function POST(request: Request) {
  const { url } = await request.json();

  console.log("log-visit requested")
  console.log(url)

  const logDir = path.join(process.cwd(), 'data');
  const logFile = path.join(logDir, 'visits.json');

  console.log(logDir)
  console.log(logFile)

  let visitData: VisitData = {};

  try {
    await fs.mkdir(logDir, { recursive: true });
    const fileContent = await fs.readFile(logFile, 'utf-8');
    visitData = JSON.parse(fileContent);
  } catch (error) {
    console.log('Creating new visit data file');
  }

  if (!visitData[url]) {
    visitData[url] = 0;
  }
  visitData[url]++;

  await fs.writeFile(logFile, JSON.stringify(visitData, null, 2));

  return NextResponse.json({ message: 'Visit logged successfully' });
}