/**
 * AgentCommunity Router â€“ Educational Platform for Agent Creators
 * Handles courses, lessons, quizzes, logic puzzles, and certifications
 */
import { z } from "zod";
import { eq, and, desc, asc, like } from "drizzle-orm";
import { getDb } from "../db";
import {
  courses,
  lessons,
  quizQuestions,
  logicPuzzles,
  userCourseProgress,
  userLessonProgress,
  userPuzzleAttempts,
  certifications,
  userAchievements,
  courseReviews,
} from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// â”€â”€â”€ Shared Zod Schemas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const courseSchema = z.object({
  slug: z.string().min(3).max(128),
  title: z.string().min(5).max(255),
  description: z.string().min(20),
  category: z.enum(["beginner", "intermediate", "advanced", "specialized"]),
  level: z.number().int().min(1).max(5),
  duration: z.number().int().min(15),
  instructor: z.string().min(2).max(255),
  instructorBio: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
});

const lessonSchema = z.object({
  courseId: z.number().int().positive(),
  slug: z.string().min(3).max(128),
  title: z.string().min(5).max(255),
  description: z.string().optional(),
  content: z.string().min(50),
  videoUrl: z.string().url().optional(),
  order: z.number().int().min(1),
  estimatedDuration: z.number().int().min(5),
  keyTakeaways: z.array(z.string()).optional(),
});

const quizAnswerSchema = z.object({
  lessonId: z.number().int().positive(),
  answers: z.array(
    z.object({
      questionId: z.number().int().positive(),
      answer: z.string(),
    })
  ),
});

const puzzleSubmissionSchema = z.object({
  puzzleId: z.number().int().positive(),
  solution: z.string(),
  timeSpent: z.number().int().min(0).optional(),
});

export const agentCommunityRouter = router({
  // â”€â”€â”€ Courses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * List all published courses with optional filtering
   */
  courses: publicProcedure
    .input(
      z.object({
        category: z.enum(["beginner", "intermediate", "advanced", "specialized"]).optional(),
        search: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      let whereConditions = [eq(courses.status, "published")];

      if (input.category) {
        whereConditions.push(eq(courses.category, input.category));
      }

      if (input.search) {
        whereConditions.push(like(courses.title, `%${input.search}%`));
      }

      const results = await db
        .select()
        .from(courses)
        .where(and(...whereConditions))
        .orderBy(desc(courses.enrollmentCount))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  /**
   * Get a single course by slug with full details
   */
  getCourseBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [course] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.slug, input.slug), eq(courses.status, "published")))
        .limit(1);

      if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found." });

      // Get lessons for this course
      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.id))
        .orderBy(asc(lessons.order));

      return { ...course, lessons: courseLessons };
    }),

  /**
   * Get user's enrolled courses
   */
  myEnrolledCourses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

    const enrollments = await db
      .select()
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, ctx.user.id));

    // Get course details for each enrollment
    const enrolledCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const [course] = await db
          .select()
          .from(courses)
          .where(eq(courses.id, enrollment.courseId))
          .limit(1);
        return { ...enrollment, course };
      })
    );

    return enrolledCourses;
  }),

  /**
   * Enroll user in a course
   */
  enrollCourse: protectedProcedure
    .input(z.object({ courseId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      // Check if already enrolled
      const [existing] = await db
        .select()
        .from(userCourseProgress)
        .where(
          and(
            eq(userCourseProgress.userId, ctx.user.id),
            eq(userCourseProgress.courseId, input.courseId)
          )
        )
        .limit(1);

      if (existing) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already enrolled in this course." });
      }

      // Get course to find total lessons
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.courseId))
        .limit(1);

      if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found." });

      const totalLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, input.courseId));

      // Create enrollment
      const [enrollment] = await db
        .insert(userCourseProgress)
        .values({
          userId: ctx.user.id,
          courseId: input.courseId,
          status: "enrolled",
          totalLessons: totalLessons.length,
        })
        .$returningId();

      return { success: true, enrollmentId: enrollment.id };
    }),

  // â”€â”€â”€ Lessons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Get a lesson by ID with quiz questions
   */
  getLesson: publicProcedure
    .input(z.object({ lessonId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.lessonId))
        .limit(1);

      if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found." });

      // Get quiz questions
      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.lessonId, input.lessonId))
        .orderBy(asc(quizQuestions.order));

      return { ...lesson, questions };
    }),

  /**
   * Mark lesson as completed
   */
  completeLesson: protectedProcedure
    .input(z.object({ lessonId: z.number().int().positive(), quizScore: z.number().int().min(0).max(100) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      // Get or create lesson progress
      const [existing] = await db
        .select()
        .from(userLessonProgress)
        .where(
          and(
            eq(userLessonProgress.userId, ctx.user.id),
            eq(userLessonProgress.lessonId, input.lessonId)
          )
        )
        .limit(1);

      if (existing && existing.status === "completed") {
        return { success: true, message: "Lesson already completed." };
      }

      const now = new Date();

      if (existing) {
        // Update existing progress
        await db
          .update(userLessonProgress)
          .set({
            status: "completed",
            completedAt: now,
            quizScore: input.quizScore,
            quizAttempts: existing.quizAttempts + 1,
            updatedAt: now,
          })
          .where(eq(userLessonProgress.id, existing.id));
      } else {
        // Create new progress
        await db.insert(userLessonProgress).values({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          status: "completed",
          completedAt: now,
          quizScore: input.quizScore,
          quizAttempts: 1,
        });
      }

      return { success: true };
    }),

  // â”€â”€â”€ Logic Puzzles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * List logic puzzles with filtering
   */
  puzzles: publicProcedure
    .input(
      z.object({
        difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
        category: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      let whereConditions = [];

      if (input.difficulty) {
        whereConditions.push(eq(logicPuzzles.difficulty, input.difficulty));
      }

      if (input.category) {
        whereConditions.push(eq(logicPuzzles.category, input.category));
      }

      const results = await (whereConditions.length > 0
        ? db.select().from(logicPuzzles).where(and(...whereConditions))
        : db.select().from(logicPuzzles)
      )
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  /**
   * Get a puzzle by ID
   */
  getPuzzle: publicProcedure
    .input(z.object({ puzzleId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [puzzle] = await db
        .select()
        .from(logicPuzzles)
        .where(eq(logicPuzzles.id, input.puzzleId))
        .limit(1);

      if (!puzzle) throw new TRPCError({ code: "NOT_FOUND", message: "Puzzle not found." });

      // Don't return solution to user
      const { solution, ...puzzleWithoutSolution } = puzzle;
      return puzzleWithoutSolution;
    }),

  /**
   * Submit puzzle solution
   */
  submitPuzzle: protectedProcedure
    .input(puzzleSubmissionSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [puzzle] = await db
        .select()
        .from(logicPuzzles)
        .where(eq(logicPuzzles.id, input.puzzleId))
        .limit(1);

      if (!puzzle) throw new TRPCError({ code: "NOT_FOUND", message: "Puzzle not found." });

      // Simple solution validation (in production, use more sophisticated checking)
      const isCorrect = input.solution.trim().toLowerCase() === puzzle.solution.trim().toLowerCase();

      // Calculate score based on time spent and hints
      let score = 0;
      if (isCorrect) {
        score = puzzle.points;
        if (input.timeSpent && puzzle.timeLimit) {
          // Bonus for solving quickly
          const timeBonus = Math.max(0, puzzle.timeLimit - input.timeSpent);
          score = Math.min(puzzle.points, score + Math.floor(timeBonus / 10));
        }
      }

      // Record attempt
      const [attempt] = await db
        .insert(userPuzzleAttempts)
        .values({
          userId: ctx.user.id,
          puzzleId: input.puzzleId,
          status: isCorrect ? "solved" : "attempted",
          userSolution: input.solution,
          isCorrect,
          score,
          timeSpent: input.timeSpent,
        })
        .$returningId();

      return {
        success: true,
        isCorrect,
        score,
        attemptId: attempt.id,
      };
    }),

  /**
   * Get puzzle leaderboard
   */
  puzzleLeaderboard: publicProcedure
    .input(z.object({ puzzleId: z.number().int().positive(), limit: z.number().int().min(1).max(100).default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const leaderboard = await db
        .select({
          userId: userPuzzleAttempts.userId,
          score: userPuzzleAttempts.score,
          timeSpent: userPuzzleAttempts.timeSpent,
          solvedAt: userPuzzleAttempts.createdAt,
        })
        .from(userPuzzleAttempts)
        .where(and(eq(userPuzzleAttempts.puzzleId, input.puzzleId), eq(userPuzzleAttempts.isCorrect, true)))
        .orderBy(desc(userPuzzleAttempts.score))
        .limit(input.limit);

      return leaderboard;
    }),

  // â”€â”€â”€ Certifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Get user's certifications
   */
  myCertifications: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

    const certs = await db
      .select()
      .from(certifications)
      .where(
        and(
          eq(certifications.userId, ctx.user.id),
          eq(certifications.status, "active")
        )
      )
      .orderBy(desc(certifications.issuedAt));

    // Get course details for each certificate
    const withCourses = await Promise.all(
      certs.map(async (cert) => {
        const [course] = await db
          .select()
          .from(courses)
          .where(eq(courses.id, cert.courseId))
          .limit(1);
        return { ...cert, course };
      })
    );

    return withCourses;
  }),

  /**
   * Verify a certificate by token
   */
  verifyCertificate: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const [cert] = await db
        .select()
        .from(certifications)
        .where(eq(certifications.verificationToken, input.token))
        .limit(1);

      if (!cert) throw new TRPCError({ code: "NOT_FOUND", message: "Certificate not found." });

      if (cert.status !== "active") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Certificate is no longer active." });
      }

      if (cert.expiresAt && cert.expiresAt < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Certificate has expired." });
      }

      // Get course details
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, cert.courseId))
        .limit(1);

      return { ...cert, course, isValid: true };
    }),

  // â”€â”€â”€ User Progress â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Get user's overall learning stats
   */
  myStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

    const enrollments = await db
      .select()
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, ctx.user.id));

    const completedCourses = enrollments.filter((e) => e.status === "completed").length;
    const inProgressCourses = enrollments.filter((e) => e.status === "in_progress").length;

    const achievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, ctx.user.id));

    const puzzleAttempts = await db
      .select()
      .from(userPuzzleAttempts)
      .where(eq(userPuzzleAttempts.userId, ctx.user.id));

    const solvedPuzzles = puzzleAttempts.filter((a) => a.isCorrect).length;
    const totalPoints = puzzleAttempts.reduce((sum, a) => sum + a.score, 0);

    return {
      enrolledCourses: enrollments.length,
      completedCourses,
      inProgressCourses,
      achievements: achievements.length,
      puzzlesSolved: solvedPuzzles,
      totalPoints,
      certifications: enrollments.filter((e) => e.certificateId).length,
    };
  }),
});

