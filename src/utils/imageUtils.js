// Helper function to format image URLs to use allowed domains
export const formatImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already an images.unsplash.com URL, return it unchanged
  if (url.includes('images.unsplash.com')) {
    return url;
  }
  
  // If it's an unsplash.com URL, convert it to the images.unsplash.com format
  if (url.includes('unsplash.com/photos/')) {
    try {
      // Different ways Unsplash URLs can be formatted
      let photoId;
      
      // Case 1: URL with photo ID at the end: https://unsplash.com/photos/9C5-hxfw6R8
      if (url.match(/photos\/([a-zA-Z0-9_-]+)$/)) {
        photoId = url.split('/').pop();
      }
      // Case 2: URL with descriptive text + ID: https://unsplash.com/photos/red-and-black-cassette-tape-9C5-hxfw6R8
      else if (url.match(/photos\/.*-([a-zA-Z0-9_-]+)$/)) {
        photoId = url.split('-').pop();
      }
      // Case 3: URL with query parameters: https://unsplash.com/photos/9C5-hxfw6R8?query=params
      else if (url.match(/photos\/([a-zA-Z0-9_-]+)\?/)) {
        photoId = url.split('/').pop().split('?')[0];
      }
      
      // If we found a photo ID, convert to images.unsplash.com format
      if (photoId) {
        return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`;
      }
    } catch (error) {
      console.error('Error parsing Unsplash URL:', error);
    }
  }
  
  // For other URLs, return as is (will need to ensure they're from allowed domains)
  return url;
};
