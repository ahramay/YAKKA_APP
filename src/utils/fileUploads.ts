export const blobToBase64 = (blob: Blob) => {
  // return base64 string ensure the return type is not unknown
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = error => {
      reject(error);
    };
  });
};
