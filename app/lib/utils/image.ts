export async function imageUrlToBase64(url: string): Promise<string> {
  // Skip if already base64
  if (url.startsWith('data:')) {
    return url;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64 (likely CORS):', error);
    return url; 
  }
}
