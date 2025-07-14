"use server";

import { shouldAttemptLootSteal, type LootAttemptInput, type LootAttemptOutput } from "@/ai/flows/loot-attempt-ai";

export async function handleLootAttempt(input: LootAttemptInput): Promise<LootAttemptOutput> {
  try {
    const output = await shouldAttemptLootSteal(input);
    return output;
  } catch (error) {
    console.error("AI loot attempt flow failed:", error);
    return {
        attemptSteal: false,
        reasoning: "An unexpected error occurred in the AI's decision process. The NPC seems confused and does nothing."
    }
  }
}
