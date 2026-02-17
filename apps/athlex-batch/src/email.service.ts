// apps/athlex-batch/src/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private fromAddress: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromAddress = process.env.EMAIL_FROM ?? 'Athlex <noreply@athlex.com>';
  }

  async sendProgramStartReminder(params: {
    to: string;
    memberName: string;
    programName: string;
    programType: string;
  }): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromAddress,
        to: params.to,
        subject: `Your program "${params.programName}" starts tomorrow!`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;">
            <h2>Get ready, ${params.memberName}! 💪</h2>
            <p>Your <strong>${params.programType}</strong> program <strong>"${params.programName}"</strong> starts <strong>tomorrow</strong>.</p>
            <p>Make sure you're prepared: rest well, stay hydrated, and show up ready to give it your all.</p>
            <a href="${process.env.APP_URL ?? 'https://athlex.com'}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
              Go to Athlex
            </a>
            <p style="margin-top:24px;color:#666;font-size:13px;">
              You're receiving this because you enrolled in a program on Athlex.
            </p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send start reminder to ${params.to}: ${error}`,
      );
    }
  }

  async sendProgramEndingReminder(params: {
    to: string;
    memberName: string;
    programName: string;
    daysLeft: number;
  }): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromAddress,
        to: params.to,
        subject: `"${params.programName}" ends in ${params.daysLeft} days — finish strong!`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;">
            <h2>Almost there, ${params.memberName}! 🏁</h2>
            <p>Your program <strong>"${params.programName}"</strong> ends in <strong>${params.daysLeft} days</strong>.</p>
            <p>You've come this far — push through and finish strong. Every session counts.</p>
            <a href="${process.env.APP_URL ?? 'https://athlex.com'}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
              Continue training
            </a>
            <p style="margin-top:24px;color:#666;font-size:13px;">
              You're receiving this because you enrolled in a program on Athlex.
            </p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send ending reminder to ${params.to}: ${error}`,
      );
    }
  }

  async sendInactivityReminder(params: {
    to: string;
    memberName: string;
    daysSinceLogin: number;
  }): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromAddress,
        to: params.to,
        subject: `We miss you at Athlex, ${params.memberName}!`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;">
            <h2>Hey ${params.memberName}, it's been a while! 👋</h2>
            <p>You haven't visited Athlex in <strong>${params.daysSinceLogin} days</strong>. Your fitness goals are still waiting for you.</p>
            <p>Even a short session today will get you back on track.</p>
            <a href="${process.env.APP_URL ?? 'https://athlex.com'}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
              Get back to training
            </a>
            <p style="margin-top:24px;color:#666;font-size:13px;">
              You're receiving this because you have an active Athlex account.
            </p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send inactivity reminder to ${params.to}: ${error}`,
      );
    }
  }
}
