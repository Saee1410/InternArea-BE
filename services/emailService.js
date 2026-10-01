import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import { BrevoClient } from "@getbrevo/brevo";

// =====================================================
// BREVO CLIENT INITIALIZATION (HTTPS PORT 443)
// =====================================================

let brevo = null;

if (process.env.BREVO_API_KEY) {
  try {
    brevo = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY.trim(),
    });
    console.log("✅ [EMAIL-INIT] Brevo HTTPS API initialized (Active for port-safe delivery)");
  } catch (err) {
    console.error("❌ [EMAIL-INIT] Failed to initialize Brevo client:", err.message);
  }
} else {
  console.log("ℹ️ [EMAIL-INIT] No BREVO_API_KEY found in env. Falling back to Nodemailer SMTP.");
}

// =====================================================
// GMAIL SMTP TRANSPORTER (FALLBACK)
// =====================================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 8000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// =====================================================
// CENTRAL DISPATCH HELPER (BREVO FIRST -> SMTP FALLBACK)
// =====================================================

const dispatchEmail = async ({ to, subject, htmlContent }) => {
  const startTime = Date.now();
  const senderEmail = process.env.MAIL_USER || "saivijaybhosale@gmail.com";

  console.log(`\n📨 [EMAIL-DISPATCH-START]`);
  console.log(`   ├─ To: ${to}`);
  console.log(`   ├─ Subject: "${subject}"`);
  console.log(`   └─ Sender: ${senderEmail}`);

  // 1. Try Brevo HTTPS API first if API key is provided
  if (process.env.BREVO_API_KEY) {
    try {
      if (!brevo) {
        brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY.trim() });
      }

      console.log(`   ├─ Sending via Brevo HTTPS API (Port 443)...`);
      const response = await brevo.transactionalEmails.sendTransacEmail({
        subject,
        htmlContent,
        sender: {
          name: "InternArea",
          email: senderEmail,
        },
        to: [{ email: to }],
      });

      const duration = Date.now() - startTime;
      console.log(`✅ [BREVO-API-SUCCESS] (${duration}ms) Message ID: ${response.messageId || "Delivered"}\n`);
      return true;
    } catch (brevoError) {
      const duration = Date.now() - startTime;
      console.error(`❌ [BREVO-API-ERROR] (${duration}ms):`, brevoError?.message || brevoError);
      console.log(`   └─ Attempting Nodemailer fallback...`);
    }
  }

  // 2. Fallback to Nodemailer SMTP
  try {
    console.log(`   ├─ Sending via Nodemailer SMTP...`);
    const info = await transporter.sendMail({
      from: `"InternArea" <${senderEmail}>`,
      to,
      subject,
      html: htmlContent,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ [SMTP-SUCCESS] (${duration}ms) Message ID: ${info.messageId}\n`);
    return true;
  } catch (smtpError) {
    const duration = Date.now() - startTime;
    console.error(`❌ [SMTP-ERROR] (${duration}ms): ${smtpError.message}\n`);
    return false;
  }
};

// =====================================================
// SEND RESUME / LOGIN OTP EMAIL
// =====================================================

export const sendOTPEmail = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #008BDC;">InternArea Verification</h2>
      <p>Your OTP for verification is:</p>
      <h1 style="letter-spacing: 8px; text-align: center; background: #f4f4f4; padding: 15px; border-radius: 8px;">
        ${otp}
      </h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p style="color: #666;">If you did not request this OTP, please ignore this email.</p>
    </div>
  `;

  return await dispatchEmail({
    to: email,
    subject: "InternArea - Email Verification OTP",
    htmlContent,
  });
};

// =====================================================
// SEND FORGOT PASSWORD EMAIL
// =====================================================

export const sendForgotPasswordEmail = async (email, newPassword) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #008BDC;">Password Reset</h2>
      <p>Your new password is:</p>
      <h2 style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px;">
        ${newPassword}
      </h2>
      <p>Please login using this password and change it from your profile.</p>
      <p style="color: #666;">If you did not request a password reset, please contact support immediately.</p>
    </div>
  `;

  return await dispatchEmail({
    to: email,
    subject: "InternArea - Password Reset",
    htmlContent,
  });
};

// =====================================================
// SEND FRENCH LANGUAGE OTP EMAIL
// =====================================================

export const sendFrenchLanguageOTP = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #008BDC;">French Language Verification</h2>
      <p>You requested to switch your InternArea language to French.</p>
      <p>Your verification OTP is:</p>
      <h1 style="letter-spacing: 8px; text-align: center; background: #f4f4f4; padding: 15px; border-radius: 8px;">
        ${otp}
      </h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p style="color: #666;">If you did not request this verification, please ignore this email.</p>
    </div>
  `;

  return await dispatchEmail({
    to: email,
    subject: "InternArea - French Language OTP Verification",
    htmlContent,
  });
};

// =====================================================
// SEND SUBSCRIPTION INVOICE EMAIL
// =====================================================

export const sendSubscriptionInvoiceEmail = async (
  email,
  plan,
  amount,
  paymentId,
  orderId,
  startDate,
  endDate,
) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 10px;">
      <h2 style="color: #1976d2;">InternArea Subscription</h2>
      <p>Hello,</p>
      <p>Your subscription payment was successful and your plan has been activated.</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Payment Details</h3>
        <p><strong>Plan:</strong> ${plan.toUpperCase()}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString("en-IN")}</p>
        <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString("en-IN")}</p>
      </div>
      <p>Thank you for choosing InternArea.</p>
      <p style="color: #666;">This email serves as your subscription payment confirmation.</p>
    </div>
  `;

  return await dispatchEmail({
    to: email,
    subject: "InternArea - Subscription Payment Successful",
    htmlContent,
  });
};
