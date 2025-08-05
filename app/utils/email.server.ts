import nodemailer from "nodemailer";

const transportConfig = {
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "dioscschool@gmail.com",
    pass: "qqmtgjkkvbcgavti",
  },
};

const transporter = nodemailer.createTransport(transportConfig);

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationUrl = `http://localhost:5173/verify/${token}`;

  await transporter.sendMail({
    from: "dioscschool@gmail.com",
    to: email,
    subject: "Verify your email",
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}
