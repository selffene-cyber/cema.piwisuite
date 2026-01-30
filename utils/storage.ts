/**
 * R2 Storage utility functions for Cloudflare R2
 * This file provides helper functions for file operations using R2
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * Upload a file to R2 storage
 */
export async function uploadFile(
    file: File,
    description?: string,
    uploadedBy?: number
): Promise<{
    success: boolean;
    file: {
        id: number;
        filename: string;
        original_name: string;
        url: string;
    };
}> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    if (uploadedBy) formData.append('uploaded_by', uploadedBy.toString());

    const response = await fetch(`${API_BASE}/api/files`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get all files from the database
 */
export async function getFiles(): Promise<Array<{
    id: number;
    filename: string;
    original_name: string;
    file_type: string;
    file_size: number;
    r2_key: string;
    description: string;
    created_at: string;
}>> {
    const response = await fetch(`${API_BASE}/api/files`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch files');
    }

    return response.json();
}

/**
 * Get a file from R2 storage and return the URL
 */
export async function getFileUrl(key: string): Promise<string> {
    return `${API_BASE}/files/${encodeURIComponent(key)}`;
}

/**
 * Delete a file from R2 storage
 */
export async function deleteFile(key: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/api/files/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete file');
    }

    return response.json();
}

/**
 * Download a file from R2 storage
 */
export async function downloadFile(key: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/files/${encodeURIComponent(key)}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to download file');
    }

    return response.blob();
}

/**
 * Get file icon based on file type
 */
export function getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎬';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '📦';
    return '📁';
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
