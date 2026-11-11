import nodemailer from "nodemailer";

export const sendInvitationAdminEmail = async (email: string, link: string) => {
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASSWORD;

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user, 
            pass
        }
    });

    transporter.sendMail({
        from: user,
        to: email,
        subject: "You're Invited to Join Nova as an Administrato",
        text:`Hi,

        You have been invited to join Nova as an administrator.
        The Nova team is granting you access to the platform with specific permissions to help manage its operations.
        Invitation Details

        Platform: Nova
        Invited Email: ${email}
        Invited By: ${user}
        Invitation Validity: 2 days from the time this invitation was created
        Accept Your Invitation

        To accept the invitation and set up your account password, click the button below.
        Accept Invitation & Set Password
        ${link}
        You will be asked to create a password and confirm it to complete your account setup.

        Important:
        This invitation link expires two days after the invitation is created.
        The link is intended only for the invited recipient. Please do not share it with anyone else.
        Your administrator access and assigned permissions will become active only after you successfully accept the invitation.
        If you were not expecting this invitation, you can safely ignore this email.
        If you have any questions, please contact the Nova team.

        Regards,
        Nova Team
        Nova Platform Administration`
    })
}