import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const { userEmail } = await params;

        const messages = await Message.find({
            $or: [
                { senderEmail: userEmail },
                { receiverEmail: userEmail }
            ]
        }).sort({ createdAt: 1 });

        return NextResponse.json(messages);

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const { userEmail } = await params;

        // Mark all messages from the user to admin as read
        await Message.updateMany(
            { senderEmail: userEmail, receiverEmail: 'admin' },
            { read: true }
        );

        return NextResponse.json({ message: "Messages marked as read" });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
