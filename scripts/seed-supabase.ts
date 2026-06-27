import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
import { QUIZ_SEED } from "../src/data/quiz-seed";

loadEnvConfig(process.cwd());

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.",
    );

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const rows = QUIZ_SEED.map((item) => ({
    category: item.category,
    difficulty: item.difficulty,
    question: item.question,
    options: item.options,
    correct_answer_index: item.correctAnswerIndex,
    explanation: item.explanation,
    source_title: item.sourceTitle,
    source_url: item.sourceUrl,
    is_active: true,
  }));

  const { error: deleteError } = await supabase
    .from("quiz_questions")
    .delete()
    .in("category", ["battle", "person", "chronology", "un", "memorial"]);
  if (deleteError) throw deleteError;
  const { error } = await supabase.from("quiz_questions").insert(rows);
  if (error) throw error;
  console.log(`${rows.length}개 퀴즈 문제를 저장했습니다.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
