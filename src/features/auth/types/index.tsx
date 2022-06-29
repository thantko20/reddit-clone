export interface UserType {
  name: string;
  username: string;
  email: string;
  avatarURL: string;
  id: string;
  createdAt: string | number;
  joinedSubreddits: string[];
  threads: string[];
}
