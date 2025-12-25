import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } catch (error) {
            console.error('Firebase admin init error', error);
        }
    } else {
        admin.initializeApp();
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();
