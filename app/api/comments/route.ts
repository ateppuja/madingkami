import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Comment } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const karyaId = searchParams.get('karya_id');

    if (!karyaId) {
      return NextResponse.json([]);
    }

    const result = await query(
      `SELECT * FROM comments WHERE karya_id = $1 ORDER BY created_at ASC`,
      [karyaId]
    );

    const comments: Comment[] = result.rows.map(row => ({
      id: row.id,
      karyaId: row.karya_id,
      authorName: row.author_name,
      content: row.content,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('API /api/comments GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { karyaId, authorName, content } = body;

    const id = 'comment-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const insertSql = `
      INSERT INTO comments (id, karya_id, author_name, content, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;

    const result = await query(insertSql, [id, karyaId, authorName.trim(), content.trim()]);
    const row = result.rows[0];

    const newComment: Comment = {
      id: row.id,
      karyaId: row.karya_id,
      authorName: row.author_name,
      content: row.content,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json(newComment);
  } catch (error: any) {
    console.error('API /api/comments POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, content } = body;

    await query(`UPDATE comments SET content = $1 WHERE id = $2`, [content.trim(), id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API /api/comments PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await query(`DELETE FROM comments WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API /api/comments DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
