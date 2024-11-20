const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Event = require('./models/Event'); // Adjust based on your schema location

// NodeMailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred email service
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password',
  },
});

// Reminder Function
const sendReminders = async () => {
  const now = new Date();
  const events = await Event.find({ start: { $gte: now } }); // Fetch upcoming events
  
  events.forEach(event => {
    const { title, where, start, end, attire, description } = event;

    // Calculate reminder times
    const reminders = [
      { time: new Date(start) - 7 * 24 * 60 * 60 * 1000, label: '7 days' },
      { time: new Date(start) - 3 * 24 * 60 * 60 * 1000, label: '3 days' },
      { time: new Date(start) - 24 * 60 * 60 * 1000, label: '24 hours' },
    ];

    reminders.forEach(({ time, label }) => {
      if (now >= time && now < time + 60 * 1000) { // Send reminder within a 1-minute window
        const mailOptions = {
          from: 'your_email@gmail.com',
          to: 'recipient_email@gmail.com', // Replace with user emails
          subject: `Reminder: ${title} in ${label}`,
          html: `
            <h2>${title}</h2>
            <p><strong>Where:</strong> ${where}</p>
            <p><strong>When:</strong> ${new Date(start).toLocaleString()} - ${new Date(end).toLocaleString()}</p>
            <p><strong>Attire:</strong> ${attire}</p>
            <p><strong>Description:</strong> ${description}</p>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log(`Reminder sent: ${info.response}`);
          }
        });
      }
    });
  });
};

// Schedule Function
setInterval(sendReminders, 60 * 1000); // Check every minute
