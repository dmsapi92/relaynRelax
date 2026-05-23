// Direct environment variable access without dotenv in production
const isReal: boolean = false;
const realKey = "rzp_live_oGiSnIiVzpUTA1";
const realsec = "PT5lrEYAA6yNvLRgCXBq2aUx";

export const ENV = {
  MASTER_DATABASE_URL:
    process.env.MASTER_DATABASE_URL ||
    "mongodb://DmsAdmin:Whatthefq101@66.116.243.49:27017/relynrelaxMasterDB?replicaSet=rs0&authSource=DMS",
  USER_DATABASE_URL_TEMPLATE:
    process.env.USER_DATABASE_URL_TEMPLATE ||
    "mongodb://DmsAdmin:Whatthefq101@66.116.243.49:27017/{dbname}?replicaSet=rs0&authSource=DMS",
  NODE_ENV: process.env.NODE_ENV || "production",
  EMAIL_USER: process.env.EMAIL_USER || "dioscschool@gmail.com",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "qqmtgjkkvbcgavti",
  FIREBASE_API_KEY: "AIzaSyCL-Dd8jVzelGzP1iAHLuSLa4RsnboWQds",
  FIREBASE_AUTH_DOMAIN: "dmshotel-7fdc6.firebaseapp.com",
  FIREBASE_DATABASE_URL:
    "https://dmshotel-7fdc6-default-rtdb.asia-southeast1.firebasedatabase.app",
  FIREBASE_PROJECT_ID: "dmshotel-7fdc6",
  FIREBASE_STORAGE_BUCKET: "dmshotel-7fdc6.appspot.com",
  FIREBASE_MESSAGING_SENDER_ID: "939968723016",
  FIREBASE_APP_ID: "1:939968723016:web:a87fcd2d8a19d39f07007d",
  FIREBASE_MEASUREMENT_ID: "G-89QEH4KYCV",
  GEMINI_API_KEY: "AIzaSyCPyu1jYbochksRmnVo8R2vxwR69PRFVdg",
  SESSION_SECRET: "default-secret",
  FACEBOOK_ACCESS_TOKEN:
    process.env.FACEBOOK_ACCESS_TOKEN ||
    "EAAYtI1VomtcBO3VjNGuS5b45smYFvfXkK7WB43HflnYRQo3idmozVKGG5mbkGbpZBsiRKwUvSSk3d96lFdJU2ORAxIfE3ZCO5ZBgOo7zNWWRKnqdKgtdVjHOdZCB3LQMYLevRedMZAOt1QjTG3wSizefRWQr2Wda96npqWmCGBOaDT6tZAbt5ZAwM4wMrsCRdOHCAZDZD",
  RAZORPAY_KEY_ID: isReal
    ? realKey
    : process.env.RAZORPAY_KEY_ID || "rzp_test_ECbangDivaOHlp",
  RAZORPAY_KEY_SECRET: isReal
    ? realsec
    : process.env.RAZORPAY_KEY_SECRET || "fP4ReRSU6eVgz6PNn3uOgS1j",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "1234",
};
