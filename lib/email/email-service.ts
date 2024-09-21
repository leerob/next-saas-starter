import { resend } from './resend';
import { InviteUserEmail } from '@/emails/invite';
import { ResetPasswordEmail } from '@/emails/reset-password';

export async function sendInvitationEmail(
  to: string,
  invitedByUsername: string,
  teamName: string,
  role: string
) {
  const subject = `${invitedByUsername} has invited you to join ${teamName} on ACME`;

  if (!process.env.RESEND_AUTHORIZED_EMAIL) {
    return { error: 'RESEND_AUTHORIZED_EMAIL is not set' };
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_AUTHORIZED_EMAIL,
    to,
    subject,
    react: InviteUserEmail({
      firstName: 'John',
      invitedByUsername: 'ACME',
      invitedByEmail: 'acme@acme.com',
      teamName: 'ACME Team',
      inviteLink: 'https://vercel.com/teams/invite/foo',
    }),
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function sendResetPasswordEmail(
  to: string,
  username: string,
  token: string
) {
  const subject = `Reset your password on ACME`;

  if (!process.env.RESEND_AUTHORIZED_EMAIL) {
    return { error: 'RESEND_AUTHORIZED_EMAIL is not set' };
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_AUTHORIZED_EMAIL,
    to,
    subject,
    react: ResetPasswordEmail({
      username,
      email: to,
      resetPasswordLink: `http://localhost:3000/reset-password?token=${token}`,
    }),
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
