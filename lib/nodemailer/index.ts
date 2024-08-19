"use server"

import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
) {
  const THRESHOLD_PERCENTAGE = 40;

  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Price Tracking for ${shortenedTitle}`;
      body = `
        <div style="text-align: center;">
          <a href="">
            <img 
              src="https://i.ibb.co/4p2SRFD/logo.png" 
              alt="logo" 
              style="padding-left:17px;padding-bottom:4px;padding-top:2px; width: 150px; height: auto; border: 2px solid black; border-radius:16px;" 
              border="0"
            >
          </a>
        </div>
        <h2>Welcome to 🔍PriceWatch</h2>
        <p>You've successfully signed up to track ${product.title}!</p>
        <p>Here’s a preview of the updates you’ll get:</p>
        <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
          <h3>${product.title} is now available!</h3>
          <p>Great news! ${product.title} is back in stock and ready for you.</p>
          <p>Act fast - <a href="${product.url}" target="_blank" rel="noopener noreferrer">grab it now</a>!</p>
          <img src="${product.image}" alt="Product Image" style="width: 150px" />
        </div>
        <p>Stay tuned for more updates on ${product.title} and other products you’re keeping an eye on.</p>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is back in stock!`;
      body = `
        <div style="text-align: center;">
          <a href="">
            <img 
              src="https://i.ibb.co/4p2SRFD/logo.png" 
              alt="logo" 
              style="padding-left:17px;padding-bottom:4px;padding-top:2px; width: 150px; height: auto; border: 2px solid black; border-radius:16px;" 
              border="0"
            >
          </a>
        </div>
        <div>
          <h4>${product.title} is now restocked! Grab yours before it’s gone!</h4>
          <p>Check out the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Fantastic! ${product.title} has reached its all-time lowest price!</h4>
          <p>Don't miss out - get it at this unbeatable price <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
        <div style="text-align: center;">
          <a href="">
            <img 
              src="https://i.ibb.co/4p2SRFD/logo.png" 
              alt="logo" 
              style="padding-left:17px;padding-bottom:4px;padding-top:2px; width: 150px; height: auto; border: 2px solid black; border-radius:16px;" 
              border="0"
            >
          </a>
        </div>
        <div>
          <h4>Exciting news! ${product.title} is now available at a discount greater than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Grab it before the deal ends, right <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  try {
    // Verify connection configuration
    await transporter.verify();
    console.log("Server is ready to take our messages");

    // Send email
    const info = await transporter.sendMail({
      from: 'ronaksharmaiitg@gmail.com',
      to: sendTo,
      html: emailContent.body,
      subject: emailContent.subject,
    });

    console.log(info);

    // DB entry logic (place it here if you want it to happen after sending the email)
    // await yourDatabaseFunction();

    return NextResponse.json({ message: "Ok" });

  } catch (error : any) {
    console.error("Error sending email:", error);

    // Optionally return an error response
    return NextResponse.json({ message: "Error", error: error.message });
  }
};
