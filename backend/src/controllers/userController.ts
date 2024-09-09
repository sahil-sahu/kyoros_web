import sendTestNotification from '../helpers/testNotify';
import { fireAuth } from '../firebase';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';
import sendEmail from '../helpers/email';
import { generateResetLink } from '../helpers/resetPassword';

const emailHtml = (link: string) => {
  return  `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #333;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        font-size: 16px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .button:hover {
        background-color: #218838;
      }
      .footer {
        font-size: 12px;
        color: #888;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>
        Hi there,
      </p>
      <p>
        We received a request to reset your password. Click the button below to
        reset it. If you didn’t request this, please ignore this email.
      </p>
      <!-- Password reset link -->
      <a
        href="${link}" 
        class="button"
        target="_blank"
        >Reset Your Password</a
      >
      <p>
        If the button doesn't work, you can copy and paste this link into your
        browser:
        <br />
        <a href="${link}" target="_blank">${link}</a>
      </p>
      <p>
        Thank you,<br />
        The Support Team
      </p>
      <div class="footer">
        <p>
          If you did not request a password reset, please disregard this email.
        </p>
      </div>
    </div>
  </body>
</html>
`
}

export const testNotification = async (req: AuthRequest, res: any) => {
  try {
      const {fireTokens} = await prisma.user.findUnique({
        where:{firebaseUid:req.user}
      });
      await sendTestNotification(fireTokens);
      await res.json({"notification":true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
export const resetPassword = async (req: AuthRequest, res: any) => {
  try {
      const email:string|undefined = req.body?.email;
      if(!email) throw new Error("Email is required");
      const user = await prisma.user.findUniqueOrThrow({
        where:{email}
      })
      if(req.userType != "admin" || req.hospital != user.hospitalId) throw new Error("Only admin users are allowed");
      const link = await generateResetLink(user.email)
      try {
        sendEmail({
          from: '"Kyoros" <tech@kyoros.com>',
          to: user.email,
          subject: 'Password Reset',
          // text: 'Hello world',
          html: emailHtml(link),
        })
      } catch (error) {
        console.error("Failed to send email");
      }
      return res.json({"email": user.email, "link": link});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send rest link" });
  }
};