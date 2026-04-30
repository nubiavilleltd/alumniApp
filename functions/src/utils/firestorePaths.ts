import { db } from '../config/firebase';

const EVENT_SURVEYS_COLLECTION = 'eventSurveys';

export function eventSurveyRef(eventId: string) {
  return db.collection(EVENT_SURVEYS_COLLECTION).doc(eventId);
}

export function formsCollection(eventId: string) {
  return eventSurveyRef(eventId).collection('forms');
}

export function formRef(eventId: string, formId: string) {
  return formsCollection(eventId).doc(formId);
}

export function formVersionsCollection(eventId: string, formId: string) {
  return formRef(eventId, formId).collection('versions');
}

export function formVersionRef(eventId: string, formId: string, versionId: string) {
  return formVersionsCollection(eventId, formId).doc(versionId);
}

export function registrationsCollection(eventId: string) {
  return eventSurveyRef(eventId).collection('registrations');
}

export function registrationRef(eventId: string, userId: string) {
  return registrationsCollection(eventId).doc(userId);
}
