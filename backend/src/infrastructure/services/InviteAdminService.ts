import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const sendInvitationAdminEmail = async (email: string, link: string): Promise<void> => {
    const user = process.env.MAIL_USER;

    await transporter.sendMail({
        from: `"Nova Administration" <${user}>`,
        to: email,
        subject: "You're Invited to Join Nova as an Administrator",
        text: `Hi,

You have been invited to join Nova as an administrator.
To accept the invitation and set up your account password, open the link below:
${link}

This invitation link expires 2 days after creation.

Regards,
Nova Team`,
        // HTML body with clickable button and fallback link
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #111; margin-bottom: 16px;">You're Invited to Join Nova</h2>
            <p>Hi,</p>
            <p>You have been invited to join <strong>Nova</strong> as an administrator with specific permissions to help manage platform operations.</p>
            
            <div style="background-color: #f9fafb; padding: 14px; border-radius: 6px; margin: 20px 0; font-size: 14px;">
                <p style="margin: 4px 0;"><strong>Platform:</strong> Nova</p>
                <p style="margin: 4px 0;"><strong>Invited Email:</strong> ${email}</p>
                <p style="margin: 4px 0;"><strong>Invited By:</strong> ${user}</p>
                <p style="margin: 4px 0;"><strong>Validity:</strong> 2 days from creation</p>
            </div>

            <p>Click the button below to accept the invitation and set up your password:</p>

            <div style="text-align: center; margin: 28px 0;">
                <a href="${link}" target="_blank" rel="noopener noreferrer" 
                   style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Accept Invitation &amp; Set Password
                </a>
            </div>

            <p style="font-size: 13px; color: #555;">
                If the button above doesn't work, copy and paste this link into your browser:<br />
                <a href="${link}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; word-break: break-all;">${link}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />

            <div style="font-size: 12px; color: #666;">
                <p style="margin: 4px 0;"><strong>Important:</strong></p>
                <ul style="padding-left: 18px; margin: 6px 0;">
                    <li>This invitation link expires two days after creation.</li>
                    <li>Do not share this link with anyone else.</li>
                    <li>Your access becomes active only after you set your password.</li>
                    <li>If you were not expecting this invitation, you can safely ignore this email.</li>
                </ul>
            </div>

            <p style="margin-top: 24px; font-size: 14px;">
                Regards,<br />
                <strong>Nova Team</strong><br />
                Nova Platform Administration
            </p>
        </div>
        `,
    });
};