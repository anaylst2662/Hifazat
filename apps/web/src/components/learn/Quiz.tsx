"use client";

import { useState } from "react";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import { format } from "@/i18n/format";
import { Card } from "../ui/Card";
import { buttonClass } from "../ui/styles";

type Question = { prompt: string; options: string[]; correct: number; explanation?: string };
type Text = {
  quizQuestionOf: string; quizCorrect: string; quizNotQuite: string; quizNext: string;
  quizFinish: string; quizResult: string; quizPrivacy: string; quizRetry: string;
};

/** A simple quiz. Answers and scores stay in this page only: never saved or sent. */
export function Quiz({ questions, text }: { questions: Question[]; text: Text }) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const last = index === questions.length - 1;

  function choose(option: number) {
    if (chosen !== null) return;
    setChosen(option);
    if (option === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (last) return setDone(true);
    setIndex((i) => i + 1);
    setChosen(null);
  }
  function restart() {
    setIndex(0);
    setChosen(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <Card className="space-y-4 text-center" data-testid="quiz-result">
        <p className="text-xl font-semibold text-ink">{format(text.quizResult, { score, total: questions.length })}</p>
        <p className="text-sm text-ink-soft">{text.quizPrivacy}</p>
        <button type="button" onClick={restart} className={buttonClass("secondary")}>
          <RotateCcw aria-hidden="true" className="size-5" />
          {text.quizRetry}
        </button>
      </Card>
    );
  }

  return (
    <Card className="space-y-4" data-testid="quiz">
      <p className="text-sm font-medium text-ink-soft">{format(text.quizQuestionOf, { n: index + 1, total: questions.length })}</p>
      <fieldset className="space-y-3">
        <legend className="mb-3 text-lg font-semibold text-ink">{q.prompt}</legend>
        {q.options.map((option, i) => {
          const isChosen = chosen === i;
          const isRight = chosen !== null && i === q.correct;
          const look = isRight
            ? "border-learn bg-learn-soft"
            : isChosen
              ? "border-danger/50 bg-danger-soft"
              : "border-line bg-surface hover:border-ink-soft/50";
          return (
            <button
              key={i}
              type="button"
              aria-pressed={isChosen}
              disabled={chosen !== null && !isChosen && !isRight}
              onClick={() => choose(i)}
              className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-2 text-start text-ink transition ${look}`}
            >
              {isRight ? (
                <CircleCheck aria-hidden="true" className="size-5 shrink-0 text-learn" />
              ) : isChosen ? (
                <CircleX aria-hidden="true" className="size-5 shrink-0 text-danger" />
              ) : (
                <span aria-hidden="true" className="size-5 shrink-0 rounded-full border-2 border-line" />
              )}
              {option}
            </button>
          );
        })}
      </fieldset>
      {chosen !== null && (
        <div aria-live="polite" className="space-y-3">
          <p className="font-semibold text-ink">{chosen === q.correct ? text.quizCorrect : text.quizNotQuite}</p>
          {q.explanation && <p className="text-ink-soft">{q.explanation}</p>}
          <button type="button" onClick={next} className={buttonClass("primary", "w-full")} data-testid="quiz-next">
            {last ? text.quizFinish : text.quizNext}
          </button>
        </div>
      )}
      <p className="text-sm text-ink-soft">{text.quizPrivacy}</p>
    </Card>
  );
}
