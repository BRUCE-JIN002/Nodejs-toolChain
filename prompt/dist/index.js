var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SelectPrompt } from "./selectPrompt.js";
import { TextPrompt } from "./textPrompt.js";
const map = {
    text: TextPrompt,
    select: SelectPrompt
};
function runPrompt(questions) {
    return __awaiter(this, void 0, void 0, function* () {
        const PromotClass = map[questions.type];
        if (!PromotClass) {
            return null;
        }
        return new Promise((resolve) => {
            const prompt = new PromotClass(questions);
            prompt.render();
            prompt.on("submit", (answer) => {
                resolve(answer);
            });
        });
    });
}
export function prompt(questions) {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = {};
        for (let i = 0; i < questions.length; i++) {
            const name = questions[i].name;
            answers[name] = yield runPrompt(questions[i]);
        }
        return answers;
    });
}
