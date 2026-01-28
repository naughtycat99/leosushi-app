const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Resend
// API key được set qua: firebase functions:secrets:set RESEND_API_KEY
// Hoặc: firebase functions:config:set resend.api_key="re_..."
// Fallback: API key mặc định (chỉ để test)
let resend;
try {
  const apiKey = process.env.RESEND_API_KEY || 
                 (functions.config().resend && functions.config().resend.api_key) ||
                 're_8aXQa5oi_JiyPDjdJDavvEREThCnFzkDZ'; // Fallback API key
  resend = new Resend(apiKey);
  console.log('✅ Resend initialized');
} catch (error) {
  console.error('❌ Failed to initialize Resend:', error);
  throw error;
}

// Email templates
const VERIFICATION_EMAIL_TEMPLATE = (name, verificationUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d4af37 0%, #c2a355 100%); color: #0b0b0c; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #d4af37; color: #0b0b0c; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LEO SUSHI</h1>
      <p>Willkommen bei LEO SUSHI!</p>
    </div>
    <div class="content">
      <h2>Hallo ${name},</h2>
      <p>Vielen Dank für Ihre Registrierung bei LEO SUSHI!</p>
      <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Button klicken:</p>
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">E-Mail-Adresse bestätigen</a>
      </div>
      <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      <p>Nach der Bestätigung erhalten Sie Ihren exklusiven Willkommensrabatt!</p>
      <p>Mit freundlichen Grüßen,<br>Das Team von LEO SUSHI</p>
    </div>
    <div class="footer">
      <p>Florastraße 10A, 13187 Berlin | +49 30 37476736</p>
    </div>
  </div>
</body>
</html>
`;

const THANK_YOU_EMAIL_TEMPLATE = (name, discountCode) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d4af37 0%, #c2a355 100%); color: #0b0b0c; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .discount-box { background: #fff; border: 3px solid #d4af37; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
    .discount-code { font-size: 32px; font-weight: bold; color: #d4af37; letter-spacing: 3px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Vielen Dank!</h1>
      <p>Ihre E-Mail wurde bestätigt</p>
    </div>
    <div class="content">
      <h2>Hallo ${name},</h2>
      <p>Vielen Dank für die Bestätigung Ihrer E-Mail-Adresse!</p>
      <p>Als Willkommensgeschenk erhalten Sie einen exklusiven Rabattcode:</p>
      <div class="discount-box">
        <p style="margin: 0; font-size: 18px; font-weight: bold;">Ihr Gutscheincode:</p>
        <div class="discount-code">${discountCode}</div>
        <p style="margin: 10px 0 0 0; color: #666;">10% Rabatt auf Ihre erste Bestellung</p>
      </div>
      <p>Verwenden Sie diesen Code beim Checkout, um Ihren Rabatt zu erhalten.</p>
      <p>Wir freuen uns, Sie bei LEO SUSHI begrüßen zu dürfen!</p>
      <p>Mit freundlichen Grüßen,<br>Das Team von LEO SUSHI</p>
    </div>
    <div class="footer">
      <p>Florastraße 10A, 13187 Berlin | +49 30 37476736</p>
    </div>
  </div>
</body>
</html>
`;

// Cloud Function: Send verification email
exports.sendVerificationEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email, name, verificationUrl } = data;

    if (!email || !name || !verificationUrl) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
    }

    const result = await resend.emails.send({
      // Email THẬT - đang dùng domain test của Resend (gửi được ngay, không cần verify)
      // Để dùng domain riêng, verify domain trong Resend và đổi thành: 'LEO SUSHI <noreply@jatodemoweb.ddns.net>'
      from: 'LEO SUSHI <onboarding@resend.dev>',
      to: email,
      subject: 'Bestätigen Sie Ihre E-Mail-Adresse - LEO SUSHI',
      html: VERIFICATION_EMAIL_TEMPLATE(name, verificationUrl),
    });

    console.log('✅ Verification email sent:', result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email', error);
  }
});

// Cloud Function: Send thank you email with discount code
exports.sendThankYouEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email, name, discountCode } = data;

    if (!email || !name || !discountCode) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
    }

    const result = await resend.emails.send({
      // Email THẬT - đang dùng domain test của Resend (gửi được ngay, không cần verify)
      // Để dùng domain riêng, verify domain trong Resend và đổi thành: 'LEO SUSHI <noreply@jatodemoweb.ddns.net>'
      from: 'LEO SUSHI <onboarding@resend.dev>',
      to: email,
      subject: 'Willkommen bei LEO SUSHI - Ihr Gutscheincode',
      html: THANK_YOU_EMAIL_TEMPLATE(name, discountCode),
    });

    console.log('✅ Thank you email sent:', result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Error sending thank you email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email', error);
  }
});

// Cloud Function: Send order confirmation email
exports.sendOrderConfirmationEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email, name, orderData } = data;

    if (!email || !name || !orderData) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
    }

    // Tạo HTML cho order confirmation (có thể customize)
    const orderHtml = `
      <h2>Bestellbestätigung</h2>
      <p>Bestellnummer: ${orderData.order_id}</p>
      <p>Gesamt: €${orderData.summary.total}</p>
      <!-- Thêm chi tiết đơn hàng -->
    `;

    const result = await resend.emails.send({
      // Email THẬT - đang dùng domain test của Resend (gửi được ngay, không cần verify)
      // Để dùng domain riêng, verify domain trong Resend và đổi thành: 'LEO SUSHI <noreply@jatodemoweb.ddns.net>'
      from: 'LEO SUSHI <onboarding@resend.dev>',
      to: email,
      subject: `Bestellbestätigung #${orderData.order_id} - LEO SUSHI`,
      html: orderHtml,
    });

    console.log('✅ Order confirmation email sent:', result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email', error);
  }
});

