import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import History from '@/models/history';

export async function DELETE() {
    await dbConnect();
    try {
        await History.deleteMany({});
        return NextResponse.json({ message: "All history cleared" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
