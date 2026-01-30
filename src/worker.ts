/**
 * CEMA Cloudflare Worker API
 * Main entry point for the API endpoints
 */

export interface Env {
    DB: D1Database;
    FILES: R2Bucket;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // CORS handling
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        try {
            // API Routes
            if (path.startsWith('/api/')) {
                const endpoint = path.replace('/api/', '');
                
                // Health check endpoint
                if (endpoint === 'health') {
                    return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Auth endpoints
                if (endpoint === 'auth/login' && method === 'POST') {
                    return await handleLogin(request, env, corsHeaders);
                }
                if (endpoint === 'auth/register' && method === 'POST') {
                    return await handleRegister(request, env, corsHeaders);
                }

                // Auth required endpoints - check token
                const authHeader = request.headers.get('Authorization');
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                        status: 401,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Evaluations endpoints
                if (endpoint === 'evaluations' && method === 'GET') {
                    return await handleGetEvaluations(env, corsHeaders);
                }
                if (endpoint === 'evaluations' && method === 'POST') {
                    return await handleCreateEvaluation(request, env, corsHeaders);
                }
                if (endpoint.startsWith('evaluations/') && method === 'GET') {
                    const id = endpoint.split('/')[1];
                    return await handleGetEvaluation(id, env, corsHeaders);
                }
                if (endpoint.startsWith('evaluations/') && method === 'DELETE') {
                    const id = endpoint.split('/')[1];
                    return await handleDeleteEvaluation(id, env, corsHeaders);
                }

                // Files endpoints
                if (endpoint === 'files' && method === 'GET') {
                    return await handleGetFiles(env, corsHeaders);
                }
                if (endpoint === 'files' && method === 'POST') {
                    return await handleUploadFile(request, env, corsHeaders);
                }
                if (endpoint.startsWith('files/') && method === 'GET') {
                    const key = endpoint.split('/')[1];
                    return await handleGetFile(key, env, corsHeaders);
                }
                if (endpoint.startsWith('files/') && method === 'DELETE') {
                    const key = endpoint.split('/')[1];
                    return await handleDeleteFile(key, env, corsHeaders);
                }

                // Dashboard stats
                if (endpoint === 'stats' && method === 'GET') {
                    return await handleGetStats(env, corsHeaders);
                }

                return new Response(JSON.stringify({ error: 'Not found' }), {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Serve static files from R2
            if (path.startsWith('/files/')) {
                const key = path.replace('/files/', '');
                return await handleServeFile(key, env);
            }

            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ error: 'Internal server error', message: String(error) }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};

// Auth handlers
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function handleLogin(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    let body: { email?: string; password?: string };
    
    try {
        body = await request.json() as { email?: string; password?: string };
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    const email = body?.email;
    const password = body?.password;
    
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
        return new Response(JSON.stringify({ error: 'Email and password are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !password) {
        return new Response(JSON.stringify({ error: 'Email and password cannot be empty' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const hashedPassword = await hashPassword(password);
        
        console.log('Login attempt for email:', trimmedEmail);
        
        // First, check if user exists
        const user = await env.DB.prepare(
            'SELECT id, email, name, role, password_hash FROM users WHERE email = ?'
        ).bind(trimmedEmail).first();
        
        if (!user) {
            console.log('User not found:', trimmedEmail);
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        // Compare password hashes
        if (user.password_hash !== hashedPassword) {
            console.log('Password mismatch for user:', trimmedEmail);
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // In production, generate a proper JWT token
        const token = `token_${Date.now()}_${user.id}`;

        console.log('Login successful for user:', trimmedEmail);
        
        return new Response(JSON.stringify({ 
            success: true, 
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Login error:', error.message, error.stack);
        return new Response(JSON.stringify({ error: 'Login failed', message: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

async function handleRegister(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const { email, password, name } = await request.json() as { email: string; password: string; name: string };
    
    // Validate required fields
    if (!email || !password || !name) {
        return new Response(JSON.stringify({ error: 'Email, password, and name are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ error: 'Invalid email format' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    // Trim and validate inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    
    if (trimmedEmail.length < 5 || trimmedEmail.length > 254) {
        return new Response(JSON.stringify({ error: 'Email must be between 5 and 254 characters' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    if (trimmedName.length < 2 || trimmedName.length > 100) {
        return new Response(JSON.stringify({ error: 'Name must be between 2 and 100 characters' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    if (password.length < 6) {
        return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const hashedPassword = await hashPassword(password);
        
        console.log('Attempting registration for email:', trimmedEmail);
        
        // Check if user already exists first (avoid D1 constraint error 1042)
        const existingUser = await env.DB.prepare(
            'SELECT id, email FROM users WHERE email = ?'
        ).bind(trimmedEmail).first();
        
        if (existingUser) {
            console.log('User already exists with email:', trimmedEmail);
            return new Response(JSON.stringify({ error: 'Email already exists' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        // Insert new user
        const result = await env.DB.prepare(
            'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
        ).bind(trimmedEmail, hashedPassword, trimmedName, 'user').run();

        console.log('User registered successfully');

        // Return success without trying to fetch (D1 run() doesn't return id)
        return new Response(JSON.stringify({ 
            success: true, 
            message: 'User registered successfully',
            user: { email: trimmedEmail, name: trimmedName, role: 'user' }
        }), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Registration error details:', {
            message: error.message,
            code: error.code,
            cause: error.cause,
            stack: error.stack
        });
        
        // Check for various D1 error patterns for duplicate email
        const errorMsg = String(error.message || error || '');
        const errorCode = error.code;
        
        // D1 error codes: 1042 = constraint violation, 23505 = unique constraint
        if (errorCode === 1042 || errorCode === '1042' || 
            errorCode === 23505 || errorCode === '23505' ||
            errorMsg.includes('UNIQUE') || errorMsg.includes('unique') || 
            errorMsg.includes('duplicate') || errorMsg.includes('constraint') ||
            errorMsg.includes('already exists') || 
            errorMsg.includes('FOREIGN KEY') || errorMsg.includes('foreign key')) {
            console.log('Constraint violation detected, likely duplicate email');
            return new Response(JSON.stringify({ error: 'Email already exists' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        // Check for NOT NULL constraint violations
        if (errorMsg.includes('NOT NULL') || errorMsg.includes('not null') || 
            errorMsg.includes('NOTNULL') || errorMsg.includes('null')) {
            console.error('NOT NULL constraint violation - check input values');
            return new Response(JSON.stringify({ error: 'Invalid data provided' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        // Re-throw for other errors (500)
        throw error;
    }
}

// Evaluations handlers
async function handleGetEvaluations(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const result = await env.DB.prepare(
        'SELECT * FROM evaluations ORDER BY created_at DESC LIMIT 100'
    ).all();

    return new Response(JSON.stringify(result.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function handleCreateEvaluation(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const data = await request.json() as any;
    
    const result = await env.DB.prepare(
        `INSERT INTO evaluations (student_name, student_rut, course, evaluation_date, evaluator_id, total_score, max_score, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        data.student_name,
        data.student_rut,
        data.course,
        data.evaluation_date,
        data.evaluator_id || null,
        data.total_score || 0,
        data.max_score || 100,
        data.status || 'pending'
    ).run();

    // Insert evaluation criteria if provided
    if (data.criteria && Array.isArray(data.criteria)) {
        const evalId = result.success ? (await env.DB.prepare('SELECT last_insert_rowid()').first())?.['last_insert_rowid()'] : null;
        if (evalId) {
            for (const criterion of data.criteria) {
                await env.DB.prepare(
                    'INSERT INTO evaluation_criteria (evaluation_id, criterion_name, score, max_score, comments) VALUES (?, ?, ?, ?, ?)'
                ).bind(evalId, criterion.name, criterion.score, criterion.max_score || 10, criterion.comments || null).run();
            }
        }
    }

    return new Response(JSON.stringify({ 
        success: true, 
        id: result.success ? (await env.DB.prepare('SELECT last_insert_rowid()').first())?.['last_insert_rowid()'] : null
    }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function handleGetEvaluation(id: string, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const result = await env.DB.prepare(
        'SELECT * FROM evaluations WHERE id = ?'
    ).bind(id).first();

    if (!result) {
        return new Response(JSON.stringify({ error: 'Evaluation not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // Get criteria
    const criteria = await env.DB.prepare(
        'SELECT * FROM evaluation_criteria WHERE evaluation_id = ?'
    ).bind(id).all();

    return new Response(JSON.stringify({ ...result, criteria: criteria.results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function handleDeleteEvaluation(id: string, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    await env.DB.prepare('DELETE FROM evaluation_criteria WHERE evaluation_id = ?').bind(id).run();
    const result = await env.DB.prepare('DELETE FROM evaluations WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: result.success }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Files handlers
async function handleGetFiles(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const result = await env.DB.prepare(
        'SELECT * FROM files ORDER BY created_at DESC LIMIT 100'
    ).all();

    return new Response(JSON.stringify(result.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function handleUploadFile(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string || '';
    const uploadedBy = formData.get('uploaded_by') as string || null;

    if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const arrayBuffer = await file.arrayBuffer();

    // Upload to R2
    await env.FILES.put(fileName, arrayBuffer, {
        httpMetadata: {
            contentType: file.type,
            contentDisposition: `inline; filename="${file.name}"`
        }
    });

    // Save metadata to D1
    const result = await env.DB.prepare(
        `INSERT INTO files (filename, original_name, file_type, file_size, r2_key, uploaded_by, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        fileName,
        file.name,
        file.type,
        file.size,
        fileName,
        uploadedBy,
        description
    ).run();

    return new Response(JSON.stringify({ 
        success: true, 
        file: {
            id: result.success ? (await env.DB.prepare('SELECT last_insert_rowid()').first())?.['last_insert_rowid()'] : null,
            filename: fileName,
            original_name: file.name,
            url: `/files/${fileName}`
        }
    }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function handleGetFile(key: string, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const file = await env.FILES.get(key);
    
    if (!file) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    const metadata = await env.DB.prepare('SELECT * FROM files WHERE r2_key = ?').bind(key).first();

    return new Response(file.body, {
        headers: {
            ...corsHeaders,
            'Content-Type': file.httpMetadata?.contentType || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${metadata?.original_name || key}"`
        }
    });
}

async function handleServeFile(key: string, env: Env): Promise<Response> {
    const file = await env.FILES.get(key);
    
    if (!file) {
        return new Response('File not found', { status: 404 });
    }

    const metadata = await env.DB.prepare('SELECT * FROM files WHERE r2_key = ?').bind(key).first();

    return new Response(file.body, {
        headers: {
            'Content-Type': file.httpMetadata?.contentType || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${metadata?.original_name || key}"`
        }
    });
}

async function handleDeleteFile(key: string, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    // Delete from R2
    await env.FILES.delete(key);
    
    // Delete from D1
    const result = await env.DB.prepare('DELETE FROM files WHERE r2_key = ?').bind(key).run();

    return new Response(JSON.stringify({ success: result.success }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

// Dashboard stats
async function handleGetStats(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    const totalEvaluations = await env.DB.prepare('SELECT COUNT(*) as count FROM evaluations').first();
    const totalUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const totalFiles = await env.DB.prepare('SELECT COUNT(*) as count FROM files').first();
    const recentEvaluations = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM evaluations WHERE created_at >= datetime("now", "-7 days")'
    ).first();

    return new Response(JSON.stringify({
        total_evaluations: totalEvaluations?.count || 0,
        total_users: totalUsers?.count || 0,
        total_files: totalFiles?.count || 0,
        evaluations_this_week: recentEvaluations?.count || 0
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}
