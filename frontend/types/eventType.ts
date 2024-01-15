export interface EventType {
  id: string;
  type: string;
  actor: Actor;
  repo: Repo;
  payload: Payload;
  public: boolean;
  created_at: string;
}

interface Payload {
  action: string;
  issue: Issue;
  comment: Comment;
}

interface Comment {
  url: string;
  html_url: string;
  issue_url: string;
  id: number;
  node_id: string;
  user: User;
  created_at: string;
  updated_at: string;
  author_association: string;
  body: string;
  reactions: Reactions;
  performed_via_github_app: Performedviagithubapp;
}

interface Performedviagithubapp {
  id: number;
  slug: string;
  node_id: string;
  owner: User;
  name: string;
  description: string;
  external_url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  permissions: Permissions;
  events: string[];
}

interface Permissions {
  administration: string;
  checks: string;
  contents: string;
  deployments: string;
  emails: string;
  issues: string;
  members: string;
  metadata: string;
  pull_requests: string;
  repository_hooks: string;
  statuses: string;
}

interface Issue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: any[];
  state: string;
  locked: boolean;
  assignee?: any;
  assignees: any[];
  milestone?: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: any;
  author_association: string;
  active_lock_reason?: any;
  draft: boolean;
  pull_request: Pullrequest;
  body?: any;
  reactions: Reactions;
  timeline_url: string;
  performed_via_github_app?: any;
  state_reason?: any;
}

interface Reactions {
  url: string;
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

interface Pullrequest {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  merged_at?: any;
}

interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface Repo {
  id: number;
  name: string;
  url: string;
}

interface Actor {
  id: number;
  login: string;
  display_login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}
