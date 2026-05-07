import type { FirebaseSurveyQuestion } from '../../types/survey';
import { HttpError } from '../../utils/errors';

const allowedQuestionTypes = new Set([
  'short_answer',
  'long_answer',
  'multiple_choice',
  'checkbox',
  'dropdown',
]);

const choiceQuestionTypes = new Set(['multiple_choice', 'checkbox', 'dropdown']);

type ValidateSurveyFormInput = {
  name: unknown;
  sortOrder: unknown;
  questions: unknown;
};

export function validateSurveyForm(input: ValidateSurveyFormInput) {
  const name = String(input.name ?? '').trim();
  const sortOrder = Number(input.sortOrder);

  if (!name) {
    throw new HttpError(400, 'Form name is required.');
  }

  if (!Number.isFinite(sortOrder)) {
    throw new HttpError(400, 'Form sortOrder must be a valid number.');
  }

  if (!Array.isArray(input.questions) || input.questions.length === 0) {
    throw new HttpError(400, 'A form must contain at least one question.');
  }

  const normalizedQuestions = input.questions
    .map((item, index) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw new HttpError(400, `Question ${index + 1} is invalid.`);
      }

      const rawQuestion = item as Record<string, unknown>;
      const type = String(rawQuestion.type ?? '').trim();
      const label = String(rawQuestion.label ?? '').trim();
      const placeholder = String(rawQuestion.placeholder ?? '').trim();
      const required = Boolean(rawQuestion.required);
      const order = Number(rawQuestion.order ?? index + 1);

      if (!label) {
        throw new HttpError(400, `Question ${index + 1} label is required.`);
      }

      if (!allowedQuestionTypes.has(type)) {
        throw new HttpError(400, `Question "${label}" has an unsupported type.`);
      }

      const options = Array.isArray(rawQuestion.options)
        ? rawQuestion.options.map((option) => String(option).trim()).filter(Boolean)
        : [];
      const rawMaxSelections = Number(rawQuestion.maxSelections);

      if (choiceQuestionTypes.has(type) && options.length < 2) {
        throw new HttpError(400, `Question "${label}" must have at least two options.`);
      }

      const maxSelections =
        type === 'checkbox' && Number.isFinite(rawMaxSelections) && rawMaxSelections >= 1
          ? Math.min(Math.floor(rawMaxSelections), options.length)
          : null;

      return {
        id: String(rawQuestion.id ?? `q${index + 1}`),
        label,
        type: type as FirebaseSurveyQuestion['type'],
        required,
        placeholder,
        options,
        maxSelections,
        order: Number.isFinite(order) ? order : index + 1,
      };
    })
    .sort((a, b) => a.order - b.order)
    .map((question, index) => ({
      ...question,
      id: question.id || `q${index + 1}`,
      order: index + 1,
    }));

  const seenIds = new Set<string>();
  normalizedQuestions.forEach((question) => {
    if (seenIds.has(question.id)) {
      throw new HttpError(400, `Duplicate question ID "${question.id}" detected.`);
    }

    seenIds.add(question.id);
  });

  return {
    name,
    sortOrder,
    questions: normalizedQuestions,
  };
}
