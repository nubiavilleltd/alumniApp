import type {
  ActiveSurveyFormView,
  FirebaseSurveyFormVersionRef,
  FirebaseSurveyStoredAnswer,
  SubmitEventSurveyAnswerInput,
} from '../../types/survey';
import { HttpError } from '../../utils/errors';

function isMeaningfulValue(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value.trim().length > 0;
}

function normalizeAnswerValue(
  rawValue: unknown,
  question: ActiveSurveyFormView['questions'][number],
) {
  const { type: questionType, options, label, required, maxSelections } = question;

  if (questionType === 'checkbox') {
    if (!Array.isArray(rawValue)) {
      throw new HttpError(400, `Question "${label}" must be submitted as an array.`);
    }

    const values = rawValue.map((value) => String(value).trim()).filter(Boolean);

    if (required && values.length === 0) {
      throw new HttpError(400, `Question "${label}" is required.`);
    }

    values.forEach((value) => {
      if (!options.includes(value)) {
        throw new HttpError(400, `Question "${label}" contains an invalid option.`);
      }
    });

    if (maxSelections !== null && values.length > maxSelections) {
      throw new HttpError(
        400,
        `Question "${label}" allows up to ${maxSelections} selection${
          maxSelections === 1 ? '' : 's'
        }.`,
      );
    }

    return values;
  }

  const value = String(rawValue ?? '').trim();

  if (required && !value) {
    throw new HttpError(400, `Question "${label}" is required.`);
  }

  if ((questionType === 'multiple_choice' || questionType === 'dropdown') && value) {
    if (!options.includes(value)) {
      throw new HttpError(400, `Question "${label}" contains an invalid option.`);
    }
  }

  return value;
}

export function validateSurveyAnswers(
  activeForms: ActiveSurveyFormView[],
  rawAnswers: SubmitEventSurveyAnswerInput[],
) {
  if (!Array.isArray(rawAnswers)) {
    throw new HttpError(400, 'Answers must be submitted as an array.');
  }

  if (activeForms.length === 0) {
    if (rawAnswers.length > 0) {
      throw new HttpError(400, 'This event does not currently have active survey forms.');
    }

    return {
      formVersions: [] as FirebaseSurveyFormVersionRef[],
      answers: [] as FirebaseSurveyStoredAnswer[],
    };
  }

  const answerMap = new Map<string, SubmitEventSurveyAnswerInput>();

  rawAnswers.forEach((answer, index) => {
    const formId = String(answer?.formId ?? '').trim();
    const questionId = String(answer?.questionId ?? '').trim();

    if (!formId || !questionId) {
      throw new HttpError(400, `Answer ${index + 1} is missing formId or questionId.`);
    }

    const key = `${formId}:${questionId}`;

    if (answerMap.has(key)) {
      throw new HttpError(400, `Duplicate answer submitted for ${key}.`);
    }

    answerMap.set(key, answer);
  });

  const formVersions: FirebaseSurveyFormVersionRef[] = [];
  const answers: FirebaseSurveyStoredAnswer[] = [];
  const expectedKeys = new Set<string>();

  activeForms.forEach((form) => {
    formVersions.push({
      formId: form.id,
      formVersionId: form.activeVersionId,
      formVersionNumber: form.activeVersionNumber,
      formName: form.name,
    });

    form.questions.forEach((question) => {
      const answerKey = `${form.id}:${question.id}`;
      expectedKeys.add(answerKey);
      const submittedAnswer = answerMap.get(answerKey);

      if (!submittedAnswer) {
        if (question.required) {
          throw new HttpError(400, `Question "${question.label}" is required.`);
        }

        return;
      }

      const normalizedValue = normalizeAnswerValue(submittedAnswer.value, question);

      if (!isMeaningfulValue(normalizedValue)) {
        if (question.required) {
          throw new HttpError(400, `Question "${question.label}" is required.`);
        }

        return;
      }

      answers.push({
        formId: form.id,
        formVersionId: form.activeVersionId,
        questionId: question.id,
        questionLabel: question.label,
        questionType: question.type,
        order: question.order,
        required: question.required,
        value: normalizedValue,
      });
    });
  });

  answerMap.forEach((_value, key) => {
    if (!expectedKeys.has(key)) {
      throw new HttpError(400, `Answer "${key}" does not match an active survey question.`);
    }
  });

  return {
    formVersions,
    answers: answers.sort((a, b) => a.order - b.order),
  };
}
