import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Karya } from '@/lib/types';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const typeFilter = searchParams.get('type');
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');

    let sql = `SELECT * FROM karya WHERE 1=1`;
    const values: any[] = [];
    let idx = 1;

    if (status) {
      sql += ` AND status = $${idx++}`;
      values.push(status);
    }

    if (typeFilter && typeFilter !== 'all') {
      sql += ` AND type = $${idx++}`;
      values.push(typeFilter);
    }

    if (categoryId && categoryId !== 'all') {
      sql += ` AND category_id = $${idx++}`;
      values.push(categoryId);
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(title) LIKE $${idx} OR LOWER(author_name) LIKE $${idx} OR LOWER(author_class) LIKE $${idx} OR LOWER(description) LIKE $${idx})`;
      values.push(`%${search.toLowerCase().trim()}%`);
      idx++;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await query(sql, values);

    const mappedList: Karya[] = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      categoryId: row.category_id,
      title: row.title,
      description: row.description,
      authorName: row.author_name,
      authorClass: row.author_class,
      type: row.type,
      contentUrl: row.content_url,
      mediaUrls: typeof row.media_urls === 'string' ? JSON.parse(row.media_urls) : (row.media_urls || []),
      textContent: row.text_content,
      appDemoUrl: row.app_demo_url,
      appRepoUrl: row.app_repo_url,
      status: row.status,
      rejectionReason: row.rejection_reason,
      likesCount: row.likes_count || 0,
      viewsCount: row.views_count || 0,
      featured: Boolean(row.featured),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(mappedList, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error: any) {
    console.error('API /api/karya GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const id = body.id || crypto.randomUUID();
    const categoryId = body.categoryId || null;
    const title = body.title;
    const description = body.description;
    const authorName = body.authorName;
    const authorClass = body.authorClass;
    const type = body.type;
    const contentUrl = body.contentUrl || null;
    const mediaUrls = body.mediaUrls ? JSON.stringify(body.mediaUrls) : null;
    const textContent = body.textContent || null;
    const appDemoUrl = body.appDemoUrl || null;
    const appRepoUrl = body.appRepoUrl || null;
    const status = 'pending';

    const insertSql = `
      INSERT INTO karya (
        id, category_id, title, description, author_name, author_class, type, content_url, media_urls, text_content, app_demo_url, app_repo_url, status, likes_count, views_count, featured, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0, 0, false, NOW(), NOW()
      ) RETURNING *;
    `;

    const values = [
      id, categoryId, title, description, authorName, authorClass, type, contentUrl, mediaUrls, textContent, appDemoUrl, appRepoUrl, status
    ];

    const result = await query(insertSql, values);
    const row = result.rows[0];

    const newKarya: Karya = {
      id: row.id,
      userId: row.user_id,
      categoryId: row.category_id,
      title: row.title,
      description: row.description,
      authorName: row.author_name,
      authorClass: row.author_class,
      type: row.type,
      contentUrl: row.content_url,
      mediaUrls: typeof row.media_urls === 'string' ? JSON.parse(row.media_urls) : (row.media_urls || []),
      textContent: row.text_content,
      appDemoUrl: row.app_demo_url,
      appRepoUrl: row.app_repo_url,
      status: row.status,
      rejectionReason: row.rejection_reason,
      likesCount: row.likes_count || 0,
      viewsCount: row.views_count || 0,
      featured: Boolean(row.featured),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json(newKarya);
  } catch (error: any) {
    console.error('API /api/karya POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
