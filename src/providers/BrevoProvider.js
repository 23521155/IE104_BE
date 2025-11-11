const SibApiV3Sdk = require('@getbrevo/brevo');
const { env } = require('~/config/environment');
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = env.BREVO_API_KEY;
const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
    try {
        // nguyenletuanphi910.2019@gmail.com is validated?
        console.log(env.EMAIL_USERNAME);
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
            sender: { email: env.EMAIL_USERNAME, name: 'nguyen le tuan phi' },
            to: [{ email: recipientEmail }],
            subject: customSubject,
            htmlContent: htmlContent,
        });
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully:', response);
    } catch (error) {
        console.error('❌ Failed to send email:', error.response?.data || error.message);
    }
};
export const BrevoProvider = { sendEmail };
