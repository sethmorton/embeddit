import axios, { AxiosInstance } from "axios";
import { RedditPost } from "../../../../types";

class RedditApiService {
  private axiosInstance: AxiosInstance;
  private refreshToken: string;
  private accessToken: string;
  private tokenExpirationTime: number;
  private clientId: string;
  private clientSecret: string;
  private userAgent: string;

  constructor(
    refreshToken: string,
    clientId: string,
    clientSecret: string,
    userAgent: string
  ) {
    this.refreshToken = refreshToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.userAgent = userAgent;
    this.accessToken = "";
    this.tokenExpirationTime = 0;

    this.axiosInstance = axios.create({
      baseURL: "https://oauth.reddit.com",
    });

    this.axiosInstance.interceptors.request.use(async (config) => {
      if (this.isTokenExpired()) {
        await this.refreshAccessToken();
      }
      config.headers["Authorization"] = `Bearer ${this.accessToken}`;
      config.headers["User-Agent"] = this.userAgent;
      return config;
    });
  }

  private isTokenExpired(): boolean {
    return Date.now() >= this.tokenExpirationTime;
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await axios.post(
        "https://www.reddit.com/api/v1/access_token",
        `grant_type=refresh_token&refresh_token=${this.refreshToken}`,
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }

  async getSubredditPosts(
    subreddit: string,
    limit: number = 10
  ): Promise<RedditPost[]> {
    try {
      const response = await this.axiosInstance.get(`/r/${subreddit}/top`, {
        params: {
          limit,
          t: "year",
        },
      });
      return this.extractPostData(response.data.data.children);
    } catch (error) {
      console.error("Error fetching subreddit posts", error);
      return [];
    }
  }

  private extractPostData(rawPosts: any[]): RedditPost[] {
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
    return this.getSubredditPosts(subreddit, limit);
  }
}

export { RedditApiService };
