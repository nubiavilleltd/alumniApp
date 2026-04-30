import { FieldValue } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import { formRef } from '../utils/firestorePaths';
import { HttpError } from '../utils/errors';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import type {
  ReorderEventSurveyFormsRequest,
  ReorderEventSurveyFormsResponse,
} from '../types/survey';

export const reorderEventSurveyForms = onRequest(getSurveyRequestOptions(), async (req, res) =>
  handleSurveyHttpRequest<ReorderEventSurveyFormsRequest, ReorderEventSurveyFormsResponse>(
    req,
    res,
    async ({ body, user }) => {
      if (!Array.isArray(body.forms) || body.forms.length === 0) {
        throw new HttpError(400, 'At least one form reorder item is required.');
      }

      const batch = db.batch();

      body.forms.forEach((item) => {
        const sortOrder = Number(item.sortOrder);

        if (!item.formId || !Number.isFinite(sortOrder)) {
          throw new HttpError(400, 'Each form reorder entry must include formId and sortOrder.');
        }

        batch.set(
          formRef(body.eventId, item.formId),
          {
            sortOrder,
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: user.id,
          },
          { merge: true },
        );
      });

      await batch.commit();

      return { success: true };
    },
    { adminOnly: true },
  ),
);
