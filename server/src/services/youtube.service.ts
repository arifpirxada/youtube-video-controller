import { youtube, oauth2Client } from "../utils/googleClient";

export const getVideoDetails = async (videoId: string) => {
  const response = await youtube.videos.list({
    part: ["snippet", "statistics"],
    id: [videoId]
  });

  return response.data.items?.[0];
};

export const updateVideoDetails = async (videoId: string, title: string, description: string) => {
  const response = await youtube.videos.update({
    part: ["snippet"],
    requestBody: {
      id: videoId,
      snippet: {
        title,
        description
      }
    }
  });

  return response.data;
};

export const addComment = async (videoId: string, text: string) => {
  const response = await youtube.commentThreads.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        videoId,
        topLevelComment: {
          snippet: {
            textOriginal: text
          }
        }
      }
    }
  });

  return response.data;
};

export const replyToComment = async (commentId: string, text: string) => {
  const response = await youtube.comments.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        parentId: commentId,
        textOriginal: text
      }
    }
  });

  return response.data;
};

export const deleteComment = async (commentId: string) => {
  await youtube.comments.delete({
    id: commentId
  });

  return { success: true };
};
