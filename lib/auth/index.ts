// Get User With Profile (server-only)
export { getUserWithProfile, type UserWithProfile } from './get-user-with-profile'

// OTP Helpers (server-only)
export { sendOTPForPasswordReset, sendOTPForEmailConfirmation } from './otp-helpers'

// Sign out (server action - safe for client)
export { signoutAction } from './signout'

// Verify Access (server-only)
export { verifyAccess, requireAdmin, requireClient, requireAuth, getOptionalAuth } from './verify-access'
