import { SelectPrompt, SelectPromptOptions } from "./selectPrompt.js";
import { TextPromptOptions, TextPrompt } from "./textPrompt.js";

export type PromptOptions = TextPromptOptions | SelectPromptOptions;

const map: Record<string, any> = {
  text: TextPrompt,
  select: SelectPrompt
};

async function runPrompt(questions: PromptOptions) {
  const PromotClass = map[questions.type];

  if (!PromotClass) {
    return null;
  }

  return new Promise((resolve) => {
    const prompt = new PromotClass(questions);

    prompt.render();

    prompt.on("submit", (answer: string) => {
      resolve(answer);
    });
  });
}

export async function prompt(questions: PromptOptions[]) {
  const answers: Record<string, any> = {};

  for (let i = 0; i < questions.length; i++) {
    const name = questions[i].name;

    answers[name] = await runPrompt(questions[i]);
  }

  return answers;
}
