import { FieldValue } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import { formRef } from '../utils/firestorePaths';
import { HttpError } from '../utils/errors';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import type {
  ArchiveEventSurveyFormRequest,
  ArchiveEventSurveyFormResponse,
} from '../types/survey';

export const archiveEventSurveyForm = onRequest(getSurveyRequestOptions(), async (req, res) =>
  handleSurveyHttpRequest<ArchiveEventSurveyFormRequest, ArchiveEventSurveyFormResponse>(
    req,
    res,
    async ({ body, user }) => {
      const targetRef = formRef(body.eventId, body.formId);

      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(targetRef);

        if (!snapshot.exists) {
          throw new HttpError(404, 'Survey form not found.');
        }

        transaction.set(
          targetRef,
          {
            isActive: false,
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: user.id,
          },
          { merge: true },
        );
      });

      return { success: true };
    },
    { adminOnly: true },
  ),
);
