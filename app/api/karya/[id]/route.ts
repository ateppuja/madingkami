import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Karya } from '@/lib/types';

export const dynamic = 'force-dynamic';

const isValidUUID = (str?: string | null): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Increment view count
    await query(`UPDATE karya SET views_count = COALESCE(views_count, 0) + 1 WHERE id = $1`, [id]);

    const result = await query(`SELECT * FROM karya WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Karya not found' }, { status: 404 });
    }

    const row = result.rows[0];
    const item: Karya = {
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

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('API /api/karya/[id] GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'like') {
      const res = await query(
        `UPDATE karya SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = $1 RETURNING likes_count`,
        [id]
      );
      return NextResponse.json({ likesCount: res.rows[0]?.likes_count || 0 });
    }

    if (body.action === 'toggle_featured' || body.featured !== undefined) {
      const isFeatured = body.featured !== undefined ? body.featured : true;
      const res = await query(
        `UPDATE karya SET featured = $1, updated_at = NOW() WHERE id = $2 RETURNING featured`,
        [isFeatured, id]
      );
      return NextResponse.json({ featured: Boolean(res.rows[0]?.featured) });
    }

    if (body.status && !body.title) {
      const { status, rejectionReason } = body;
      await query(
        `UPDATE karya SET status = $1, rejection_reason = $2, updated_at = NOW() WHERE id = $3`,
        [status, rejectionReason || null, id]
      );
      return NextResponse.json({ success: true });
    }

    // Full Edit Karya Action
    if (body.action === 'update_karya' || body.title) {
      const { title, description, authorName, authorClass, categoryId, type, contentUrl, mediaUrls, textContent, status } = body;
      const validCategoryId = isValidUUID(categoryId) ? categoryId : null;
      const mediaUrlsJson = mediaUrls ? JSON.stringify(mediaUrls) : null;

      await query(
        `UPDATE karya SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          author_name = COALESCE($3, author_name),
          author_class = COALESCE($4, author_class),
          category_id = COALESCE($5, category_id),
          type = COALESCE($6, type),
          content_url = COALESCE($7, content_url),
          media_urls = COALESCE($8, media_urls),
          text_content = COALESCE($9, text_content),
          status = COALESCE($10, status),
          updated_at = NOW()
        WHERE id = $11`,
        [title, description, authorName, authorClass, validCategoryId, type, contentUrl, mediaUrlsJson, textContent, status, id]
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/karya/[id] PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query(`DELETE FROM karya WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API /api/karya/[id] DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
