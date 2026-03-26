import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({
            status: '✅ Connected',
            message: 'MongoDB is connected successfully!'
        });
    } catch (err) {
        return NextResponse.json({
            status: '❌ Failed',
            message: err.message
        }, { status: 500 });
    }
}
