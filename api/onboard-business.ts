import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './lib/stripe';
import { db, auth } from './lib/firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, refreshUrl, returnUrl } = req.body;

        const userSnap = await db.collection('users').doc(userId).get();
        let accountId = userSnap.data()?.stripeById;

        if (!accountId) {
            // Create new Express account
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'US', // default
                email: userSnap.data()?.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });
            accountId = account.id;
            // Save ID to user
            await db.collection('users').doc(userId).update({ stripeById: accountId });
        }

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding',
        });

        return res.status(200).json({ url: accountLink.url });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
