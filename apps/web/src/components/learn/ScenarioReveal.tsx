"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Card } from "../ui/Card";
import { buttonClass, sectionTitleClass } from "../ui/styles";
import { ContentBody } from "./ContentBody";

type Props = {
  situation: string;
  answer: string;
  actions: string | null;
  text: { scenarioSituationTitle: string; scenarioReveal: string; scenarioAnswerTitle: string; scenarioActionsTitle: string };
};

/** "Is this harassment?": read the situation, think, then reveal the answer. */
export function ScenarioReveal({ situation, answer, actions, text }: Props) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <Card className="space-y-2">
        <h2 className={sectionTitleClass}>{text.scenarioSituationTitle}</h2>
        <p className="text-ink">{situation}</p>
      </Card>
      {!shown ? (
        <button type="button" onClick={() => setShown(true)} className={buttonClass("primary", "w-full")} data-testid="scenario-reveal">
          <Eye aria-hidden="true" className="size-5" />
          {text.scenarioReveal}
        </button>
      ) : (
        <div className="space-y-4" aria-live="polite">
          <Card className="space-y-2 border-learn/30! bg-learn-soft!">
            <h2 className={sectionTitleClass}>{text.scenarioAnswerTitle}</h2>
            <p className="text-ink" data-testid="scenario-answer">{answer}</p>
          </Card>
          {actions && (
            <Card className="space-y-3">
              <h2 className={sectionTitleClass}>{text.scenarioActionsTitle}</h2>
              <ContentBody text={actions} />
            </Card>
          )}
        </div>
      )}
    </>
  );
}
