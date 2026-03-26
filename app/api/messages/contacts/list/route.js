import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET() {
    await dbConnect();
    try {
        // Find unique user emails who have sent messages or received messages from admin
        const users = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { receiverEmail: 'admin' },
                        { senderEmail: 'admin' }
                    ]
                }
            },
            {
                $project: {
                    user: {
                        $cond: {
                            if: { $eq: ["$senderEmail", "admin"] },
                            then: "$receiverEmail",
                            else: "$senderEmail"
                        }
                    },
                    read: "$read",
                    createdAt: "$createdAt"
                }
            },
            {
                $group: {
                    _id: "$user",
                    unreadCount: { 
                        $sum: { 
                            $cond: [
                                { $and: [{ $eq: ["$read", false] }, { $ne: ["$_id", "admin"] }] }, 
                                1, 0
                            ] 
                        } 
                    },
                    lastMessageAt: { $max: "$createdAt" }
                }
            },
            { $sort: { lastMessageAt: -1 } }
        ]);

        return NextResponse.json(users);

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
