import { NextResponse } from 'next/server';
import { getTools } from '../../../src/lib/tools';

export const dynamic = 'force-static';

export async function GET() {
  const tools = getTools();
  return NextResponse.json({ tools });
}
