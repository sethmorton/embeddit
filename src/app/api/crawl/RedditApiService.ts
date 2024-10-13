// reddit api service
import axios from "axios";
import { RedditPost } from "../../../../types";
class RedditApiService {
  auth_token: string;
  userAgent: string;
  constructor(auth_token: string, userAgent: string) {
    this.auth_token = auth_token;
    this.userAgent = userAgent;
  }
  generateHeader() {
    return {
      Authorization: `bearer ${this.auth_token}`,
      "User-Agent": this.userAgent,
    };
  }
  async getSubredditPosts(
    subreddit: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      console.log(
        `https://oauth.reddit.com/r/${subreddit}/top?limit=${limit}&t=all`
      );
      const response = await axios.get(
        `https://oauth.reddit.com/r/${subreddit}/top?limit=${limit}`,
        {
          headers: this.generateHeader(),
          params: {
            limit,
            t: "month", // This parameter sets the time range: all, year, month, week, day
          },
        }
      );
      return response.data.data.children;
    } catch (error) {
      console.error("Error fetching subreddit posts", error);
      return [];
    }
  }

  // In RedditApiService.ts

  extractPostData(rawPosts: any[]): RedditPost[] {
    return rawPosts.map((post) => ({
      id: post.data.id,
      title: post.data.title,
      author: post.data.author,
      score: post.data.score,
      num_comments: post.data.num_comments,
      created_utc: post.data.created_utc,
      url: post.data.url,
      selftext: post.data.selftext,
      subreddit: post.data.subreddit,
      permalink: post.data.permalink,
    }));
  }

  async getSubredditPostsData(
    subreddit: string,
    limit: number = 10
  ): Promise<RedditPost[]> {
    const rawPosts = await this.getSubredditPosts(subreddit, limit);
    return this.extractPostData(rawPosts);
  }
}

export { RedditApiService };
