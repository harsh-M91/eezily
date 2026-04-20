import nodemailer from "nodemailer";
import fs from "fs";

// 1. Create email transporter
let transporter = nodemailer.createTransport({
  service: "gmail",   // using Gmail
  auth: {
    user: "daveharsh0902@gmail.com",  // your Gmail address
    pass: "frbctlrbtgsyrzms",      // the App Password from step 3
  },
});

// 2. Read the Playwright report file
let reportPath = "./playwright-report/index.html";  
let reportContent = fs.readFileSync(reportPath);

// Define recipients (you can add multiple)
const recipients = [
  "daveharsh09.oneclick@gmail.com", "sagar_chhatbar@momentum91.com"
  
];

// 3. Send the email
transporter.sendMail({
  from: '"Playwright Automation" <daveharsh0902@gmail.com>',  
  to: recipients.join(", "),
  subject: `Latest Playwright Test Report - ${new Date().toLocaleString().replace(',', '')}`,  
  text: `Hi There,\n\nI’ve attached the most recent Playwright test report.\nPlease take a look and share your feedback if needed.\n\nNote: Download the attached file and open it in any browser.`,  
  attachments: [
    {
      filename: "report.html",  
      content: reportContent,  
    },
  ],
})
.then(() => console.log("✅ Report sent to Manager"))
.catch((err) => console.error("❌ Error sending email:", err));
