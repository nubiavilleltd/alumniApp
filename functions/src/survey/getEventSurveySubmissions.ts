import { onRequest } from 'firebase-functions/v2/https';
import { registrationsCollection } from '../utils/firestorePaths';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import { toIsoString } from '../utils/serializers';
import type {
  GetEventSurveySubmissionsRequest,
  GetEventSurveySubmissionsResponse,
} from '../types/survey';

export const getEventSurveySubmissions = onRequest(getSurveyRequestOptions(), async (req, res) =>
  handleSurveyHttpRequest<GetEventSurveySubmissionsRequest, GetEventSurveySubmissionsResponse>(
    req,
    res,
    async ({ body }) => {
      const snapshot = await registrationsCollection(body.eventId).get();
      const submissions = snapshot.docs
        .map((doc) => {
          const data = doc.data() as any;

          return {
            userId: data.userId || doc.id,
            userName: data.userName || '',
            userEmail: data.userEmail || '',
            rsvpStatus: data.rsvpStatus || 'going',
            submittedAt: toIsoString(data.submittedAt),
            updatedAt: toIsoString(data.updatedAt),
            hasSurveyResponse:
              (Array.isArray(data.formVersions) && data.formVersions.length > 0) ||
              (Array.isArray(data.answers) && data.answers.length > 0),
          };
        })
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.submittedAt || 0).getTime() -
            new Date(a.updatedAt || a.submittedAt || 0).getTime(),
        );

      return {
        eventId: body.eventId,
        submissions,
      };
    },
    { adminOnly: true },
  ),
);
