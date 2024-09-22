import { NextRequest, NextResponse } from 'next/server';
import { getAISites, saveAISites } from '@/lib/aiSites';

export async function GET() {
  try {
    const aiSites = getAISites();
    return NextResponse.json(aiSites);
  } catch (error) {
    console.error('Error reading AI sites:', error);
    return NextResponse.json({ error: 'Failed to read AI sites' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedData = await request.json();
    saveAISites(updatedData);
    return NextResponse.json({ message: 'AI sites updated successfully' });
  } catch (error) {
    console.error('Error updating AI sites:', error);
    return NextResponse.json({ error: 'Failed to update AI sites' }, { status: 500 });
  }
}