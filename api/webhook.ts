import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './lib/stripe';
import { db } from './lib/firebase';

// Helper to get raw body (Vercel parses by default, we might need to rely on vercel.json config or a specific pattern)
// For now, we assume rawBody is available or we handle it. 
// A common pattern in Vercel is to simply use the req buffer if not parsed, or use a library.

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // In Vercel, getting the raw body can be tricky if it's already parsed.
        // We assume we configure Vercel to NOT parse this route, or we reconstruct it.
        // For this implementation, we'll assume req.body is the buffer if we set config correctly.
        // IMPORTANT: In vercel.json, set "bodyParser": false for this route if possible, or use raw-body.
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig as string, webhookSecret as string);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const bookingId = session.metadata.bookingId; // We need to pass this in checkout creation metadata
        // Wait, in create-checkout I passed stationId and userId, not bookingId.
        // I should create the booking in Firestore with 'pending' status BEFORE checkout.

        // If I relied on metadata:
        const { userId, stationId } = session.metadata;

        // Create connection or update booking
        await db.collection('bookings').add({
            userId,
            stationId,
            status: 'confirmed',
            paymentId: session.id,
            amount: session.amount_total,
            timestamp: new Date(),
        });
    }

    res.json({ received: true });
}

// Simple buffer reader
async function getRawBody(req: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        req.on('data', (chunk: any) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
