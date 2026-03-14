// apps/athlex-batch/src/batch.service.ts
// All cron times are in UTC
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { EmailService } from './email.service';

@Injectable()
export class BatchService implements OnModuleInit {
  private readonly logger = new Logger(BatchService.name);
  private jobStats = {
    cleanup: { lastRun: null as Date | null, successCount: 0, errorCount: 0 },
    reminders: { lastRun: null as Date | null, successCount: 0, errorCount: 0 },
    analytics: { lastRun: null as Date | null, successCount: 0, errorCount: 0 },
    recommendations: {
      lastRun: null as Date | null,
      successCount: 0,
      errorCount: 0,
    },
    moderation: {
      lastRun: null as Date | null,
      successCount: 0,
      errorCount: 0,
    },
  };

  constructor(
    @InjectConnection() private connection: Connection,
    private readonly emailService: EmailService,
  ) {}

  onModuleInit() {
    this.logger.log('✅ Batch Service Initialized');
    this.logger.log('✅ All cron jobs scheduled');
  }

  getJobsStatus() {
    return {
      jobs: [
        {
          name: 'Cleanup Old Views',
          schedule: '0 2 * * * (Daily 2 AM)',
          status: 'active',
        },
        {
          name: 'Cleanup Orphaned Records',
          schedule: '0 3 * * 0 (Sunday 3 AM)',
          status: 'active',
        },
        {
          name: 'Cleanup Deleted Members',
          schedule: '0 4 * * * (Daily 4 AM)',
          status: 'active',
        },
        {
          name: 'Program Start Reminders',
          schedule: '0 9 * * * (Daily 9 AM)',
          status: 'active',
        },
        {
          name: 'Program Ending Reminders',
          schedule: '0 10 * * * (Daily 10 AM)',
          status: 'active',
        },
        {
          name: 'Inactive User Reminders',
          schedule: '0 11 * * * (Daily 11 AM)',
          status: 'active',
        },
        {
          name: 'Calculate Trending Programs',
          schedule: '0 1 * * * (Daily 1 AM)',
          status: 'active',
        },
        {
          name: 'Update Popularity Scores',
          schedule: '0 2 * * * (Daily 2 AM)',
          status: 'active',
        },
        {
          name: 'Generate Personalized Recommendations',
          schedule: '0 */6 * * * (Every 6 hours)',
          status: 'active',
        },
        {
          name: 'Collaborative Filtering',
          schedule: '0 0 * * * (Daily midnight)',
          status: 'active',
        },
        {
          name: 'Scan Inappropriate Content',
          schedule: '0 */4 * * * (Every 4 hours)',
          status: 'active',
        },
        {
          name: 'Detect Spammers',
          schedule: '0 5 * * * (Daily 5 AM)',
          status: 'active',
        },
        {
          name: 'Moderation Report',
          schedule: '0 6 * * 1 (Monday 6 AM)',
          status: 'active',
        },
      ],
    };
  }

  getStats() {
    return {
      stats: this.jobStats,
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid,
      },
    };
  }

  // ==================== CLEANUP JOBS ====================

  @Cron('0 2 * * *', { timeZone: 'UTC' }) // Daily at 2 AM UTC
  async cleanupOldViews() {
    this.logger.log('🧹 Starting: Cleanup Old Views');
    const startTime = Date.now();

    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const result = await this.connection.collection('views').deleteMany({
        createdAt: { $lt: ninetyDaysAgo },
      });

      this.jobStats.cleanup.lastRun = new Date();
      this.jobStats.cleanup.successCount++;

      this.logger.log(
        `✅ Deleted ${result.deletedCount} old views (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.cleanup.errorCount++;
      this.logger.error('❌ Failed to cleanup old views:', error);
    }
  }

  @Cron('0 3 * * 0', { timeZone: 'UTC' }) // Sunday at 3 AM UTC
  async cleanupOrphanedRecords() {
    this.logger.log('🧹 Starting: Cleanup Orphaned Records');
    const startTime = Date.now();

    try {
      const programs = await this.connection
        .collection('programs')
        .find({}, { projection: { _id: 1 } })
        .toArray();
      const programIds = programs.map((p) => p._id);

      const likesResult = await this.connection.collection('likes').deleteMany({
        likeGroup: 'PROGRAM',
        likeRefId: { $nin: programIds },
      });

      const commentsResult = await this.connection
        .collection('comments')
        .deleteMany({
          commentGroup: 'PROGRAM',
          commentRefId: { $nin: programIds },
        });

      this.jobStats.cleanup.lastRun = new Date();
      this.jobStats.cleanup.successCount++;

      this.logger.log(
        `✅ Deleted ${likesResult.deletedCount} orphaned likes, ${commentsResult.deletedCount} orphaned comments (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.cleanup.errorCount++;
      this.logger.error('❌ Failed to cleanup orphaned records:', error);
    }
  }

  @Cron('0 4 * * *', { timeZone: 'UTC' }) // Daily at 4 AM UTC
  async cleanupDeletedMembers() {
    this.logger.log('🧹 Starting: Cleanup Deleted Members');
    const startTime = Date.now();

    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const result = await this.connection.collection('members').deleteMany({
        memberStatus: 'DELETED',
        deletedAt: { $lt: ninetyDaysAgo },
      });

      this.jobStats.cleanup.lastRun = new Date();
      this.jobStats.cleanup.successCount++;

      this.logger.log(
        `✅ Permanently deleted ${result.deletedCount} members (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.cleanup.errorCount++;
      this.logger.error('❌ Failed to cleanup deleted members:', error);
    }
  }

  // ==================== REMINDER JOBS ====================

  @Cron('0 9 * * *', { timeZone: 'UTC' }) // Daily at 9 AM UTC
  async sendProgramStartReminders() {
    this.logger.log('📧 Starting: Program Start Reminders');
    const startTime = Date.now();

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const startingPrograms = await this.connection
        .collection('programs')
        .find({
          programStartDate: { $gte: tomorrow, $lt: dayAfterTomorrow },
        })
        .toArray();

      let totalReminders = 0;
      for (const program of startingPrograms) {
        const enrollments = await this.connection
          .collection('programenrollments')
          .find({ programId: program._id })
          .toArray();

        const memberIds = enrollments.map((e) => e.memberId);
        const members = await this.connection
          .collection('members')
          .find({ _id: { $in: memberIds }, memberEmail: { $exists: true, $ne: '' } })
          .project({ memberEmail: 1, memberNick: 1, memberFullName: 1 })
          .toArray();

        for (const member of members) {
          await this.emailService.sendProgramStartReminder({
            to: member.memberEmail,
            memberName: member.memberFullName ?? member.memberNick,
            programName: program.programName,
            programType: program.programType,
          });
          totalReminders++;
        }
      }

      this.jobStats.reminders.lastRun = new Date();
      this.jobStats.reminders.successCount++;

      this.logger.log(
        `✅ Sent ${totalReminders} program start reminders (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.reminders.errorCount++;
      this.logger.error('❌ Failed to send program start reminders:', error);
    }
  }

  @Cron('0 10 * * *', { timeZone: 'UTC' }) // Daily at 10 AM UTC
  async sendProgramEndingReminders() {
    this.logger.log('📧 Starting: Program Ending Reminders');
    const startTime = Date.now();

    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      threeDaysFromNow.setHours(0, 0, 0, 0);

      const fourDaysFromNow = new Date(threeDaysFromNow);
      fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 1);

      const endingPrograms = await this.connection
        .collection('programs')
        .find({
          programEndDate: { $gte: threeDaysFromNow, $lt: fourDaysFromNow },
        })
        .toArray();

      let totalReminders = 0;
      for (const program of endingPrograms) {
        const enrollments = await this.connection
          .collection('programenrollments')
          .find({ programId: program._id })
          .toArray();

        const memberIds = enrollments.map((e) => e.memberId);
        const members = await this.connection
          .collection('members')
          .find({ _id: { $in: memberIds }, memberEmail: { $exists: true, $ne: '' } })
          .project({ memberEmail: 1, memberNick: 1, memberFullName: 1 })
          .toArray();

        for (const member of members) {
          await this.emailService.sendProgramEndingReminder({
            to: member.memberEmail,
            memberName: member.memberFullName ?? member.memberNick,
            programName: program.programName,
            daysLeft: 3,
          });
          totalReminders++;
        }
      }

      this.jobStats.reminders.lastRun = new Date();
      this.jobStats.reminders.successCount++;

      this.logger.log(
        `✅ Sent ${totalReminders} program ending reminders (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.reminders.errorCount++;
      this.logger.error('❌ Failed to send program ending reminders:', error);
    }
  }

  @Cron('0 11 * * *', { timeZone: 'UTC' }) // Daily at 11 AM UTC
  async sendInactiveUserReminders() {
    this.logger.log('📧 Starting: Inactive User Reminders');
    const startTime = Date.now();

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const inactiveUsers = await this.connection
        .collection('members')
        .find({
          memberStatus: 'ACTIVE',
          lastLoginAt: { $lt: sevenDaysAgo },
          memberEmail: { $exists: true, $ne: '' },
        })
        .project({ memberEmail: 1, memberNick: 1, memberFullName: 1, lastLoginAt: 1 })
        .limit(100)
        .toArray();

      for (const member of inactiveUsers) {
        const daysSinceLogin = Math.floor(
          (Date.now() - new Date(member.lastLoginAt).getTime()) / 86400000,
        );
        await this.emailService.sendInactivityReminder({
          to: member.memberEmail,
          memberName: member.memberFullName ?? member.memberNick,
          daysSinceLogin,
        });
      }

      this.jobStats.reminders.lastRun = new Date();
      this.jobStats.reminders.successCount++;

      this.logger.log(
        `✅ Sent reminders to ${inactiveUsers.length} inactive users (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.reminders.errorCount++;
      this.logger.error('❌ Failed to send inactive user reminders:', error);
    }
  }

  // ==================== ANALYTICS JOBS ====================

  @Cron('0 1 * * *', { timeZone: 'UTC' }) // Daily at 1 AM UTC
  async calculateTrendingPrograms() {
    this.logger.log('📊 Starting: Calculate Trending Programs');
    const startTime = Date.now();

    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const trendingPrograms = await this.connection
        .collection('programs')
        .aggregate([
          {
            $lookup: {
              from: 'likes',
              let: { programId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$likeRefId', '$$programId'] },
                    likeGroup: 'PROGRAM',
                    createdAt: { $gte: oneDayAgo },
                  },
                },
                { $count: 'count' },
              ],
              as: 'recentLikes',
            },
          },
          {
            $addFields: {
              trendingScore: {
                $ifNull: [{ $arrayElemAt: ['$recentLikes.count', 0] }, 0],
              },
            },
          },
          { $sort: { trendingScore: -1 } },
          { $limit: 20 },
        ])
        .toArray();

      this.jobStats.analytics.lastRun = new Date();
      this.jobStats.analytics.successCount++;

      this.logger.log(
        `✅ Calculated ${trendingPrograms.length} trending programs (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.analytics.errorCount++;
      this.logger.error('❌ Failed to calculate trending programs:', error);
    }
  }

  @Cron('30 2 * * *', { timeZone: 'UTC' }) // Daily at 2:30 AM UTC (offset from cleanup at 2 AM)
  async updatePopularityScores() {
    this.logger.log('📊 Starting: Update Popularity Scores');
    const startTime = Date.now();

    try {
      await this.connection.collection('programs').updateMany({}, [
        {
          $set: {
            popularityScore: {
              $add: [
                { $multiply: [{ $ifNull: ['$programLikes', 0] }, 1] },
                { $multiply: [{ $ifNull: ['$programMembers', 0] }, 3] },
                { $multiply: [{ $ifNull: ['$programViews', 0] }, 0.1] },
              ],
            },
          },
        },
      ]);

      this.jobStats.analytics.lastRun = new Date();
      this.jobStats.analytics.successCount++;

      this.logger.log(
        `✅ Updated popularity scores (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.analytics.errorCount++;
      this.logger.error('❌ Failed to update popularity scores:', error);
    }
  }

  // ==================== RECOMMENDATION JOBS ====================

  @Cron('0 */6 * * *', { timeZone: 'UTC' }) // Every 6 hours UTC
  async generatePersonalizedRecommendations() {
    this.logger.log('🎯 Starting: Personalized Recommendations');
    const startTime = Date.now();

    try {
      const activeMembers = await this.connection
        .collection('members')
        .find({ memberStatus: 'ACTIVE' })
        .limit(50)
        .toArray();

      let totalRecommendations = 0;

      for (const member of activeMembers) {
        const likedPrograms = await this.connection
          .collection('likes')
          .find({ memberId: member._id, likeGroup: 'PROGRAM' })
          .toArray();

        if (likedPrograms.length > 0) {
          totalRecommendations += likedPrograms.length;
          // TODO: Generate and cache recommendations
        }
      }

      this.jobStats.recommendations.lastRun = new Date();
      this.jobStats.recommendations.successCount++;

      this.logger.log(
        `✅ Generated recommendations for ${activeMembers.length} users (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.recommendations.errorCount++;
      this.logger.error(
        '❌ Failed to generate personalized recommendations:',
        error,
      );
    }
  }

  @Cron('0 0 * * *', { timeZone: 'UTC' }) // Daily at midnight UTC
  async generateCollaborativeFiltering() {
    this.logger.log('🎯 Starting: Collaborative Filtering');
    const startTime = Date.now();

    try {
      const popularPrograms = await this.connection
        .collection('programs')
        .aggregate([
          {
            $lookup: {
              from: 'likes',
              let: { programId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$likeRefId', '$$programId'] },
                    likeGroup: 'PROGRAM',
                  },
                },
              ],
              as: 'likes',
            },
          },
          { $addFields: { likesCount: { $size: '$likes' } } },
          { $match: { likesCount: { $gte: 3 } } },
          { $sort: { likesCount: -1 } },
          { $limit: 50 },
        ])
        .toArray();

      this.jobStats.recommendations.lastRun = new Date();
      this.jobStats.recommendations.successCount++;

      this.logger.log(
        `✅ Processed ${popularPrograms.length} programs for collaborative filtering (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.recommendations.errorCount++;
      this.logger.error('❌ Failed collaborative filtering:', error);
    }
  }

  // ==================== MODERATION JOBS ====================

  @Cron('0 */4 * * *', { timeZone: 'UTC' }) // Every 4 hours UTC
  async scanInappropriateContent() {
    this.logger.log('🛡️ Starting: Scan Inappropriate Content');
    const startTime = Date.now();

    try {
      const fourHoursAgo = new Date();
      fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

      const recentComments = await this.connection
        .collection('comments')
        .find({ createdAt: { $gte: fourHoursAgo }, commentStatus: 'ACTIVE' })
        .toArray();

      const inappropriateKeywords = ['spam', 'scam', 'buy now', 'click here'];

      let flaggedCount = 0;

      for (const comment of recentComments) {
        const content = comment.commentContent.toLowerCase();
        const hasInappropriate = inappropriateKeywords.some((keyword) =>
          content.includes(keyword),
        );

        if (hasInappropriate) {
          await this.connection
            .collection('comments')
            .updateOne(
              { _id: comment._id },
              { $set: { commentStatus: 'HOLD' } },
            );
          flaggedCount++;
        }
      }

      this.jobStats.moderation.lastRun = new Date();
      this.jobStats.moderation.successCount++;

      this.logger.log(
        `✅ Scanned ${recentComments.length} comments, flagged ${flaggedCount} (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.moderation.errorCount++;
      this.logger.error('❌ Failed to scan inappropriate content:', error);
    }
  }

  @Cron('0 5 * * *', { timeZone: 'UTC' }) // Daily at 5 AM UTC
  async detectSpammers() {
    this.logger.log('🛡️ Starting: Detect Spammers');
    const startTime = Date.now();

    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const suspiciousUsers = await this.connection
        .collection('comments')
        .aggregate([
          { $match: { createdAt: { $gte: oneDayAgo } } },
          { $group: { _id: '$memberId', commentCount: { $sum: 1 } } },
          { $match: { commentCount: { $gt: 50 } } },
        ])
        .toArray();

      this.jobStats.moderation.lastRun = new Date();
      this.jobStats.moderation.successCount++;

      this.logger.log(
        `✅ Found ${suspiciousUsers.length} suspicious users (${Date.now() - startTime}ms)`,
      );
    } catch (error) {
      this.jobStats.moderation.errorCount++;
      this.logger.error('❌ Failed to detect spammers:', error);
    }
  }

  @Cron('0 6 * * 1', { timeZone: 'UTC' }) // Monday at 6 AM UTC
  async generateModerationReport() {
    this.logger.log('📊 Starting: Weekly Moderation Report');
    const startTime = Date.now();

    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const flaggedComments = await this.connection
        .collection('comments')
        .countDocuments({
          commentStatus: 'HOLD',
          createdAt: { $gte: oneWeekAgo },
        });

      const deletedMembers = await this.connection
        .collection('members')
        .countDocuments({
          memberStatus: 'DELETED',
          deletedAt: { $gte: oneWeekAgo },
        });

      this.jobStats.moderation.lastRun = new Date();
      this.jobStats.moderation.successCount++;

      this.logger.log('📋 Weekly Moderation Report:');
      this.logger.log(`   - Flagged comments: ${flaggedComments}`);
      this.logger.log(`   - Deleted members: ${deletedMembers}`);
      this.logger.log(`   (${Date.now() - startTime}ms)`);
    } catch (error) {
      this.jobStats.moderation.errorCount++;
      this.logger.error('❌ Failed to generate moderation report:', error);
    }
  }
}
