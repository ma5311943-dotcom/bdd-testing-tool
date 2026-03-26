import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export async function POST(req) {
    await dbConnect();
    try {
        const { senderEmail, receiverEmail, content, role } = await req.json();

        if (!senderEmail || !receiverEmail || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const message = new Message({ senderEmail, receiverEmail, content, role });
        await message.save();

        return NextResponse.json(message);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
