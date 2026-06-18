import { FieldValue } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import { eventSurveyRef, formRef, formVersionRef, formsCollection } from '../utils/firestorePaths';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import { validateSurveyForm } from './validators/validateSurveyForm';
import type { UpsertEventSurveyFormRequest, UpsertEventSurveyFormResponse } from '../types/survey';

export const upsertEventSurveyForm = onRequest(getSurveyRequestOptions(), async (req, res) =>
  handleSurveyHttpRequest<UpsertEventSurveyFormRequest, UpsertEventSurveyFormResponse>(
    req,
    res,
    async ({ body, user }) => {
      const normalized = validateSurveyForm({
        name: body.name,
        sortOrder: body.sortOrder,
        questions: body.questions,
      });

      const targetFormRef = body.formId
        ? formRef(body.eventId, body.formId)
        : formsCollection(body.eventId).doc();

      const nextVersionNumber = await db.runTransaction(async (transaction) => {
        const rootRef = eventSurveyRef(body.eventId);
        const rootSnapshot = await transaction.get(rootRef);
        const formSnapshot = await transaction.get(targetFormRef);
        const existingForm = formSnapshot.data() as Record<string, unknown> | undefined;
        const versionNumber = Number(existingForm?.activeVersionNumber ?? 0) + 1;
        const versionId = `v${versionNumber}`;

        transaction.set(
          rootRef,
          {
            eventId: body.eventId,
            ...(body.eventTitleSnapshot
              ? { eventTitleSnapshot: body.eventTitleSnapshot.trim() }
              : {}),
            hasForms: true,
            hasRegistrations: rootSnapshot.data()?.hasRegistrations ?? false,
            createdAt: rootSnapshot.exists
              ? rootSnapshot.data()?.createdAt
              : FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        transaction.set(
          targetFormRef,
          {
            eventId: body.eventId,
            name: normalized.name,
            sortOrder: normalized.sortOrder,
            isActive: true,
            activeVersionId: versionId,
            activeVersionNumber: versionNumber,
            activeSnapshot: {
              name: normalized.name,
              questions: normalized.questions,
            },
            hasSubmissions: existingForm?.hasSubmissions ?? false,
            createdBy: existingForm?.createdBy ?? user.id,
            createdByName: existingForm?.createdByName ?? user.fullName,
            createdAt: existingForm?.createdAt ?? FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: user.id,
          },
          { merge: true },
        );

        transaction.set(formVersionRef(body.eventId, targetFormRef.id, versionId), {
          versionNumber,
          name: normalized.name,
          sortOrder: normalized.sortOrder,
          questions: normalized.questions,
          createdBy: user.id,
          createdByName: user.fullName,
          createdAt: FieldValue.serverTimestamp(),
          status: 'published',
        });

        return versionNumber;
      });

      return {
        form: {
          id: targetFormRef.id,
          name: normalized.name,
          sortOrder: normalized.sortOrder,
          version: nextVersionNumber,
          questions: normalized.questions,
        },
      };
    },
    { adminOnly: true },
  ),
);
