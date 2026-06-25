import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

type FacebookLoginResponse = {
  authResponse?: {
    accessToken?: string;
  };
  status?: string;
};

type FacebookSdk = {
  init: (options: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
  login: (callback: (response: FacebookLoginResponse) => void, options: { scope: string }) => void;
};

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

interface FacebookAuthButtonProps {
  label?: string;
  disabled?: boolean;
  className?: string;
  onAccessToken: (accessToken: string) => void | Promise<void>;
}

const FACEBOOK_SCRIPT_SRC = 'https://connect.facebook.net/en_US/sdk.js';
const FACEBOOK_SDK_VERSION = 'v19.0';
let facebookScriptPromise: Promise<void> | null = null;

function loadFacebookScript(appId: string) {
  if (window.FB) {
    window.FB.init({ appId, cookie: true, xfbml: false, version: FACEBOOK_SDK_VERSION });
    return Promise.resolve();
  }

  if (!facebookScriptPromise) {
    facebookScriptPromise = new Promise((resolve, reject) => {
      window.fbAsyncInit = () => {
        window.FB?.init({ appId, cookie: true, xfbml: false, version: FACEBOOK_SDK_VERSION });
        resolve();
      };

      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${FACEBOOK_SCRIPT_SRC}"]`,
      );

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Facebook script failed')),
          { once: true },
        );
        return;
      }

      const script = document.createElement('script');
      script.src = FACEBOOK_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        if (!window.FB) {
          reject(new Error('Facebook SDK unavailable'));
          return;
        }

        window.FB.init({ appId, cookie: true, xfbml: false, version: FACEBOOK_SDK_VERSION });
        resolve();
      };
      script.onerror = () => reject(new Error('Facebook script failed'));
      document.head.appendChild(script);
    });
  }

  return facebookScriptPromise;
}

export function FacebookAuthButton({
  label = 'Continue with Facebook',
  disabled = false,
  className = '',
  onAccessToken,
}: FacebookAuthButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID?.trim();

  useEffect(() => {
    let isMounted = true;

    if (!appId) {
      setError('Facebook sign-in is not configured.');
      return;
    }

    loadFacebookScript(appId)
      .then(() => {
        if (isMounted) {
          setIsReady(true);
        }
      })
      .catch((loadError) => {
        console.error('Facebook SDK load error:', loadError);
        if (isMounted) {
          setError('Unable to load Facebook sign-in. Please check your connection.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [appId]);

  const handleClick = useCallback(() => {
    if (disabled || !isReady || !window.FB) {
      return;
    }

    window.FB.login(
      (response) => {
        console.log('Facebook login callback:', response);

        const accessToken = response.authResponse?.accessToken;
        if (!accessToken) {
          setError('We could not continue with Facebook. Please try again.');
          return;
        }

        setError(null);
        void onAccessToken(accessToken);
      },
      { scope: 'email,public_profile' },
    );
  }, [disabled, isReady, onAccessToken]);

  return (
    <div className="auth-facebook-signin" aria-live="polite">
      <button
        type="button"
        className={`auth-social-button ${className}`}
        disabled={disabled || !isReady}
        aria-label={label}
        onClick={handleClick}
      >
        {isReady || error ? (
          <span className="auth-social-icon auth-social-icon--facebook" aria-hidden>
            f
          </span>
        ) : (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
        )}
        <span className="auth-social-button__text">
          {isReady || error ? label : 'Loading Facebook...'}
        </span>
      </button>
      {error ? <p className="auth-field-error">{error}</p> : null}
    </div>
  );
}
