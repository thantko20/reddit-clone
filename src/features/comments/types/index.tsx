export type CommentType = {
  upvotes: string[];
  downvotes: string[];
  voteCounts: number;
  description: string;
  author: {
    id: string;
    name: string;
    avatarURL: string;
  };
  threadId: string;
  createdAt: number;
  id: string;
};
