import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.",
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { error: lettersError } = await supabase
    .from("letters")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (lettersError) throw lettersError;

  const { error: attemptsError } = await supabase
    .from("quiz_attempts")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (attemptsError) throw attemptsError;

  console.log("quiz_attempts와 letters를 모두 초기화했습니다.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
