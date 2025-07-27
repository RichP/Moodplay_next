/**
 * Helper functions for mobile app authorization
 */

/**
 * Check if a mobile app client has access to a specific API route
 * @param {Object} auth - The authentication object from authenticate() middleware
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE)
 * @returns {Object} - Object with hasAccess flag and optional error response
 */
export function checkMobileAppAccess(auth, method) {
  // If not authenticated or not a mobile client, no additional checks needed
  if (!auth.authenticated || !auth.isMobileClient) {
    return { hasAccess: auth.authenticated };
  }

  // For mobile clients, check scope and permissions
  const scope = auth.scope || 'read-only';

  // Simple permissions model based on HTTP method:
  // - read-only scope: only allows GET requests
  // - full-access scope: allows all requests
  if (scope === 'read-only' && method !== 'GET') {
    return {
      hasAccess: false,
      error: {
        success: false,
        error: 'This mobile token only has read-only access'
      },
      status: 403
    };
  }

  // If we get here, the mobile client has access
  return { hasAccess: true };
}
