import { useEffect, useId, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

type GoogleCredentialResponse = {
  credential?: string;
  select_by?: string;
};

type GoogleButtonTheme = 'outline' | 'filled_blue' | 'filled_black';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: GoogleButtonTheme;
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  label?: string;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  disabled?: boolean;
  className?: string;
  onCredential: (idToken: string) => void | Promise<void>;
}

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${GOOGLE_SCRIPT_SRC}"]`,
      );

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Google script failed')), {
          once: true,
        });
        return;
      }

      const script = document.createElement('script');
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google script failed'));
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export function GoogleAuthButton({
  label = 'Continue with Google',
  text = 'continue_with',
  disabled = false,
  className = '',
  onCredential,
}: GoogleAuthButtonProps) {
  const buttonId = useId();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  useEffect(() => {
    let isMounted = true;

    if (!clientId) {
      setError('Google sign-in is not configured.');
      return;
    }

    loadGoogleScript()
      .then(() => {
        if (!isMounted || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        buttonRef.current.innerHTML = '';
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) {
              setError('We could not continue with Google. Please try again.');
              return;
            }

            void onCredential(response.credential);
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'pill',
          width: buttonRef.current.offsetWidth || 320,
        });
        setIsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load Google sign-in. Please check your connection.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [clientId, onCredential, text]);

  return (
    <div className="auth-google-signin" aria-live="polite">
      <div
        className={`auth-social-button auth-google-signin__visual ${className}`}
        aria-hidden="true"
      >
        <svg className="auth-social-icon auth-social-icon--google" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.5 12.27c0-.84-.08-1.64-.22-2.42H12v4.58h6.44a5.5 5.5 0 0 1-2.39 3.61v2.95h3.87c2.26-2.08 3.58-5.14 3.58-8.72Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-2.95c-1.08.72-2.45 1.14-4.08 1.14-3.13 0-5.77-2.1-6.72-4.93H1.29v3.05A12 12 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.35A7.21 7.21 0 0 1 4.9 12c0-.82.13-1.61.38-2.35V6.6H1.29A12 12 0 0 0 0 12c0 1.94.47 3.77 1.29 5.4l3.99-3.05Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.72c1.76 0 3.34.6 4.58 1.78l3.44-3.38C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.29 6.6l3.99 3.05C6.23 6.82 8.87 4.72 12 4.72Z"
          />
        </svg>
        <span className="auth-social-button__text">{label}</span>
      </div>
      <div
        id={buttonId}
        ref={buttonRef}
        className={
          disabled
            ? 'auth-google-signin__button auth-google-signin__button--disabled'
            : 'auth-google-signin__button'
        }
        aria-label={label}
      />
      {!isReady && !error ? (
        <div className="auth-google-signin__loading">
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          <span>Loading Google...</span>
        </div>
      ) : null}
      {error ? <p className="auth-field-error">{error}</p> : null}
    </div>
  );
}
