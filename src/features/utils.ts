import { CommentType } from './comments/types';

export const orderCommentsByVotes = (data: CommentType[]): CommentType[] => {
  if (data.length === 0) return data;

  const output = [...data];

  return output.sort((a, b) => {
    if (a.voteCounts < b.voteCounts) {
      return 1;
    } else if (a.voteCounts > b.voteCounts) {
      return -1;
    }

    return 0;
  });
};
