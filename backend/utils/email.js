// Email Utilities using Resend
const { Resend } = require('resend');
const config = require('../config/config');

const resend = new Resend(config.resendApiKey);

// Verification email template
const VERIFICATION_EMAIL_TEMPLATE = (name, verificationUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LEO SUSHI</h1>
    </div>
    <div class="content">
      <h2>E-Mail-Adresse bestätigen</h2>
      <p>Hallo ${name},</p>
      <p>Vielen Dank für Ihre Registrierung bei LEO SUSHI!</p>
      <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:</p>
      <p style="text-align: center;">
        <a href="${verificationUrl}" class="button">E-Mail bestätigen</a>
      </p>
      <p>Nach der Bestätigung erhalten Sie eine E-Mail mit Ihrem Gutscheincode für neue Kunden.</p>
      <p>Mit freundlichen Grüßen,<br>LEO SUSHI Team</p>
    </div>
  </div>
</body>
</html>
`;

// Thank you email template with discount code
const THANK_YOU_EMAIL_TEMPLATE = (name, discountCode) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .discount-box { background: #fff; border: 2px solid #d4af37; padding: 20px; margin: 20px 0; text-align: center; }
    .discount-code { font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LEO SUSHI</h1>
    </div>
    <div class="content">
      <h2>Vielen Dank für Ihre Registrierung!</h2>
      <p>Hallo ${name},</p>
      <p>Ihre E-Mail-Adresse wurde erfolgreich bestätigt.</p>
      <p>Als Willkommensgeschenk erhalten Sie einen Gutscheincode für Ihre erste Bestellung:</p>
      <div class="discount-box">
        <p style="margin: 0; font-size: 18px; font-weight: bold;">Ihr Gutscheincode:</p>
        <p class="discount-code">${discountCode}</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">10% Rabatt auf Ihre erste Bestellung</p>
      </div>
      <p>Verwenden Sie diesen Code beim Checkout, um Ihren Rabatt zu erhalten.</p>
      <p>Wir freuen uns, Sie bei LEO SUSHI begrüßen zu dürfen!</p>
      <p>Mit freundlichen Grüßen,<br>LEO SUSHI Team</p>
    </div>
  </div>
</body>
</html>
`;

// Send verification email
async function sendVerificationEmail(email, name, verificationUrl) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LEO SUSHI <onboarding@resend.dev>',
      to: [email],
      subject: 'E-Mail-Adresse bestätigen - LEO SUSHI',
      html: VERIFICATION_EMAIL_TEMPLATE(name, verificationUrl)
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }

    console.log('✅ Verification email sent:', data);
    return data;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

// Send thank you email with discount code
async function sendThankYouEmail(email, name, discountCode) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LEO SUSHI <onboarding@resend.dev>',
      to: [email],
      subject: 'Willkommen bei LEO SUSHI - Ihr Gutscheincode',
      html: THANK_YOU_EMAIL_TEMPLATE(name, discountCode)
    });

    if (error) {
      console.error('Error sending thank you email:', error);
      throw error;
    }

    console.log('✅ Thank you email sent:', data);
    return data;
  } catch (error) {
    console.error('Failed to send thank you email:', error);
    throw error;
  }
}

module.exports = {
  sendVerificationEmail,
  sendThankYouEmail
};

