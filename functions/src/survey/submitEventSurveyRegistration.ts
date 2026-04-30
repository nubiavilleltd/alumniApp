import { FieldValue } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import type {
  ActiveSurveyFormView,
  SubmitEventSurveyRegistrationRequest,
  SubmitEventSurveyRegistrationResponse,
} from '../types/survey';
import { eventSurveyRef, formRef, formsCollection, registrationRef } from '../utils/firestorePaths';
import { HttpError } from '../utils/errors';
import { getSurveyRequestOptions, handleSurveyHttpRequest } from '../utils/http';
import { serializeRegistration } from '../utils/serializers';
import { validateSurveyAnswers } from './validators/validateSurveyAnswers';

export const submitEventSurveyRegistration = onRequest(
  getSurveyRequestOptions(),
  async (req, res) =>
    handleSurveyHttpRequest<
      SubmitEventSurveyRegistrationRequest,
      SubmitEventSurveyRegistrationResponse
    >(req, res, async ({ body, user }) => {
      if (!['going', 'maybe', 'not_going'].includes(body.rsvpStatus)) {
        throw new HttpError(400, 'Invalid RSVP status.');
      }

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

      const validatedAnswers = validateSurveyAnswers(activeForms, body.answers);
      const targetRegistrationRef = registrationRef(body.eventId, user.id);

      await db.runTransaction(async (transaction) => {
        const rootRef = eventSurveyRef(body.eventId);
        const rootSnapshot = await transaction.get(rootRef);
        const registrationSnapshot = await transaction.get(targetRegistrationRef);

        transaction.set(
          rootRef,
          {
            eventId: body.eventId,
            ...(body.eventTitleSnapshot
              ? { eventTitleSnapshot: body.eventTitleSnapshot.trim() }
              : {}),
            hasForms: rootSnapshot.data()?.hasForms ?? activeForms.length > 0,
            hasRegistrations: true,
            createdAt: rootSnapshot.exists
              ? rootSnapshot.data()?.createdAt
              : FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        activeForms.forEach((form) => {
          transaction.set(
            formRef(body.eventId, form.id),
            {
              hasSubmissions: true,
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
        });

        transaction.set(
          targetRegistrationRef,
          {
            eventId: body.eventId,
            eventTitleSnapshot: body.eventTitleSnapshot?.trim() || '',
            userId: user.id,
            userName: user.fullName,
            userEmail: user.email,
            rsvpStatus: body.rsvpStatus,
            additionalInfo: String(body.additionalInfo ?? '').trim(),
            formVersions: validatedAnswers.formVersions,
            answers: validatedAnswers.answers,
            submittedAt: registrationSnapshot.exists
              ? registrationSnapshot.data()?.submittedAt
              : FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      });

      const savedRegistration = await targetRegistrationRef.get();

      return {
        registration: serializeRegistration(savedRegistration.data() as any),
      };
    }),
);
