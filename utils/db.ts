/**
 * Database utility functions for Cloudflare D1
 * This file provides helper functions for database operations
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * Execute a query against the D1 database through the worker API
 */
export async function query<T>(
    sql: string,
    params: (string | number | null | boolean)[] = []
): Promise<T[]> {
    const response = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({ sql, params })
    });

    if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get a single record from the database
 */
export async function get<T>(
    sql: string,
    params: (string | number | null | boolean)[] = []
): Promise<T | null> {
    const results = await query<T>(sql, params);
    return results[0] || null;
}

/**
 * Execute a statement that modifies data (INSERT, UPDATE, DELETE)
 */
export async function execute(
    sql: string,
    params: (string | number | null | boolean)[] = []
): Promise<{ success: boolean; changes?: number }> {
    const response = await fetch(`${API_BASE}/api/execute`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({ sql, params })
    });

    if (!response.ok) {
        throw new Error(`Execute failed: ${response.statusText}`);
    }

    return response.json();
}

// Specific database operations for CEMA application

/**
 * Get all evaluations
 */
export async function getEvaluations() {
    const response = await fetch(`${API_BASE}/api/evaluations`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch evaluations');
    }

    return response.json();
}

/**
 * Get a single evaluation by ID
 */
export async function getEvaluation(id: number) {
    const response = await fetch(`${API_BASE}/api/evaluations/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch evaluation');
    }

    return response.json();
}

/**
 * Create a new evaluation
 */
export async function createEvaluation(data: {
    student_name: string;
    student_rut: string;
    course: string;
    evaluation_date: string;
    evaluator_id?: number;
    total_score?: number;
    max_score?: number;
    status?: string;
    criteria?: Array<{
        name: string;
        score: number;
        max_score?: number;
        comments?: string;
    }>;
}) {
    const response = await fetch(`${API_BASE}/api/evaluations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to create evaluation');
    }

    return response.json();
}

/**
 * Delete an evaluation
 */
export async function deleteEvaluation(id: number) {
    const response = await fetch(`${API_BASE}/api/evaluations/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete evaluation');
    }

    return response.json();
}

/**
 * Get dashboard statistics
 */
export async function getStats() {
    const response = await fetch(`${API_BASE}/api/stats`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch stats');
    }

    return response.json();
}
