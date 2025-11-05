/**
 * Next.js Instrumentation for OpenTelemetry
 *
 * This file enables distributed tracing and monitoring for the application.
 * OpenTelemetry is built into Next.js 15+ and provides automatic instrumentation
 * for common operations like fetch requests, database queries, and Server Actions.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * @see https://vercel.com/docs/observability/otel-overview
 */

export async function register() {
  // Only run instrumentation in Node.js runtime (not Edge)
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    // Enable OpenTelemetry only in production or when explicitly configured
    if (process.env.NODE_ENV === 'production' || process.env['ENABLE_OTEL'] === 'true') {
      try {
        // Import OpenTelemetry registration from Vercel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const otelModule = await import('@vercel/otel' as any)
        const registerOTel = otelModule.registerOTel

        // Register with appropriate sampling rate
        registerOTel({
          serviceName: 'zss-website',
          tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        })

        console.log('[Instrumentation] OpenTelemetry initialized successfully')
      } catch (error) {
        // Gracefully handle missing @vercel/otel package
        console.warn('[Instrumentation] OpenTelemetry not available:', error)
      }
    } else {
      console.log('[Instrumentation] OpenTelemetry disabled in development')
    }
  }
}

/**
 * Optional: Custom instrumentation hook
 * Called when instrumentation is initialized
 */
export function onRequestError(
  error: Error,
  request: {
    path: string
    method: string
    headers: Record<string, string>
  }
) {
  // Log errors for debugging
  console.error('[Instrumentation] Request error:', {
    error: error.message,
    path: request.path,
    method: request.method,
  })

  // In production, you would send this to your error tracking service
  // Example: Sentry.captureException(error)
}
