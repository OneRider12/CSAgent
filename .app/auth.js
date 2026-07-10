(function () {
  const config = window.CSAGENT_SUPABASE_CONFIG || {};
  const releaseNote = "Verified Chula email is a release gate for the all-CS release, not the private pilot.";
  // TODO: Remove this temporary bypass when the web login flow is ready.
  const temporaryLoginBypassEnabled = true;

  function isConfigured() {
    return Boolean(
      config.supabaseUrl &&
      config.supabaseAnonKey &&
      !String(config.supabaseUrl).includes("your-project") &&
      !String(config.supabaseAnonKey).includes("your-anon-key")
    );
  }

  function setupError() {
    if (isConfigured()) return "";
    return "Supabase is not configured. Copy .app/config.example.js to .app/config.local.js and add the project URL and anon key.";
  }

  function createClient() {
    if (!isConfigured() || !window.supabase?.createClient) return null;
    return window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  const client = createClient();

  function temporaryBypassSession() {
    return {
      isTemporaryBypass: true,
      access_token: "temporary-login-bypass",
      user: {
        id: "temporary-bypass-member",
        email: "web-build@csagent.local",
        user_metadata: {
          full_name: "Web Build Member"
        }
      }
    };
  }

  async function getSession() {
    if (temporaryLoginBypassEnabled) return { session: temporaryBypassSession(), setupError: "" };
    if (!client) return { session: null, setupError: setupError() };
    const { data, error } = await client.auth.getSession();
    return { session: data?.session || null, error, setupError: "" };
  }

  async function signInWithGoogle() {
    if (!client) return { error: new Error(setupError()) };
    return client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: config.authRedirectTo || window.location.href
      }
    });
  }

  async function signOut() {
    if (!client) return { error: new Error(setupError()) };
    return client.auth.signOut();
  }

  function onAuthChange(callback) {
    if (!client) return { data: { subscription: { unsubscribe() {} } } };
    return client.auth.onAuthStateChange((event, session) => callback(session, event));
  }

  window.CSAgentAuth = {
    client,
    temporaryLoginBypassEnabled,
    temporaryBypassSession,
    isConfigured,
    setupError,
    releaseNote,
    getSession,
    signInWithGoogle,
    signOut,
    onAuthChange
  };
})();
