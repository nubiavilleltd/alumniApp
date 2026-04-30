import { onRequest } from 'firebase-functions/v2/https';
import type {
  ActiveSurveyFormView,
  ValidateEventSurveyRegistrationRequest,
  ValidateEventSurveyRegistrationResponse,
} from '../types/survey';
import { formsCollection } from '../utils/firestorePaths';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import { validateSurveyAnswers } from './validators/validateSurveyAnswers';

export const validateEventSurveyRegistration = onRequest(
  getSurveyRequestOptions(),
  async (req, res) =>
    handleSurveyHttpRequest<
      ValidateEventSurveyRegistrationRequest,
      ValidateEventSurveyRegistrationResponse
    >(req, res, async ({ body }) => {
      const formsSnapshot = await formsCollection(body.eventId).get();

      const activeForms = formsSnapshot.docs
        .map((doc) => {
          const data = doc.data() as any;
          const questions = Array.isArray(data?.activeSnapshot?.questions)
            ? data.activeSnapshot.questions
                .filter((question: unknown) => question && typeof question === 'object')
                .sort((a: any, b: any) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
            : [];

          return {
            id: doc.id,
            name: String(data?.name ?? ''),
            sortOrder: Number(data?.sortOrder ?? 0),
            version: Number(data?.activeVersionNumber ?? 1),
            activeVersionId: String(data?.activeVersionId ?? ''),
            activeVersionNumber: Number(data?.activeVersionNumber ?? 1),
            questions,
            isActive: data?.isActive === true,
          };
        })
        .filter((form) => form.isActive && form.activeVersionId) as ActiveSurveyFormView[];

      validateSurveyAnswers(activeForms, body.answers);

      return { success: true };
    }),
);
