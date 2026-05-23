// Direct Google OAuth (Authorization Code flow) against our own domain.
// The redirect lands on <origin>/auth/callback (a URL we control), so Google's
// consent screen shows our domain instead of a third-party broker.

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export const GOOGLE_OAUTH_STATE_KEY = 'googleOAuthState'

/**
 * Redirects the browser to Google's consent screen to begin login.
 */
export function startGoogleLogin() {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID env var')
  }

  const redirectUri = `${window.location.origin}/auth/callback`

  // CSRF protection: random state echoed back by Google and verified on return.
  const state = crypto.randomUUID()
  sessionStorage.setItem(GOOGLE_OAUTH_STATE_KEY, state)

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
    access_type: 'online',
  })

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
