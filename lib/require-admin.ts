import { auth } from '@/auth'

/**
 * Call at the top of every admin server action. Throws if the caller
 * is not logged in as an admin.
 */
export async function requireAdmin(): Promise<{ id: string; email: string }> {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return { id: session.user.id, email: session.user.email }
}
