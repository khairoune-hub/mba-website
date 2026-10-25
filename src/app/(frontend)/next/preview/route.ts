import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/** Enables Next draft mode for logged-in Payload staff, then redirects to `path`. */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/'
  if (!path.startsWith('/') || path.startsWith('//')) return new Response('Invalid path', { status: 400 })

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  // The admin session cookie is the gate; drafts are never exposed to anonymous visitors.
  if (!user) return new Response('Not allowed', { status: 403 })

  ;(await draftMode()).enable()
  redirect(path)
}
