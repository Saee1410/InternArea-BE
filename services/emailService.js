import dns from "dns";
import nodemailer from "nodemailer";

// Force IPv4 first
dns.setDefaultResultOrder("ipv4first");

console.log("📧 MAIL_USER exists:", !!process.env.MAIL_USER);
console.log("🔑 MAIL_PASS exists:", !!process.env.MAIL_PASS);

const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port: 587,
secure: false,

auth: {
user: process.env.MAIL_USER,
pass: process.env.MAIL_PASS,
},

tls: {
rejectUnauthorized: false,
},
});

// SMTP Verify
transporter.verify((error, success) => {
console.log("================================");

if (error) {
console.error("❌ SMTP VERIFY FAILED");
console.error(error);
} else {
console.log("✅ SMTP READY");
}

console.log("================================");
});

// Common Send Function
export const sendEmail = async ({
to,
subject,
html,
}) => {
try {

const info = await transporter.sendMail({
from: `"InternArea" <${process.env.MAIL_USER}>`,
to,
subject,
html,
});

console.log("✅ EMAIL SENT");
console.log(info.messageId);

return info;

} catch (error) {

console.error("❌ EMAIL SEND FAILED");
console.error(error);

throw error;
}
};

// Login OTP
export const sendOTPEmail = async (email, otp) => {

return sendEmail({
to: email,

subject: "InternArea - Login OTP",

html: `
<h2>InternArea Login OTP</h2>

<p>Your OTP:</p>

<h1>${otp}</h1>

<p>Valid for 5 minutes.</p>
`,
});
};

// Forgot Password
export const sendForgotPasswordEmail = async (
email,
password
) => {

return sendEmail({
to: email,

subject: "InternArea - Password Reset",

html: `
<h2>Password Reset</h2>

<p>Your new password:</p>

<h1>${password}</h1>
`,
});
};


// import nodemailer from "nodemailer";

// // =====================================================
// // ENV CHECK
// // =====================================================

// console.log("📧 MAIL_USER exists:", !!process.env.MAIL_USER);
// console.log("🔑 MAIL_PASS exists:", !!process.env.MAIL_PASS);
// console.log("📧 MAIL_USER:", process.env.MAIL_USER || "NOT SET");

// // =====================================================
// // GMAIL TRANSPORTER
// // =====================================================

// const transporter = nodemailer.createTransport({
// host: "smtp.gmail.com",
// port: 587,
// secure: false,
// logger: true,
// debug: true,
//  
// auth: {
// user: process.env.MAIL_USER,
// pass: process.env.MAIL_PASS,
// },
// });

// // =====================================================
// // VERIFY SMTP
// // =====================================================


// transporter.verify((error, success) => {

//     console.log("=================================");
//     console.log("📧 CHECKING GMAIL SMTP");
//     console.log("=================================");

//     if (error) {

//         console.error("❌ GMAIL SMTP VERIFY FAILED");
//         console.error("Name:", error.name);
//         console.error("Message:", error.message);
//         console.error("Code:", error.code);
//         console.error("Command:", error.command);
//         console.error("Response:", error.response);
//         console.error("Response Code:", error.responseCode);
//         console.error("Full Error:", error);

//     } else {

//         console.log("✅✅ GMAIL SMTP VERIFIED SUCCESSFULLY");
//         console.log("SMTP connection is working.");

//     }

//     console.log("=================================");
// });


// // =====================================================
// // COMMON EMAIL SENDER
// // =====================================================

// const sendEmail = async (mailOptions) => {
//     try {
//         console.log("📤 ABOUT TO SEND EMAIL");
//         console.log("📧 From:", mailOptions.from);
//         console.log("📧 To:", mailOptions.to);
//         console.log("📧 Subject:", mailOptions.subject);

//         const info = await transporter.sendMail(mailOptions);

//         console.log("=================================");
//         console.log("✅ EMAIL SENT SUCCESSFULLY");
//         console.log("📨 Message ID:", info.messageId);
//         console.log("📡 Response:", info.response);
//         console.log("=================================");

//         return {
//             success: true,
//             messageId: info.messageId,
//         };

//     } catch (error) {

//         console.error("=================================");
//         console.error("❌❌❌ EMAIL SEND FAILED ❌❌❌");
//         console.error("Error Name:", error.name);
//         console.error("Error Message:", error.message);
//         console.error("Error Code:", error.code);
//         console.error("Error Command:", error.command);
//         console.error("Error Response:", error.response);
//         console.error("Error Response Code:", error.responseCode);
//         console.error("Full Error:", error);
//         console.error("=================================");

//         throw error;
//     }
// };
// // =====================================================
// // LOGIN OTP
// // =====================================================

// export const sendOTPEmail = async (email, otp) => {

//     console.log("📧 Sending LOGIN OTP");
//     console.log("📧 To:", email);

//     return await sendEmail({
//         from: `"InternArea" <${process.env.MAIL_USER}>`,

//         to: email,

//         subject: "InternArea - Login OTP",

//         html: `
//             <div style="
//                 font-family: Arial, sans-serif;
//                 padding: 20px;
//                 max-width: 600px;
//                 margin: auto;
//             ">

//                 <h2 style="color:#008BDC;">
//                     InternArea Login Verification
//                 </h2>

//                 <p>
//                     Your OTP for login is:
//                 </p>

//                 <h1 style="
//                     letter-spacing: 8px;
//                     text-align: center;
//                     background: #f4f4f4;
//                     padding: 15px;
//                     border-radius: 8px;
//                 ">
//                     ${otp}
//                 </h1>

//                 <p>
//                     This OTP is valid for 5 minutes.
//                 </p>

//                 <p>
//                     If you did not request this login,
//                     please ignore this email.
//                 </p>

//             </div>
//         `,
//     });
// };

// // =====================================================
// // FORGOT PASSWORD
// // =====================================================

// export const sendForgotPasswordEmail = async (
//     email,
//     newPassword
// ) => {

//     return await sendEmail({
//         from: `"InternArea" <${process.env.MAIL_USER}>`,

//         to: email,

//         subject: "InternArea - Password Reset",

//         html: `
//             <div style="
//                 font-family: Arial, sans-serif;
//                 padding: 20px;
//                 max-width: 600px;
//                 margin: auto;
//             ">

//                 <h2>Password Reset</h2>

//                 <p>Your new password is:</p>

//                 <h2 style="
//                     background:#f4f4f4;
//                     padding:15px;
//                     text-align:center;
//                 ">
//                     ${newPassword}
//                 </h2>

//                 <p>
//                     Please login using this password
//                     and change it from your profile.
//                 </p>

//             </div>
//         `,
//     });
// };

// // =====================================================
// // FRENCH OTP
// // =====================================================

// export const sendFrenchLanguageOTP = async (
//     email,
//     otp
// ) => {

//     return await sendEmail({
//         from: `"InternArea" <${process.env.MAIL_USER}>`,

//         to: email,

//         subject:
//             "InternArea - French Language OTP Verification",

//         html: `
//             <div style="
//                 font-family:Arial;
//                 padding:20px;
//                 max-width:600px;
//                 margin:auto;
//             ">

//                 <h2>French Language Verification</h2>

//                 <p>
//                     Your verification OTP is:
//                 </p>

//                 <h1 style="
//                     letter-spacing:8px;
//                     text-align:center;
//                     background:#f4f4f4;
//                     padding:15px;
//                 ">
//                     ${otp}
//                 </h1>

//                 <p>
//                     This OTP is valid for 5 minutes.
//                 </p>

//             </div>
//         `,
//     });
// };

// // =====================================================
// // SUBSCRIPTION INVOICE
// // =====================================================

// export const sendSubscriptionInvoiceEmail = async (
//     email,
//     plan,
//     amount,
//     paymentId,
//     orderId,
//     startDate,
//     endDate
// ) => {

//     return await sendEmail({
//         from: `"InternArea" <${process.env.MAIL_USER}>`,

//         to: email,

//         subject:
//             "InternArea - Subscription Payment Successful",

//         html: `
//             <div style="
//                 font-family:Arial;
//                 padding:20px;
//                 max-width:600px;
//                 margin:auto;
//                 border:1px solid #e5e7eb;
//                 border-radius:10px;
//             ">

//                 <h2 style="color:#1976d2;">
//                     InternArea Subscription
//                 </h2>

//                 <p>Hello,</p>

//                 <p>
//                     Your subscription payment was successful.
//                 </p>

//                 <div style="
//                     background:#f8fafc;
//                     padding:20px;
//                     border-radius:8px;
//                 ">

//                     <h3>Payment Details</h3>

//                     <p>
//                         <strong>Plan:</strong>
//                         ${String(plan).toUpperCase()}
//                     </p>

//                     <p>
//                         <strong>Amount:</strong>
//                         ₹${amount}
//                     </p>

//                     <p>
//                         <strong>Payment ID:</strong>
//                         ${paymentId}
//                     </p>

//                     <p>
//                         <strong>Order ID:</strong>
//                         ${orderId}
//                     </p>

//                     <p>
//                         <strong>Start Date:</strong>
//                         ${new Date(startDate).toLocaleDateString("en-IN")}
//                     </p>

//                     <p>
//                         <strong>End Date:</strong>
//                         ${new Date(endDate).toLocaleDateString("en-IN")}
//                     </p>

//                 </div>

//                 <p>
//                     Thank you for choosing InternArea.
//                 </p>

//             </div>
//         `,
//     });
// };


// import nodemailer from "nodemailer";

// // =====================================================
// // GMAIL SMTP CONFIGURATION
// // =====================================================

// // Debug environment variables
// // IMPORTANT: Never print MAIL_PASS itself.
// console.log(
//     "📧 MAIL_USER exists:",
//     !!process.env.MAIL_USER
// );

// console.log(
//     "🔑 MAIL_PASS exists:",
//     !!process.env.MAIL_PASS
// );

// console.log(
//     "📧 MAIL_USER:",
//     process.env.MAIL_USER || "NOT SET"
// );

// // =====================================================
// // GMAIL SMTP TRANSPORTER
// // =====================================================

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });

// console.log("📧 Creating Gmail transporter...");

// transporter.verify()
//     .then(() => {
//         console.log("✅✅✅ GMAIL SMTP VERIFIED SUCCESSFULLY");
//     })
//     .catch((error) => {
//         console.error("❌❌❌ GMAIL SMTP VERIFY FAILED");
//         console.error("MESSAGE:", error.message);
//         console.error("CODE:", error.code);
//         console.error("COMMAND:", error.command);
//         console.error("RESPONSE:", error.response);
//     });

// // const transporter = nodemailer.createTransport({
// //     service: "gmail",

// //     auth: {
// //         user: process.env.MAIL_USER,
// //         pass: process.env.MAIL_PASS,
// //     },
// // });

// // // =====================================================
// // // VERIFY GMAIL CONNECTION
// // // =====================================================

// // transporter.verify((error, success) => {
// //     if (error) {
// //         console.error("❌ Gmail SMTP connection failed");
// //         console.error("Error message:", error.message);
// //         console.error("Error code:", error.code);
// //         console.error("Error command:", error.command);
// //         console.error("Error response:", error.response);
// //         console.error("Full error:", error);
// //     } else {
// //         console.log("✅ Gmail SMTP is ready");
// //     }
// // });

// // =====================================================
// // SEND RESUME OTP EMAIL
// // =====================================================

// export const sendOTPEmail = async (email, otp) => {
//     try {
//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - Email Verification OTP",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">

//                     <h2>InternArea</h2>

//                     <p>
//                         Your OTP for email verification is:
//                     </p>

//                     <h1 style="
//                         letter-spacing: 8px;
//                         text-align: center;
//                         background: #f4f4f4;
//                         padding: 15px;
//                     ">
//                         ${otp}
//                     </h1>

//                     <p>
//                         This OTP is valid for 5 minutes.
//                     </p>

//                     <p>
//                         If you did not request this OTP,
//                         please ignore this email.
//                     </p>

//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log("✅ OTP email sent successfully");
//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {
//         console.error("❌ OTP Email Error");
//         console.error("Message:", error.message);
//         console.error("Code:", error.code);
//         console.error("Command:", error.command);
//         console.error("Response:", error.response);
//         console.error("Full error:", error);

//         return false;
//     }
// };

// // =====================================================
// // SEND FORGOT PASSWORD EMAIL
// // =====================================================

// export const sendForgotPasswordEmail = async (
//     email,
//     newPassword
// ) => {
//     try {
//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - Password Reset",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">

//                     <h2>Password Reset</h2>

//                     <p>
//                         Your new password is:
//                     </p>

//                     <h2 style="
//                         background: #f4f4f4;
//                         padding: 15px;
//                         text-align: center;
//                     ">
//                         ${newPassword}
//                     </h2>

//                     <p>
//                         Please login using this password
//                         and change it from your profile.
//                     </p>

//                     <p>
//                         If you did not request a password reset,
//                         please contact support immediately.
//                     </p>

//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log(
//             "✅ Forgot Password email sent successfully"
//         );

//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {
//         console.error("❌ Forgot Password Email Error");
//         console.error("Message:", error.message);
//         console.error("Code:", error.code);
//         console.error("Command:", error.command);
//         console.error("Response:", error.response);

//         return false;
//     }
// };

// // =====================================================
// // SEND FRENCH LANGUAGE OTP EMAIL
// // =====================================================

// export const sendFrenchLanguageOTP = async (
//     email,
//     otp
// ) => {
//     try {
//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - French Language OTP Verification",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">

//                     <h2>French Language Verification</h2>

//                     <p>
//                         You requested to switch your
//                         InternArea language to French.
//                     </p>

//                     <p>
//                         Your verification OTP is:
//                     </p>

//                     <h1 style="
//                         letter-spacing: 8px;
//                         text-align: center;
//                         background: #f4f4f4;
//                         padding: 15px;
//                     ">
//                         ${otp}
//                     </h1>

//                     <p>
//                         This OTP is valid for 5 minutes.
//                     </p>

//                     <p>
//                         If you did not request this verification,
//                         please ignore this email.
//                     </p>

//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log(
//             "✅ French Language OTP email sent successfully"
//         );

//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {
//         console.error("❌ French Language OTP Email Error");
//         console.error("Message:", error.message);
//         console.error("Code:", error.code);
//         console.error("Command:", error.command);
//         console.error("Response:", error.response);

//         return false;
//     }
// };

// // =====================================================
// // SEND SUBSCRIPTION INVOICE EMAIL
// // =====================================================

// export const sendSubscriptionInvoiceEmail = async (
//     email,
//     plan,
//     amount,
//     paymentId,
//     orderId,
//     startDate,
//     endDate
// ) => {
//     try {
//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - Subscription Payment Successful",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                     border: 1px solid #e5e7eb;
//                     border-radius: 10px;
//                 ">

//                     <h2 style="color: #1976d2;">
//                         InternArea Subscription
//                     </h2>

//                     <p>
//                         Hello,
//                     </p>

//                     <p>
//                         Your subscription payment was successful
//                         and your plan has been activated.
//                     </p>

//                     <div style="
//                         background: #f8fafc;
//                         padding: 20px;
//                         border-radius: 8px;
//                         margin: 20px 0;
//                     ">

//                         <h3>Payment Details</h3>

//                         <p>
//                             <strong>Plan:</strong>
//                             ${plan.toUpperCase()}
//                         </p>

//                         <p>
//                             <strong>Amount:</strong>
//                             ₹${amount}
//                         </p>

//                         <p>
//                             <strong>Payment ID:</strong>
//                             ${paymentId}
//                         </p>

//                         <p>
//                             <strong>Order ID:</strong>
//                             ${orderId}
//                         </p>

//                         <p>
//                             <strong>Start Date:</strong>
//                             ${new Date(
//                                 startDate
//                             ).toLocaleDateString("en-IN")}
//                         </p>

//                         <p>
//                             <strong>End Date:</strong>
//                             ${new Date(
//                                 endDate
//                             ).toLocaleDateString("en-IN")}
//                         </p>

//                     </div>

//                     <p>
//                         Thank you for choosing InternArea.
//                     </p>

//                     <p style="color: #666;">
//                         This email serves as your subscription
//                         payment confirmation.
//                     </p>

//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log(
//             "✅ Subscription Invoice email sent successfully"
//         );

//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {
//         console.error("❌ Subscription Invoice Email Error");
//         console.error("Message:", error.message);
//         console.error("Code:", error.code);
//         console.error("Command:", error.command);
//         console.error("Response:", error.response);

//         return false;
//     }
// };


// import nodemailer from "nodemailer";

// // =====================================================
// // GMAIL SMTP TRANSPORTER
// // =====================================================

//    console.log("📧 MAIL_USER exists:", !!process.env.MAIL_USER);
// console.log("🔑 MAIL_PASS exists:", !!process.env.MAIL_PASS);
// console.log("📧 MAIL_USER:", process.env.MAIL_USER);
// console.log("🔑 MAIL_PASS:", process.env.MAIL_PASS);

// const transporter = nodemailer.createTransport({
//     service: "gmail",

//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,

//     },

// });


// // =====================================================
// // VERIFY GMAIL CONNECTION
// // =====================================================
// transporter.verify((error, success) => {
//     if (error) {
//         console.error("❌ Gmail SMTP connection failed");
//         console.error("Error code:", error.code);
//         console.error("Error command:", error.command);
//         console.error("Error response:", error.response);
//         console.error("Full error:", error);
//     } else {
//         console.log("✅ Gmail SMTP is ready");
//     }
// });

// // =====================================================
// // SEND RESUME OTP EMAIL
// // =====================================================

// export const sendOTPEmail = async (email, otp) => {

//     try {

//         const mailOptions = {

//             from: `"InternArea" <${process.env.MAIL_USER}>`,

//             to: email,

//             subject: "Resume Builder - Email Verification OTP",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">

//                     <h2>Resume Builder</h2>

//                     <p>
//                         Your OTP for email verification is:
//                     </p>

//                     <h1 style="
//                         letter-spacing: 8px;
//                         text-align: center;
//                         background: #f4f4f4;
//                         padding: 15px;
//                     ">
//                         ${otp}
//                     </h1>

//                     <p>
//                         This OTP is valid for 5 minutes.
//                     </p>

//                     <p>
//                         If you did not request this OTP,
//                         please ignore this email.
//                     </p>

//                 </div>
//             `,
//         };


//         const info = await transporter.sendMail(mailOptions);


//         console.log("✅ Resume OTP email sent successfully");
//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);


//         return true;

//     } catch (error) {
//     console.error("❌ Resume OTP Email Error");
//     console.error("Message:", error.message);
//     console.error("Code:", error.code);
//     console.error("Command:", error.command);
//     console.error("Response:", error.response);
//     console.error("Full error:", error);

//     return false;
// }
// };


// // =====================================================
// // SEND FORGOT PASSWORD EMAIL
// // =====================================================

// export const sendForgotPasswordEmail = async (
//     email,
//     newPassword
// ) => {

//     try {

//         const mailOptions = {

//             from: `"InternArea" <${process.env.MAIL_USER}>`,

//             to: email,

//             subject: "Internshala - Password Reset",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">

//                     <h2>Password Reset</h2>

//                     <p>
//                         Your new password is:
//                     </p>

//                     <h2 style="
//                         background: #f4f4f4;
//                         padding: 15px;
//                         text-align: center;
//                     ">
//                         ${newPassword}
//                     </h2>

//                     <p>
//                         Please login using this password
//                         and change it from your profile.
//                     </p>

//                     <p>
//                         If you did not request a password reset,
//                         please contact support immediately.
//                     </p>

//                 </div>
//             `,
//         };


//         const info = await transporter.sendMail(mailOptions);


//         console.log(
//             "✅ Forgot Password email sent successfully"
//         );

//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);


//         return true;

//     } catch (error) {

//         console.error(
//             "❌ Forgot Password Email Error:",
//             error.message
//         );

//         return false;
//     }
// };

// /// SEND FRENC LANGUAGE OTP EMAIL

// export const sendFrenchLanguageOTP = async (email, otp) => {
//     try {
//         const mailOptions = {
//             from : `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - Freanch Language OTP Verification",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">
//                 <h2>Freanch Language Verification</h2>
//                 <p>
//                   you requested to switch your InterArea language
//                   to French.
//                 </p>

//                 <p>
//                     Your verification OTP is:
//                 </p>

//                 <h1 style="
//                     letter-spacing: 8px;
//                     text-align: center;
//                     background: #f4f4f4;
//                     padding: 15px;
//                 ">
//                     ${otp}
//                 </h1>

//                 <p>
//                  This OTP is valid for 5 minutes.
//                  </p> 
//                  <p>
//                   If you did not request this verification, please ignore this email. 
//                   </p>
//                 </div>
//                 `,

//         };
//         const info = await transporter.sendMail(mailOptions);

//         console.log("✅ French Language OTP email sent successfully");
//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {
//             console.error(
//                 "Freanch Language OTP Email Error:",
//                 error.message
//             );

//             return false;
        
//     }
// }


// // =====================================================
// // SEND SUBSCRIPTION INVOICE EMAIL
// // =====================================================

// export const sendSubscriptionInvoiceEmail = async (
//     email,
//     plan,
//     amount,
//     paymentId,
//     orderId,
//     startDate,
//     endDate
// ) => {

//     try {

//         const mailOptions = {

//             from: `"InternArea" <${process.env.MAIL_USER}>`,

//             to: email,

//             subject: "InternArea - Subscription Payment Successful",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                     border: 1px solid #e5e7eb;
//                     border-radius: 10px;
//                 ">

//                     <h2 style="color: #1976d2;">
//                         InternArea Subscription
//                     </h2>

//                     <p>
//                         Hello,
//                     </p>

//                     <p>
//                         Your subscription payment was successful
//                         and your plan has been activated.
//                     </p>

//                     <div style="
//                         background: #f8fafc;
//                         padding: 20px;
//                         border-radius: 8px;
//                         margin: 20px 0;
//                     ">

//                         <h3>Payment Details</h3>

//                         <p>
//                             <strong>Plan:</strong>
//                             ${plan.toUpperCase()}
//                         </p>

//                         <p>
//                             <strong>Amount:</strong>
//                             ₹${amount}
//                         </p>

//                         <p>
//                             <strong>Payment ID:</strong>
//                             ${paymentId}
//                         </p>

//                         <p>
//                             <strong>Order ID:</strong>
//                             ${orderId}
//                         </p>

//                         <p>
//                             <strong>Start Date:</strong>
//                             ${new Date(startDate).toLocaleDateString("en-IN")}
//                         </p>

//                         <p>
//                             <strong>End Date:</strong>
//                             ${new Date(endDate).toLocaleDateString("en-IN")}
//                         </p>

//                     </div>

//                     <p>
//                         Thank you for choosing InternArea.
//                     </p>

//                     <p style="color: #666;">
//                         This email serves as your subscription
//                         payment confirmation.
//                     </p>

//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log(
//             "✅ Subscription Invoice email sent successfully"
//         );

//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {

//         console.error(
//             "❌ Subscription Invoice Email Error:",
//             error.message
//         );

//         return false;
//     }
// };


// import nodemailer from "nodemailer";

// // =====================================================
// // GMAIL SMTP TRANSPORTER
// // =====================================================

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });

// transporter.verify((error) => {

//     if (error) {

//         console.error(
//             "❌ Gmail SMTP connection failed:"
//         );

//         console.error(error);

//     } else {

//         console.log(
//             "✅ Gmail SMTP is ready"
//         );

//     }

// });

// // =====================================================
// // SEND RESUME OTP EMAIL
// // =====================================================

// export const sendOTPEmail = async (email, otp) => {
//     try {
//         console.log("📧 sendOTPEmail called");
//         console.log("📧 Email:", email);
//         console.log("🔢 OTP:", otp);

//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "Resume Builder - Email Verification OTP",
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px;">
//                     <h2>Resume Builder</h2>
//                     <p>Your OTP for email verification is:</p>
//                     <h1 style="letter-spacing: 8px; text-align: center;">
//                         ${otp}
//                     </h1>
//                     <p>This OTP is valid for 5 minutes.</p>
//                 </div>
//             `,
//         };

//         console.log("📤 Calling transporter.sendMail()...");

//         const info = await transporter.sendMail(mailOptions);

//         console.log("✅ EMAIL SENT");
//         console.log("📨 Message ID:", info.messageId);
//         console.log("📨 Response:", info.response);

//         return true;

//     } catch (error) {
//         console.error("❌ EMAIL FAILED");
//         console.error(error);
//         return false;
//     }
// };
// // =====================================================
// // SEND FORGOT PASSWORD EMAIL
// // =====================================================

// export const sendForgotPasswordEmail = async (email, newPassword) => {
//     try {
//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "Internshala - Password Reset",
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
//                     <h2>Password Reset</h2>
//                     <p>Your new password is:</p>
//                     <h2 style="background: #f4f4f4; padding: 15px; text-align: center;">
//                         ${newPassword}
//                     </h2>
//                     <p>Please login using this password and change it from your profile.</p>
//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log("✅ Forgot Password email sent successfully to:", email);
//         return true;

//     } catch (error) {
//         console.error("❌ Forgot Password Email Error:", error.message);
//         return false;
//     }
// };

// // =====================================================
// // SEND FRENCH LANGUAGE OTP EMAIL
// // =====================================================

// export const sendFrenchLanguageOTP = async (email, otp) => {
//     try {
//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - French Language OTP Verification",
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
//                     <h2>French Language Verification</h2>
//                     <p>You requested to switch your InternArea language to French.</p>
//                     <p>Your verification OTP is:</p>
//                     <h1 style="letter-spacing: 8px; text-align: center; background: #f4f4f4; padding: 15px;">
//                         ${otp}
//                     </h1>
//                     <p>This OTP is valid for 5 minutes.</p>
//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log("✅ French Language OTP email sent successfully to:", email);
//         return true;

//     } catch (error) {
//         console.error("❌ French Language OTP Email Error:", error.message);
//         return false;
//     }
// };

// // =====================================================
// // SEND SUBSCRIPTION INVOICE EMAIL
// // =====================================================

// export const sendSubscriptionInvoiceEmail = async (
//     email,
//     plan,
//     amount,
//     paymentId,
//     orderId,
//     startDate,
//     endDate
// ) => {
//     try {
//         const mailOptions = {
//             from: `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - Subscription Payment Successful",
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 10px;">
//                     <h2 style="color: #1976d2;">InternArea Subscription</h2>
//                     <p>Your subscription payment was successful and your plan has been activated.</p>
//                     <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                         <h3>Payment Details</h3>
//                         <p><strong>Plan:</strong> ${plan.toUpperCase()}</p>
//                         <p><strong>Amount:</strong> ₹${amount}</p>
//                         <p><strong>Payment ID:</strong> ${paymentId}</p>
//                         <p><strong>Order ID:</strong> ${orderId}</p>
//                         <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString("en-IN")}</p>
//                         <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString("en-IN")}</p>
//                     </div>
//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log("✅ Subscription Invoice email sent successfully to:", email);
//         return true;

//     } catch (error) {
//         console.error("❌ Subscription Invoice Email Error:", error.message);
//         return false;
//     }
// };



// import nodemailer from "nodemailer";

// // =====================================================
// // GMAIL SMTP TRANSPORTER
// // =====================================================

// const transporter = nodemailer.createTransport({
//     service: "gmail",

//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });


// // =====================================================
// // VERIFY GMAIL CONNECTION
// // =====================================================

// transporter.verify((error, success) => {

//     if (error) {
//         console.error(
//             "❌ Gmail SMTP connection failed:",
//             error.message
//         );
//     } else {
//         console.log("✅ Gmail SMTP is ready");
//     }

// });


// // =====================================================
// // SEND RESUME OTP EMAIL
// // =====================================================

// export const sendOTPEmail = async (email, otp) => {

//     try {

//         const mailOptions = {

//             from: `"InternArea" <${process.env.MAIL_USER}>`,

//             to: email,

//             subject: "Resume Builder - Email Verification OTP",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">

//                     <h2>Resume Builder</h2>

//                     <p>
//                         Your OTP for email verification is:
//                     </p>

//                     <h1 style="
//                         letter-spacing: 8px;
//                         text-align: center;
//                         background: #f4f4f4;
//                         padding: 15px;
//                     ">
//                         ${otp}
//                     </h1>

//                     <p>
//                         This OTP is valid for 5 minutes.
//                     </p>

//                     <p>
//                         If you did not request this OTP,
//                         please ignore this email.
//                     </p>

//                 </div>
//             `,
//         };


//         const info = await transporter.sendMail(mailOptions);


//         console.log("✅ Resume OTP email sent successfully");
//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);


//         return true;

//     } catch (error) {

//         console.error(
//             "❌ Resume OTP Email Error:",
//             error.message
//         );

//         return false;
//     }
// };


// // =====================================================
// // SEND FORGOT PASSWORD EMAIL
// // =====================================================

// export const sendForgotPasswordEmail = async (
//     email,
//     newPassword
// ) => {

//     try {

//         const mailOptions = {

//             from: `"InternArea" <${process.env.MAIL_USER}>`,

//             to: email,

//             subject: "Internshala - Password Reset",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">

//                     <h2>Password Reset</h2>

//                     <p>
//                         Your new password is:
//                     </p>

//                     <h2 style="
//                         background: #f4f4f4;
//                         padding: 15px;
//                         text-align: center;
//                     ">
//                         ${newPassword}
//                     </h2>

//                     <p>
//                         Please login using this password
//                         and change it from your profile.
//                     </p>

//                     <p>
//                         If you did not request a password reset,
//                         please contact support immediately.
//                     </p>

//                 </div>
//             `,
//         };


//         const info = await transporter.sendMail(mailOptions);


//         console.log(
//             "✅ Forgot Password email sent successfully"
//         );

//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);


//         return true;

//     } catch (error) {

//         console.error(
//             "❌ Forgot Password Email Error:",
//             error.message
//         );

//         return false;
//     }
// };

// /// SEND FRENC LANGUAGE OTP EMAIL

// export const sendFrenchLanguageOTP = async (email, otp) => {
//     try {
//         const mailOptions = {
//             from : `"InternArea" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: "InternArea - Freanch Language OTP Verification",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                 ">
//                 <h2>Freanch Language Verification</h2>
//                 <p>
//                   you requested to switch your InterArea language
//                   to French.
//                 </p>

//                 <p>
//                     Your verification OTP is:
//                 </p>

//                 <h1 style="
//                     letter-spacing: 8px;
//                     text-align: center;
//                     background: #f4f4f4;
//                     padding: 15px;
//                 ">
//                     ${otp}
//                 </h1>

//                 <p>
//                  This OTP is valid for 5 minutes.
//                  </p> 
//                  <p>
//                   If you did not request this verification, please ignore this email. 
//                   </p>
//                 </div>
//                 `,

//         };
//         const info = await transporter.sendMail(mailOptions);

//         console.log("✅ French Language OTP email sent successfully");
//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {
//             console.error(
//                 "Freanch Language OTP Email Error:",
//                 error.message
//             );

//             return false;
        
//     }
// }


// // =====================================================
// // SEND SUBSCRIPTION INVOICE EMAIL
// // =====================================================

// export const sendSubscriptionInvoiceEmail = async (
//     email,
//     plan,
//     amount,
//     paymentId,
//     orderId,
//     startDate,
//     endDate
// ) => {

//     try {

//         const mailOptions = {

//             from: `"InternArea" <${process.env.MAIL_USER}>`,

//             to: email,

//             subject: "InternArea - Subscription Payment Successful",

//             html: `
//                 <div style="
//                     font-family: Arial, sans-serif;
//                     padding: 20px;
//                     max-width: 600px;
//                     margin: auto;
//                     border: 1px solid #e5e7eb;
//                     border-radius: 10px;
//                 ">

//                     <h2 style="color: #1976d2;">
//                         InternArea Subscription
//                     </h2>

//                     <p>
//                         Hello,
//                     </p>

//                     <p>
//                         Your subscription payment was successful
//                         and your plan has been activated.
//                     </p>

//                     <div style="
//                         background: #f8fafc;
//                         padding: 20px;
//                         border-radius: 8px;
//                         margin: 20px 0;
//                     ">

//                         <h3>Payment Details</h3>

//                         <p>
//                             <strong>Plan:</strong>
//                             ${plan.toUpperCase()}
//                         </p>

//                         <p>
//                             <strong>Amount:</strong>
//                             ₹${amount}
//                         </p>

//                         <p>
//                             <strong>Payment ID:</strong>
//                             ${paymentId}
//                         </p>

//                         <p>
//                             <strong>Order ID:</strong>
//                             ${orderId}
//                         </p>

//                         <p>
//                             <strong>Start Date:</strong>
//                             ${new Date(startDate).toLocaleDateString("en-IN")}
//                         </p>

//                         <p>
//                             <strong>End Date:</strong>
//                             ${new Date(endDate).toLocaleDateString("en-IN")}
//                         </p>

//                     </div>

//                     <p>
//                         Thank you for choosing InternArea.
//                     </p>

//                     <p style="color: #666;">
//                         This email serves as your subscription
//                         payment confirmation.
//                     </p>

//                 </div>
//             `,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log(
//             "✅ Subscription Invoice email sent successfully"
//         );

//         console.log("📧 To:", email);
//         console.log("📨 Message ID:", info.messageId);

//         return true;

//     } catch (error) {

//         console.error(
//             "❌ Subscription Invoice Email Error:",
//             error.message
//         );

//         return false;
//     }
// };