'use server';

export interface UploadParams {
  file: File;
  size: string;
  category: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  fileUrl?: string;
  error?: string;
}

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File;
    const size = formData.get('size') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return {
        success: false,
        message: 'No file provided',
        error: 'FILE_MISSING'
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        message: 'Only image files are allowed',
        error: 'INVALID_FILE_TYPE'
      };
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size must be less than 10MB',
        error: 'FILE_TOO_LARGE'
      };
    }

    // Here you would implement the actual file upload logic
    // For example, save to cloud storage (AWS S3, Cloudinary, etc.)
    // or local filesystem
    
    // Simulate upload processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock file URL (replace with actual upload logic)
    const fileUrl = `/uploads/${category}/${size}/${Date.now()}-${file.name}`;
    
    return {
      success: true,
      message: 'File uploaded successfully',
      fileUrl
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: 'Upload failed',
      error: 'UPLOAD_FAILED'
    };
  }
}

export async function uploadMultipleFiles(files: UploadParams[]): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  
  for (const fileParam of files) {
    const formData = new FormData();
    formData.append('file', fileParam.file);
    formData.append('size', fileParam.size);
    formData.append('category', fileParam.category);
    
    const result = await uploadFile(formData);
    results.push(result);
  }
  
  return results;
}

// Helper function to validate image dimensions
export function validateImageDimensions(file: File, expectedSize: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const [expectedWidth, expectedHeight] = expectedSize.split('x').map(Number);
      const isValid = img.width === expectedWidth && img.height === expectedHeight;
      URL.revokeObjectURL(url);
      resolve(isValid);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    
    img.src = url;
  });
}