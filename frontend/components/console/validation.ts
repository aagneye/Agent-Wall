const MIN_PROMPT_LENGTH = 8;
const MAX_PROMPT_LENGTH = 240;

export function validatePromptInput(input: string): string | null {
  const trimmed = input.trim();

  if (trimmed.length < MIN_PROMPT_LENGTH) {
    return `Prompt must be at least ${MIN_PROMPT_LENGTH} characters.`;
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return `Prompt must be at most ${MAX_PROMPT_LENGTH} characters.`;
  }

  return null;
}
