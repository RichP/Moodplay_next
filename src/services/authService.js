import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d'; // Token expiry time

export const authService = {
  /**
   * Generate a JWT token
   * @param {Object} payload - Data to encode in the token
   * @returns {string} JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  },

  /**
   * Verify a JWT token
   * @param {string} token - The token to verify
   * @returns {Object|null} The decoded token payload or null if invalid
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  },

  /**
   * Extract token from Authorization header
   * @param {Object} headers - Request headers
   * @returns {string|null} The token or null if not found
   */
  extractTokenFromHeader(headers) {
    // Support both direct access (headers.authorization) and Next.js App Router (headers.get('Authorization'))
    const authHeader = headers.get ? headers.get('Authorization') : headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
};
