import { EventType } from '@/types/eventType';
import { UserType } from '@/types/userType';
import { Session } from 'next-auth';
import { Octokit } from 'octokit';

/**
 * API route handler that makes a GitHub API request using the user's access token.
 *
 * @param url - The GitHub API route to request
 * @param session - The NextAuth.js session containing the logged in user
 * @returns The response data from the GitHub API request
 */

async function api(url: string, session: Session) {
  try {
    const name = session.user?.name?.toLowerCase();
    const octokit = new Octokit({
      auth: session.user.accessToken,
    });

    const response = await octokit.request(`GET /users/${name}${url}`, {
      username: name,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    return response.data;
  } catch (error) {
    // Log the error
    console.error(error);

    // Throw or return a custom error
    throw new Error('API Error');
  }
}

export async function fetchUserProfile(session: Session): Promise<UserType> {
  return api('', session);
}

export async function fetchRepos(session: Session) {
  return api('/repos', session);
}

export async function fetchEvents(session: Session): Promise<EventType[]> {
  return api('/received_events', session);
}
