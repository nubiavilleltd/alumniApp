import { onRequest } from 'firebase-functions/v2/https';
import { registrationRef, formVersionRef } from '../utils/firestorePaths';
import { HttpError } from '../utils/errors';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import { serializeRegistration } from '../utils/serializers';
import type {
  EventSurveySubmissionFormView,
  GetEventSurveySubmissionDetailRequest,
  GetEventSurveySubmissionDetailResponse,
} from '../types/survey';

export const getEventSurveySubmissionDetail = onRequest(
  getSurveyRequestOptions(),
  async (req, res) =>
    handleSurveyHttpRequest<
      GetEventSurveySubmissionDetailRequest,
      GetEventSurveySubmissionDetailResponse
    >(
      req,
      res,
      async ({ body }) => {
        const snapshot = await registrationRef(body.eventId, body.userId).get();

        if (!snapshot.exists) {
          throw new HttpError(404, 'Survey submission not found.');
        }

        const registration = serializeRegistration(snapshot.data() as any);
        const answersByQuestionId = new Map(
          registration.answers.map((answer) => [answer.questionId, answer.value] as const),
        );

        const forms = (
          await Promise.all(
            registration.formVersions.map(async (formVersion) => {
              const versionSnapshot = await formVersionRef(
                body.eventId,
                formVersion.formId,
                formVersion.formVersionId,
              ).get();

              if (!versionSnapshot.exists) {
                return null;
              }

              const versionData = versionSnapshot.data() as any;
              const questions = Array.isArray(versionData?.questions)
                ? versionData.questions
                    .filter((question: unknown) => question && typeof question === 'object')
                    .sort((a: any, b: any) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
                    .map((question: any) => ({
                      id: String(question.id ?? ''),
                      label: String(question.label ?? ''),
                      type: question.type,
                      required: Boolean(question.required),
                      placeholder: String(question.placeholder ?? ''),
                      options: Array.isArray(question.options)
                        ? question.options.map((option: unknown) => String(option))
                        : [],
                      maxSelections:
                        question.type === 'checkbox' &&
                        Number.isFinite(Number(question.maxSelections)) &&
                        Number(question.maxSelections) >= 1
                          ? Math.min(
                              Math.floor(Number(question.maxSelections)),
                              Array.isArray(question.options) ? question.options.length : 0,
                            )
                          : null,
                      order: Number(question.order ?? 0),
                      value: answersByQuestionId.get(String(question.id ?? '')) ?? null,
                    }))
                : [];

              return {
                formId: formVersion.formId,
                formName: formVersion.formName,
                formVersionId: formVersion.formVersionId,
                formVersionNumber: formVersion.formVersionNumber,
                questions,
              } satisfies EventSurveySubmissionFormView;
            }),
          )
        ).filter((form): form is EventSurveySubmissionFormView => form !== null);

        return {
          registration,
          forms,
        };
      },
      { adminOnly: true },
    ),
);
