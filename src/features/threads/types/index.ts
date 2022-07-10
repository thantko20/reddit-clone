export interface CommentType {
  description: string;
  author: {
    name: string;
    id: string;
  };
  id: string;
  createdAt: number;
}

export interface ThreadType {
  title: string;
  description: string;
  imageURL?: string;
  id: string;
  author: {
    name: string;
    id: string;
  };
  subreddit: {
    name: string;
    id: string;
  };
  createdAt: number;
}
