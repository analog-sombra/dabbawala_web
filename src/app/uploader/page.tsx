'use client';

import React, { useState, useRef } from 'react';
import { Upload, Select, message } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Option } = Select;
const { Dragger } = Upload;

interface UploadFile {
  file: File;
  preview: string;
  size: string;
  category: string;
}

interface UploadedResult {
  fileName: string;
  fileUrl: string;
  category: string;
  size: string;
  originalName: string;
}

const Uploader = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('banner');
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedResults, setUploadedResults] = useState<UploadedResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get current category details
  const getCurrentCategory = () => {
    return categoryOptions.find(cat => cat.value === selectedCategory) || categoryOptions[0];
  };

  const categoryOptions = [
    { 
      label: 'Banner', 
      value: 'banner',
      size: '600x370',
      allowedTypes: ['jpg', 'png', 'jpeg'],
      accept: '.jpg,.jpeg,.png'
    },
    { 
      label: 'Restaurant', 
      value: 'restaurant',
      size: '480x300',
      allowedTypes: ['jpg', 'png', 'jpeg'],
      accept: '.jpg,.jpeg,.png'
    },
    { 
      label: 'Quick Ordering', 
      value: 'quick_ordering',
      size: '250x250',
      allowedTypes: ['png'],
      accept: '.png'
    },
    { 
      label: 'Dish', 
      value: 'dish',
      size: '250x250',
      allowedTypes: ['jpg', 'png', 'jpeg'],
      accept: '.jpg,.jpeg,.png'
    },
  ];

  const handleFileSelect = (file: File) => {
    const currentCategory = getCurrentCategory();
    
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file');
      return false;
    }

    // Check file extension based on category
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !currentCategory.allowedTypes.includes(fileExtension)) {
      message.error(`Only ${currentCategory.allowedTypes.join(', ').toUpperCase()} files are allowed for ${currentCategory.label}`);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      message.error('File size must be less than 10MB');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      const newFile: UploadFile = {
        file,
        preview,
        size: currentCategory.size,
        category: selectedCategory,
      };
      setUploadedFiles(prev => [...prev, newFile]);
      message.success(`${file.name} added successfully`);
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileSelect);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(handleFileSelect);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    message.info('File removed');
  };

  const uploadFiles = async () => {
    if (uploadedFiles.length === 0) {
      message.warning('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadedResults([]); // Clear previous results
    const hideLoading = message.loading('Uploading files...', 0);
    
    try {
      let successCount = 0;
      let failCount = 0;
      const newResults: UploadedResult[] = [];

      // Upload files one by one
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        try {
          const formData = new FormData();
          formData.append('file', file.file);
          formData.append('size', file.size);
          formData.append('category', file.category);
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          const result = await response.json();
          
          if (result.success) {
            successCount++;
            console.log(`${file.file.name} uploaded to:`, result.fileUrl);
            
            // Add to results
            newResults.push({
              fileName: result.metadata?.originalName || file.file.name,
              fileUrl: result.fileUrl,
              category: file.category,
              size: file.size,
              originalName: file.file.name
            });
          } else {
            failCount++;
            console.error(`Failed to upload ${file.file.name}:`, result.message);
          }
        } catch (error) {
          failCount++;
          console.error(`Error uploading ${file.file.name}:`, error);
        }
      }
      
      hideLoading();
      
      // Update results state
      setUploadedResults(newResults);
      
      if (successCount > 0 && failCount === 0) {
        message.success(`Successfully uploaded ${successCount} file(s)!`);
      } else if (successCount > 0 && failCount > 0) {
        message.warning(`Uploaded ${successCount} file(s), ${failCount} failed`);
      } else {
        message.error('All uploads failed. Please try again.');
      }
      
      if (successCount > 0) {
        setUploadedFiles([]);
      }
    } catch (error) {
      hideLoading();
      console.error('Upload error:', error);
      message.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearAll = () => {
    setUploadedFiles([]);
    message.info('All files cleared');
  };

  const clearResults = () => {
    setUploadedResults([]);
    message.info('Upload results cleared');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Image Uploader</h1>
          <p className="text-gray-600">Upload images for your restaurant</p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Selector */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Category
              </label>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="w-full"
                size="large"
                placeholder="Choose category"
              >
                {categoryOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            
            {/* Requirements Display */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Requirements for {getCurrentCategory().label}
              </label>
              <div className="flex flex-wrap gap-3">
                {/* Size Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-blue-700">
                    Size: {getCurrentCategory().size}
                  </span>
                </div>
                
                {/* File Types Badges */}
                {getCurrentCategory().allowedTypes.map((type, index) => (
                  <div key={index} className="inline-flex items-center px-3 py-2 rounded-full bg-green-50 border border-green-200">
                    <span className="text-sm font-medium text-green-700 uppercase">
                      {type}
                    </span>
                  </div>
                ))}
                
                {/* Max Size Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    Max: 10MB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Results */}
        {uploadedResults.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                🎉 Successfully Uploaded ({uploadedResults.length})
              </h3>
              <button 
                onClick={clearResults}
                className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                Clear Results
              </button>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="space-y-4">
                {uploadedResults.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2">{result.fileName}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Category:</span> {result.category}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {result.size}
                          </div>
                          <div>
                            <span className="font-medium">URL:</span>
                            <a 
                              href={result.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 ml-1 break-all"
                            >
                              {result.fileUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(result.fileUrl)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => window.open(result.fileUrl, '_blank')}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Copy All URLs */}
              <div className="mt-6 pt-4 border-t border-green-200">
                <button
                  onClick={() => {
                    const allUrls = uploadedResults.map(result => result.fileUrl).join('\n');
                    navigator.clipboard.writeText(allUrls);
                    message.success('All URLs copied to clipboard!');
                  }}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📋 Copy All URLs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center hover:border-blue-400 transition-colors">
          <Dragger
            multiple
            accept={getCurrentCategory().accept}
            beforeUpload={handleFileSelect}
            showUploadList={false}
            className="!border-none !bg-transparent"
            onDrop={handleDrop}
          >
            <div className="text-gray-400 mb-4">
              <InboxOutlined className="text-5xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Drop {getCurrentCategory().label.toLowerCase()} images here
            </h3>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
            <div className="text-sm text-gray-400">
              <p>Only {getCurrentCategory().allowedTypes.join(', ').toUpperCase()} files • Max 10MB each</p>
              <p>Required size: {getCurrentCategory().size}</p>
            </div>
          </Dragger>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={getCurrentCategory().accept}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Selected Files ({uploadedFiles.length})
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={clearAll}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadOutlined />
                      Upload Files
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((uploadFile, index) => (
                <div key={index} className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden relative">
                    <Image
                      src={uploadFile.preview}
                      alt={uploadFile.file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800 truncate text-sm mb-1">
                      {uploadFile.file.name}
                    </h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>{uploadFile.size}</p>
                      <p>{uploadFile.category}</p>
                      <p>{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="mt-2 w-full py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Requirements */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">All Category Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {categoryOptions.map(category => (
              <div key={category.value} className="group hover:shadow-lg transition-all duration-200 bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-blue-200">
                <div className="text-center">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">{category.label}</h4>
                  
                  {/* Size Display */}
                  <div className="mb-4">
                    <div className="inline-block px-4 py-2 bg-blue-100 rounded-lg">
                      <span className="text-blue-800 font-semibold text-sm">{category.size}</span>
                    </div>
                  </div>
                  
                  {/* File Types */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {category.allowedTypes.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium uppercase">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">📋 Upload Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Select category first to see requirements
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Maximum file size: 10MB per image
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Images should match exact dimensions
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Multiple file upload supported
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
