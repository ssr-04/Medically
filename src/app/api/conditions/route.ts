import { getAllConditions } from '@/actions/condition.action';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures this API is not pre-rendered

export async function GET() {
    try {
        const conditions = await getAllConditions();

        // Ensure JSON serializability (convert Date objects to strings)
        if (!conditions) {
            throw new Error('Failed to fetch conditions');
        }
        const sanitizedConditions = conditions.map(cond => ({
            ...cond,
            createdAt: cond.createdAt?.toISOString(),  // Convert Date to string
            updatedAt: cond.updatedAt?.toISOString(),
        }));

        return NextResponse.json(sanitizedConditions, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch conditions' }, { status: 500 });
    }
}
