'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { expenseService } from '../services/expense-service';
import { updateExpenseReceipt } from '../services/actions';

interface ReceiptUploadProps {
  expenseId: string;
  userId: string;
  currentReceiptUrl: string | null;
  onUploadComplete?: (url: string) => void;
  onDeleteComplete?: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

export function ReceiptUpload({
  expenseId,
  userId,
  currentReceiptUrl,
  onUploadComplete,
  onDeleteComplete,
}: ReceiptUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(currentReceiptUrl);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 10MB');
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        // Delete old receipt if exists
        if (receiptUrl) {
          await expenseService.deleteReceipt(receiptUrl);
        }

        // Upload new receipt
        const url = await expenseService.uploadReceipt(file, userId, expenseId);

        // Update expense with new receipt URL
        const result = await updateExpenseReceipt(expenseId, url);

        if (result.success) {
          setReceiptUrl(url);
          onUploadComplete?.(url);
        } else {
          setError(result.error || 'Failed to save receipt');
          // Clean up uploaded file if update failed
          await expenseService.deleteReceipt(url);
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError('Failed to upload receipt. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [expenseId, userId, receiptUrl, onUploadComplete]
  );

  const handleDelete = async () => {
    if (!receiptUrl) return;

    setIsDeleting(true);
    setError(null);

    try {
      await expenseService.deleteReceipt(receiptUrl);
      const result = await updateExpenseReceipt(expenseId, null);

      if (result.success) {
        setReceiptUrl(null);
        onDeleteComplete?.();
      } else {
        setError(result.error || 'Failed to remove receipt');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete receipt. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    disabled: isUploading || isDeleting,
  });

  // Determine if receipt is an image or PDF
  const isImage = receiptUrl && !receiptUrl.endsWith('.pdf');

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {receiptUrl ? (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-lg border overflow-hidden">
            {isImage ? (
              <img
                src={receiptUrl}
                alt="Receipt"
                className="max-h-64 w-full object-contain bg-gray-50"
              />
            ) : (
              <div className="flex items-center justify-center gap-2 p-8 bg-gray-50">
                <FileText className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">PDF Receipt</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                View Full Size
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </>
              )}
            </Button>
          </div>

          {/* Replace option */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
              transition-colors
              ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-500">
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                'Drop a file here to replace, or click to select'
              )}
            </p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                <p className="text-sm font-medium">Uploading receipt...</p>
              </>
            ) : isDragActive ? (
              <>
                <Upload className="h-10 w-10 text-teal-600" />
                <p className="text-sm font-medium text-teal-600">Drop the file here</p>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">
                  Drag & drop your receipt here
                </p>
                <p className="text-xs text-gray-500">
                  or click to select a file
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: JPG, PNG, WebP, PDF (max 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
