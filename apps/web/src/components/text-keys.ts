// Which texts each browser-side component needs. Kept in a plain file so
// server pages can use these lists too.

export const TRUSTED_MESSAGE_TEXT = [
  "messageTitle",
  "messageNoContacts",
  "messageChooseContact",
  "messageLabel",
  "messageDefault",
  "messageAddLocation",
  "messageLocationHint",
  "messageLocating",
  "messageLocationFailed",
  "messageLocationLine",
  "messageSendSms",
  "messageSendWhatsapp",
  "messageConfirmNote",
  "planTitle",
] as const;

export const SAFETY_PLAN_TEXT = [
  "planPrivacyTitle",
  "planPrivacyBody",
  "planLoading",
  "planUnavailable",
  "planSavedNote",
  "planTrustedTitle",
  "planTrustedHint",
  "planPeopleTitle",
  "planPeopleHint",
  "planSafePlacesTitle",
  "planSafePlacesHint",
  "planTransportTitle",
  "planTransportHint",
  "planDocumentsTitle",
  "planDocumentsHint",
  "planItemsTitle",
  "planItemsHint",
  "planDocCnic",
  "planDocChildren",
  "planDocNikah",
  "planDocBank",
  "planDocMedical",
  "planDocProperty",
  "planItemPhone",
  "planItemMoney",
  "planItemKeys",
  "planItemMedicine",
  "planItemClothes",
  "planItemNumbers",
  "planName",
  "planPhone",
  "planAdd",
  "planAddYourOwn",
  "planRemove",
  "planEmpty",
  "planDeleteTitle",
  "planDeleteBody",
  "planDeleteConfirm",
  "planDeleteCancel",
  "planDeleted",
  "callAria",
] as const;

export const LEARN_BROWSER_TEXT = [
  "learnAudienceLabel", "learnAudienceAll", "learnTopicsTitle", "learnTopicAll", "learnScenariosTitle",
  "learnGuidesTitle", "learnQuizzesTitle", "learnCampaignsTitle", "learnEmpty", "sampleBadge",
  "typeArticle", "typeInfographic", "typeVideo", "typeFaq", "typeScenario", "typeQuiz", "typeCampaign",
] as const;

export const QUIZ_TEXT = [
  "quizQuestionOf", "quizCorrect", "quizNotQuite", "quizNext", "quizFinish", "quizResult", "quizPrivacy", "quizRetry",
] as const;
