import { youtube, oauth2Client } from "../utils/googleClient";

const TEST_MODE = process.env.TEST_MOCK === 'true';

export const getVideoDetails = async (videoId: string) => {
  if (TEST_MODE) {
    // Lightweight mock payload for testing without YouTube API access
    return {
      id: videoId,
      snippet: {
        title: "Mock Video Title",
        description: "This is a mock response for testing.",
      }
    };
  }
  const response = await youtube.videos.list({
    part: ["snippet", "statistics"],
    id: [videoId]
  });

  return response.data.items?.[0];
};

export const updateVideoDetails = async (
  videoId: string,
  title: string,
  description: string
) => {
  // 1. First get existing video info
  const video = await getVideoDetails(videoId);

  if (!video) throw new Error("Video not found");

  const existingSnippet = video.snippet;

  const response = await youtube.videos.update({
    part: ["snippet"],
    requestBody: {
      id: videoId,
      snippet: {
        title,
        description,
        categoryId: existingSnippet?.categoryId, // REQUIRED
        defaultLanguage: existingSnippet?.defaultLanguage,
        defaultAudioLanguage: existingSnippet?.defaultAudioLanguage,
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

export const getComments = async (videoId: string) => {
  const response = await youtube.commentThreads.list({
    part: ["snippet"],
    videoId,
    maxResults: 50
  });
  return response.data;
};
