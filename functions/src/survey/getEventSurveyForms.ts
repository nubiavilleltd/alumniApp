import { onRequest } from 'firebase-functions/v2/https';
import { formsCollection } from '../utils/firestorePaths';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import { serializeFormView } from '../utils/serializers';
import type { GetEventSurveyFormsRequest, GetEventSurveyFormsResponse } from '../types/survey';

export const getEventSurveyForms = onRequest(getSurveyRequestOptions(), async (req, res) =>
  handleSurveyHttpRequest<GetEventSurveyFormsRequest, GetEventSurveyFormsResponse>(
    req,
    res,
    async ({ body }) => {
      const snapshot = await formsCollection(body.eventId).get();
      const forms = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          data: doc.data() as any,
        }))
        .filter(({ data }) => data?.isActive === true)
        .sort((a, b) => Number(a.data?.sortOrder ?? 0) - Number(b.data?.sortOrder ?? 0));

      return {
        eventId: body.eventId,
        forms: forms.map(({ id, data }) => serializeFormView(id, data)),
      };
    },
  ),
);
