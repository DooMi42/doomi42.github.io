// Email service using EmailJS
// You'll need to set up EmailJS account and get your service ID, template ID, and public key

// For now, we'll use a fallback approach
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create an account and set up a service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your Service ID, Template ID, and Public Key
// 5. Replace the values below

const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
};

// Fallback function that creates a mailto link
export const sendEmailFallback = (formData) => {
  const subject = `Portfolio Contact from ${formData.name}`;
  const body = `Hi. I am ${formData.name}.\n\n${formData.message}`;
  const mailtoLink = `mailto:johannes.hurmerinta@mitrox.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  return {
    success: true,
    message: 'Your email client will open with a pre-filled message.',
    action: () => window.open(mailtoLink)
  };
};

// EmailJS integration (uncomment and configure when ready)
/*
import emailjs from '@emailjs/browser';

export const sendEmailWithEmailJS = async (formData) => {
  try {
    const templateParams = {
      from_name: formData.name,
      message: formData.message,
      to_email: 'johannes.hurmerinta@mitrox.io'
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      result
    };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again or contact me directly.',
      error
    };
  }
};
*/

// For now, we'll use the fallback method
export const sendEmail = sendEmailFallback;
