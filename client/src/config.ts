// API configuration
export const config = {
  // Change this to your Render.com API URL once deployed
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'YOUR_RENDER_API_URL' // You'll add this after deploying to Render
    : 'http://localhost:3000',
  
  // Firebase config (if you're using Firebase for storage)
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  }
}
