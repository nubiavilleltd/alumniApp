export interface PasswordCriterion {
  label: string;
  met: boolean;
}

export interface PasswordStrengthResult {
  score: number;
  label: 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong';
  suggestions: string[];
  criteria: PasswordCriterion[];
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  const criteria: PasswordCriterion[] = [
    { label: 'Use at least 8 characters', met: password.length >= 8 },
    { label: 'Aim for 12+ characters', met: password.length >= 12 },
    { label: 'Add a lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Add an uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Include a number', met: /\d/.test(password) },
    { label: 'Include a special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = criteria.filter((criterion) => criterion.met).length;

  const suggestions = criteria
    .filter((criterion) => !criterion.met)
    .slice(0, 3)
    .map((criterion) => criterion.label);

  if (score <= 1) {
    return { score, label: 'Very weak', suggestions, criteria };
  }

  if (score <= 3) {
    return { score, label: 'Weak', suggestions, criteria };
  }

  if (score === 4) {
    return { score, label: 'Fair', suggestions, criteria };
  }

  if (score === 5) {
    return { score, label: 'Strong', suggestions, criteria };
  }

  return { score, label: 'Very strong', suggestions, criteria };
}
