import { QUIZ_SEED } from "@/data/quiz-seed";
import { QUIZ_QUESTION_COUNT, QUIZ_TOPIC_CATEGORIES } from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type {
  Letter,
  ModerationStatus,
  QuizAnswer,
  QuizAttempt,
  QuizCategory,
  QuizDifficulty,
  QuizQuestion,
} from "@/lib/types";

interface MemoryStore {
  attempts: QuizAttempt[];
  letters: Letter[];
}

declare global {
  var __remember625Store: MemoryStore | undefined;
}

const memory = globalThis.__remember625Store ?? { attempts: [], letters: [] };
globalThis.__remember625Store = memory;

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function mapQuestion(row: Record<string, unknown>): QuizQuestion {
  return {
    id: String(row.id),
    category: row.category as QuizCategory,
    difficulty: row.difficulty as QuizDifficulty,
    question: String(row.question),
    options: row.options as string[],
    correctAnswerIndex: Number(row.correct_answer_index),
    explanation: String(row.explanation),
    sourceTitle: row.source_title ? String(row.source_title) : null,
    sourceUrl: row.source_url ? String(row.source_url) : null,
  };
}

function mapAttempt(row: Record<string, unknown>): QuizAttempt {
  const answers = row.answers as QuizAnswer[];
  const answerCategories = new Set(
    answers
      .map((answer) => answer.category)
      .filter((category): category is QuizCategory => Boolean(category)),
  );
  return {
    id: String(row.id),
    sessionId: String(row.session_id),
    clientRunId: String(row.client_run_id),
    category:
      answerCategories.size > 1 ? "mixed" : (row.category as QuizCategory),
    difficulty: row.difficulty as QuizDifficulty,
    score: Number(row.score),
    totalQuestions: Number(row.total_questions),
    answers,
    completedAt: String(row.completed_at),
    createdAt: String(row.created_at),
  };
}

function mapLetter(row: Record<string, unknown>): Letter {
  return {
    id: String(row.id),
    quizAttemptId: row.quiz_attempt_id ? String(row.quiz_attempt_id) : null,
    sessionId: String(row.session_id),
    nickname: String(row.nickname || "익명"),
    content: String(row.content),
    aiDraftUsed: Boolean(row.ai_draft_used),
    relatedCategory: (row.related_category as QuizCategory) || null,
    moderationStatus: row.moderation_status as ModerationStatus,
    isPublic: Boolean(row.is_public),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function pickBalancedRandomQuestions(items: QuizQuestion[]) {
  const byCategory = new Map<QuizCategory, QuizQuestion[]>();
  for (const item of items) {
    if (item.category === "mixed") continue;
    byCategory.set(item.category, [
      ...(byCategory.get(item.category) ?? []),
      item,
    ]);
  }
  for (const [category, bucket] of byCategory) {
    byCategory.set(category, shuffle(bucket));
  }

  const selected: QuizQuestion[] = [];
  const categories = shuffle(QUIZ_TOPIC_CATEGORIES);
  let madeProgress = true;

  while (selected.length < QUIZ_QUESTION_COUNT && madeProgress) {
    madeProgress = false;
    for (const category of categories) {
      const next = byCategory.get(category)?.shift();
      if (!next) continue;
      selected.push(next);
      madeProgress = true;
      if (selected.length === QUIZ_QUESTION_COUNT) break;
    }
  }

  const selectedIds = new Set(selected.map((item) => item.id));
  const fallback = shuffle(items.filter((item) => !selectedIds.has(item.id)));
  return shuffle([...selected, ...fallback].slice(0, QUIZ_QUESTION_COUNT));
}

export async function getQuestions(
  category: QuizCategory,
  difficulty: QuizDifficulty,
) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("category", category)
      .eq("difficulty", difficulty)
      .eq("is_active", true)
      .limit(50);
    if (data && data.length >= QUIZ_QUESTION_COUNT)
      return shuffle(data.map(mapQuestion)).slice(0, QUIZ_QUESTION_COUNT);
  }
  return shuffle(
    QUIZ_SEED.filter(
      (item) => item.category === category && item.difficulty === difficulty,
    ),
  ).slice(0, QUIZ_QUESTION_COUNT);
}

export async function getRandomQuestions() {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("difficulty", "normal")
      .eq("is_active", true)
      .limit(200);
    if (data && data.length >= QUIZ_QUESTION_COUNT)
      return pickBalancedRandomQuestions(data.map(mapQuestion));
  }
  return pickBalancedRandomQuestions(
    QUIZ_SEED.filter((item) => item.difficulty === "normal"),
  );
}

export async function getQuestion(id: string) {
  const local = QUIZ_SEED.find((item) => item.id === id);
  if (local) return local;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  return data ? mapQuestion(data) : null;
}

export async function saveQuizAttempt(
  input: Omit<QuizAttempt, "id" | "completedAt" | "createdAt">,
) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const existing = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("session_id", input.sessionId)
      .eq("client_run_id", input.clientRunId)
      .maybeSingle();
    if (existing.data) return mapAttempt(existing.data);
    const insertAttempt = (category: QuizCategory) =>
      supabase
        .from("quiz_attempts")
        .insert({
          session_id: input.sessionId,
          client_run_id: input.clientRunId,
          category,
          difficulty: input.difficulty,
          score: input.score,
          total_questions: input.totalQuestions,
          answers: input.answers,
        })
        .select("*")
        .single();
    let { data, error } = await insertAttempt(input.category);
    if (error && input.category === "mixed") {
      const fallbackCategory =
        input.answers.find((answer) => answer.category)?.category ?? "memorial";
      const fallback = await insertAttempt(fallbackCategory);
      data = fallback.data;
      error = fallback.error;
    }
    if (error) {
      const retry = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("session_id", input.sessionId)
        .eq("client_run_id", input.clientRunId)
        .maybeSingle();
      if (retry.data) return mapAttempt(retry.data);
      throw error;
    }
    return mapAttempt(data);
  }
  const existing = memory.attempts.find(
    (item) =>
      item.sessionId === input.sessionId &&
      item.clientRunId === input.clientRunId,
  );
  if (existing) return existing;
  const now = new Date().toISOString();
  const attempt: QuizAttempt = {
    ...input,
    id: crypto.randomUUID(),
    completedAt: now,
    createdAt: now,
  };
  memory.attempts.push(attempt);
  return attempt;
}

export async function getQuizAttempt(id: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data ? mapAttempt(data) : null;
  }
  return memory.attempts.find((item) => item.id === id) ?? null;
}

export async function getTotalQuizAttempts() {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { count, error } = await supabase
      .from("quiz_attempts")
      .select("id", { count: "exact", head: true });
    if (!error) return count ?? 0;
  }
  return memory.attempts.length;
}

export async function saveLetter(
  input: Omit<Letter, "id" | "createdAt" | "updatedAt">,
) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const insertLetter = (relatedCategory: QuizCategory | null) =>
      supabase
        .from("letters")
        .insert({
          quiz_attempt_id: input.quizAttemptId,
          session_id: input.sessionId,
          nickname: input.nickname,
          content: input.content,
          ai_draft_used: input.aiDraftUsed,
          related_category: relatedCategory,
          moderation_status: input.moderationStatus,
          is_public: input.isPublic,
        })
        .select("*")
        .single();
    let { data, error } = await insertLetter(input.relatedCategory);
    if (error && input.relatedCategory === "mixed") {
      const fallback = await insertLetter("memorial");
      data = fallback.data;
      error = fallback.error;
    }
    if (error) throw error;
    return mapLetter(data);
  }
  const now = new Date().toISOString();
  const letter: Letter = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  memory.letters.unshift(letter);
  return letter;
}

export async function getLetter(id: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("letters")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data ? mapLetter(data) : null;
  }
  return memory.letters.find((item) => item.id === id) ?? null;
}

export async function getPublicLetters(page = 1, limit = 9) {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * limit;
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, count, error } = await supabase
      .from("letters")
      .select("*", { count: "exact" })
      .eq("moderation_status", "approved")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);
    if (!error)
      return { letters: (data ?? []).map(mapLetter), total: count ?? 0 };
  }
  const visible = memory.letters.filter(
    (item) => item.moderationStatus === "approved" && item.isPublic,
  );
  return { letters: visible.slice(from, from + limit), total: visible.length };
}

export async function getAdminStats() {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const [{ data: attempts }, { data: letters }] = await Promise.all([
      supabase.from("quiz_attempts").select("category"),
      supabase
        .from("letters")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    const mapped = (letters ?? []).map(mapLetter);
    return buildStats(
      (attempts ?? []) as {
        category: QuizCategory;
      }[],
      mapped.slice(0, 20),
      mapped.length,
      mapped,
    );
  }
  return buildStats(
    memory.attempts,
    memory.letters.slice(0, 20),
    memory.letters.length,
  );
}

function buildStats(
  attempts: { category: QuizCategory }[],
  recentLetters: Letter[],
  totalLetters = recentLetters.length,
  allLetters = memory.letters,
) {
  const byCategory: Record<string, number> = {};
  for (const attempt of attempts) {
    byCategory[attempt.category] = (byCategory[attempt.category] ?? 0) + 1;
  }
  return {
    totalQuizAttempts: attempts.length,
    totalLetters,
    publicLetters: allLetters.filter(
      (item) => item.moderationStatus === "approved" && item.isPublic,
    ).length,
    reviewLetters: allLetters.filter(
      (item) => item.moderationStatus !== "approved" || !item.isPublic,
    ).length,
    byCategory,
    recentLetters,
  };
}

export async function moderateStoredLetter(
  id: string,
  action: "approve" | "hide" | "reject",
) {
  const status: ModerationStatus =
    action === "approve"
      ? "approved"
      : action === "hide"
        ? "hidden"
        : "rejected";
  const isPublic = action === "approve";
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("letters")
      .update({ moderation_status: status, is_public: isPublic })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return mapLetter(data);
  }
  const letter = memory.letters.find((item) => item.id === id);
  if (!letter) return null;
  letter.moderationStatus = status;
  letter.isPublic = isPublic;
  letter.updatedAt = new Date().toISOString();
  return letter;
}
