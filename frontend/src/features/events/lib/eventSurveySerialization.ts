import type { EventRegistrationAnswerValue } from '../types/eventRegistrationForm.types';

interface SerializableSurveyForm {
  name: string;
  questions: Array<{
    id: string;
    label: string;
    order: number;
  }>;
}

interface SerializableSurveyAnswer {
  questionId: string;
  value: EventRegistrationAnswerValue;
}

function formatAnswerValueForText(value: EventRegistrationAnswerValue) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value.trim();
}

export function serializeRegistrationAnswersForAdditionalInfo(params: {
  forms: SerializableSurveyForm[];
  answers: SerializableSurveyAnswer[];
  additionalInfo: string;
}) {
  const { forms, answers, additionalInfo } = params;
  const lines: string[] = [];

  forms.forEach((form) => {
    lines.push(`Registration form: ${form.name}`);

    form.questions
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((question, index) => {
        const answer = answers.find((item) => item.questionId === question.id);
        const formattedValue = answer ? formatAnswerValueForText(answer.value) : '';

        lines.push(`${index + 1}. ${question.label}: ${formattedValue || '(no response)'}`);
      });

    lines.push('');
  });

  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  if (additionalInfo.trim()) {
    lines.push('', `Extra note: ${additionalInfo.trim()}`);
  }

  return lines.join('\n');
}
