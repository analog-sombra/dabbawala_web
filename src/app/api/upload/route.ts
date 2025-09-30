import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Define category specifications
    const categorySpecs = {
      banner: { size: '600x370', allowedTypes: ['jpg', 'png', 'jpeg'] },
      restaurant: { size: '480x300', allowedTypes: ['jpg', 'png', 'jpeg'] },
      quick_ordering: { size: '250x250', allowedTypes: ['png'] },
      dish: { size: '250x250', allowedTypes: ['jpg', 'png', 'jpeg'] },
    };

    const categorySpec = categorySpecs[category as keyof typeof categorySpecs];
    if (!categorySpec) {
      return NextResponse.json(
        { success: false, message: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file extension based on category
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !categorySpec.allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, message: `Only ${categorySpec.allowedTypes.join(', ').toUpperCase()} files are allowed for ${category}` },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory structure using category specification
    const uploadDir = join(process.cwd(), 'public', 'uploads', category, categorySpec.size);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return success response with file URL
    const fileUrl = `/uploads/${category}/${categorySpec.size}/${filename}`;
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      metadata: {
        originalName: file.name,
        size: file.size,
        type: file.type,
        category,
        dimensions: categorySpec.size,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    );
  }
}