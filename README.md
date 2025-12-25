# Charge360

Charge360 is a comprehensive Electric Vehicle (EV) charging station management platform. It consists of a cross-platform mobile application built with Ionic & Angular, and a serverless backend API hosted on Vercel.

## Features

-   **User Features:**
    -   **Find Stations:** Browse and locate EV charging stations.
    -   **Bookings:** Reserve charging slots at stations.
    -   **Subscription Plans:** Manage subscriptions (Free vs. Gold).
    -   **Payments:** Secure payments via Stripe.
    -   **Profile:** Manage user details and preferences.
-   **Business/Station Owner Features:**
    -   **Add Station:** Register and list new charging stations.
    -   **Wallet:** View earnings and manage payouts via Stripe Express.
    -   **Onboarding:** Easy business onboarding flow.

## Tech Stack

### Frontend (Mobile App)
-   **Framework:** [Ionic Framework 8](https://ionicframework.com/)
-   **Core:** [Angular 20](https://angular.io/)
-   **Native Runtime:** [Capacitor 8](https://capacitorjs.com/) (iOS & Android)
-   **Styling:** SCSS, Ionic Components

### Backend (API)
-   **Runtime:** Node.js (Vercel Serverless Functions)
-   **Payments:** [Stripe](https://stripe.com/)
-   **Database/Auth:** [Firebase](https://firebase.google.com/) (Admin SDK)

## Project Structure

```
Charge360/
├── app/            # Ionic/Angular Frontend Application
│   ├── src/        # Source code
│   ├── android/    # Native Android project
│   ├── ios/        # Native iOS project
│   └── ...
├── api/            # Backend Serverless Functions
│   ├── create-checkout-session.ts
│   ├── onboard-business.ts
│   └── ...
└── vercel.json     # Vercel deployment configuration
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (Latest LTS recommended)
-   [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Charge360
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd app
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ../api
    npm install
    ```

## Running the Application

### Frontend (Ionic App)

To run the app in your browser:
```bash
cd app
ionic serve
```

To run on a connected Android device:
```bash
cd app
ionic cap run android
```

To run on a connected iOS device:
```bash
cd app
ionic cap run ios
```

### Backend (API)

The API is designed to be deployed on Vercel. For local development, you can use the Vercel CLI.

```bash
npm install -g vercel
vercel dev
```

## Building for Production

### Android
```bash
cd app
ionic cap build android
```
Open the `android` folder in Android Studio to sign and build the release APK/Bundle.

### iOS
```bash
cd app
ionic cap build ios
```
Open the `ios` folder in Xcode to archive and publish.

## Configuration

### Environment Variables
Ensure you set up your `.env` files or environment variables in your deployment platform (Vercel/Firebase) for:
-   `STRIPE_SECRET_KEY`
-   `FIREBASE_CREDENTIALS`
-   Other service keys...
