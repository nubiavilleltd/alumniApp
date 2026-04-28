import { Navigate } from 'react-router-dom';
import { ALUMNI_ROUTES } from '../routes';

export function AlumniRedirectPage() {
  return <Navigate to={ALUMNI_ROUTES.PROFILES} replace />;
}
