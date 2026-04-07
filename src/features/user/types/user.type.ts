export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface ChangePasswordResponse {
  status: 'success';
  message: string;
}
