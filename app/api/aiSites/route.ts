import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const AI_SITES_FILE = path.join(process.cwd(), 'data', 'aiSites.json');

async function readAiSites(): Promise<AISitesData> {
  const data = await fs.readFile(AI_SITES_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeAiSites(aiSites: AISitesData) {
  await fs.writeFile(AI_SITES_FILE, JSON.stringify(aiSites, null, 2));
}

export async function GET() {
  try {
    const aiSites = await readAiSites();
    return NextResponse.json(aiSites);
  } catch (error) {
    console.error('Error reading AI sites:', error);
    return NextResponse.json({ error: 'Failed to read AI sites' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedData: AISitesData = await request.json();
    await writeAiSites(updatedData);
    return NextResponse.json({ message: 'AI sites updated successfully' });
  } catch (error) {
    console.error('Error updating AI sites:', error);
    return NextResponse.json({ error: 'Failed to update AI sites' }, { status: 500 });
  }
}