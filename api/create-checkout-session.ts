import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './lib/stripe';
import { db } from './lib/firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { stationId, bookingData, successUrl, cancelUrl } = req.body;
        // In a real app, validate user auth token here

        // Get station details (price, owner)
        const stationSnap = await db.collection('stations').doc(stationId).get();
        if (!stationSnap.exists) {
            return res.status(404).json({ error: 'Station not found' });
        }
        const station = stationSnap.data();
        const ownerId = station?.ownerId;

        // Get Owner's Stripe Account ID
        const ownerSnap = await db.collection('users').doc(ownerId).get();
        const ownerStripeId = ownerSnap.data()?.stripeById;

        if (!ownerStripeId) {
            return res.status(400).json({ error: 'Station owner not ready for payments' });
        }

        const price = station?.pricePerHour || 10; // Default or fetch
        const amount = Math.round(price * 100); // Cents
        const platformFee = Math.round(amount * 0.1); // 10% Platform Fee

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Charging at ${station?.name}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1, // Hours or slots
                },
            ],
            payment_intent_data: {
                application_fee_amount: platformFee,
                transfer_data: {
                    destination: ownerStripeId,
                },
            },
            metadata: {
                stationId,
                userId: bookingData.userId,
            },
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
