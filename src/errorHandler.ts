import { init, captureException, setTag } from "@sentry/browser";

const sentryEnabled = !DEV && Boolean(SENTRY_DSN);

export function register(): void {
  if (!sentryEnabled) return;

  init({
    autoSessionTracking: false, // Wtf sentry
    dsn: SENTRY_DSN,
    enabled: sentryEnabled,
    release: VERSION,
  });
  setTag("target", BUILD_TARGET);
}

export function capture(error: Error): void {
  if (!sentryEnabled) return;

  if (error.stack) {
    // Replace firefox extension URLs
    error.stack = error.stack.replace(
      /moz-extension:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
      "resource://tabliss-extension",
    );

    // Replace chrome extension URLs
    error.stack = error.stack.replace(
      /chrome-extension:\/\/hipekcciheckooncpjeljhnekcoolahp/g,
      "resource://tabliss-extension",
    );
  }

  captureException(error);
}
