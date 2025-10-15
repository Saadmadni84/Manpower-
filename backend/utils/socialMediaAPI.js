const axios = require('axios');
const logger = require('./logger');

/**
 * Social Media API Utility
 * Handles integration with various social media platforms
 */

class SocialMediaAPI {
  constructor() {
    this.config = {
      facebook: {
        apiUrl: 'https://graph.facebook.com/v18.0',
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
        pageId: process.env.FACEBOOK_PAGE_ID
      },
      twitter: {
        apiUrl: 'https://api.twitter.com/2',
        bearerToken: process.env.TWITTER_BEARER_TOKEN,
        username: process.env.TWITTER_USERNAME
      },
      linkedin: {
        apiUrl: 'https://api.linkedin.com/v2',
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
        companyId: process.env.LINKEDIN_COMPANY_ID
      },
      instagram: {
        apiUrl: 'https://graph.facebook.com/v18.0',
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
        accountId: process.env.INSTAGRAM_ACCOUNT_ID
      }
    };
  }

  /**
   * Get Facebook page posts
   */
  async getFacebookPosts(limit = 5) {
    try {
      if (!this.config.facebook.accessToken || !this.config.facebook.pageId) {
        throw new Error('Facebook API credentials not configured');
      }

      const response = await axios.get(
        `${this.config.facebook.apiUrl}/${this.config.facebook.pageId}/posts`,
        {
          params: {
            access_token: this.config.facebook.accessToken,
            fields: 'id,message,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true)',
            limit
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data.data || [],
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('Error fetching Facebook posts:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get Facebook page info
   */
  async getFacebookPageInfo() {
    try {
      if (!this.config.facebook.accessToken || !this.config.facebook.pageId) {
        throw new Error('Facebook API credentials not configured');
      }

      const response = await axios.get(
        `${this.config.facebook.apiUrl}/${this.config.facebook.pageId}`,
        {
          params: {
            access_token: this.config.facebook.accessToken,
            fields: 'name,followers_count,fan_count,about,website'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data,
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('Error fetching Facebook page info:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Get Twitter user tweets
   */
  async getTwitterTweets(limit = 5) {
    try {
      if (!this.config.twitter.bearerToken || !this.config.twitter.username) {
        throw new Error('Twitter API credentials not configured');
      }

      // First, get user ID
      const userResponse = await axios.get(
        `${this.config.twitter.apiUrl}/users/by/username/${this.config.twitter.username}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`
          },
          timeout: 10000
        }
      );

      const userId = userResponse.data.data.id;

      // Get user tweets
      const tweetsResponse = await axios.get(
        `${this.config.twitter.apiUrl}/users/${userId}/tweets`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`
          },
          params: {
            'tweet.fields': 'created_at,public_metrics,context_annotations',
            'user.fields': 'name,username,profile_image_url',
            'expansions': 'author_id',
            'max_results': limit
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: tweetsResponse.data.data || [],
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('Error fetching Twitter tweets:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get Twitter user info
   */
  async getTwitterUserInfo() {
    try {
      if (!this.config.twitter.bearerToken || !this.config.twitter.username) {
        throw new Error('Twitter API credentials not configured');
      }

      const response = await axios.get(
        `${this.config.twitter.apiUrl}/users/by/username/${this.config.twitter.username}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`
          },
          params: {
            'user.fields': 'public_metrics,description,profile_image_url'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data.data,
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('Error fetching Twitter user info:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Get LinkedIn company posts
   */
  async getLinkedInPosts(limit = 5) {
    try {
      if (!this.config.linkedin.accessToken || !this.config.linkedin.companyId) {
        throw new Error('LinkedIn API credentials not configured');
      }

      const response = await axios.get(
        `${this.config.linkedin.apiUrl}/organizations/${this.config.linkedin.companyId}/updates`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.linkedin.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
          },
          params: {
            count: limit
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data.elements || [],
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('Error fetching LinkedIn posts:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get Instagram media
   */
  async getInstagramMedia(limit = 5) {
    try {
      if (!this.config.instagram.accessToken || !this.config.instagram.accountId) {
        throw new Error('Instagram API credentials not configured');
      }

      const response = await axios.get(
        `${this.config.instagram.apiUrl}/${this.config.instagram.accountId}/media`,
        {
          params: {
            access_token: this.config.instagram.accessToken,
            fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
            limit
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data.data || [],
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('Error fetching Instagram media:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get Instagram account info
   */
  async getInstagramAccountInfo() {
    try {
      if (!this.config.instagram.accessToken || !this.config.instagram.accountId) {
        throw new Error('Instagram API credentials not configured');
      }

      const response = await axios.get(
        `${this.config.instagram.apiUrl}/${this.config.instagram.accountId}`,
        {
          params: {
            access_token: this.config.instagram.accessToken,
            fields: 'username,account_type,media_count,followers_count,follows_count'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data,
        lastUpdated: new Date()
      };

    } catch (error) {
      logger.error('Error fetching Instagram account info:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Get all social media feeds
   */
  async getAllFeeds() {
    try {
      const [facebook, twitter, linkedin, instagram] = await Promise.allSettled([
        this.getFacebookPosts(),
        this.getTwitterTweets(),
        this.getLinkedInPosts(),
        this.getInstagramMedia()
      ]);

      const [facebookInfo, twitterInfo, linkedinInfo, instagramInfo] = await Promise.allSettled([
        this.getFacebookPageInfo(),
        this.getTwitterUserInfo(),
        Promise.resolve({ success: false, data: null }), // LinkedIn doesn't have separate info endpoint
        this.getInstagramAccountInfo()
      ]);

      return {
        success: true,
        data: {
          facebook: {
            posts: facebook.status === 'fulfilled' ? facebook.value.data : [],
            info: facebookInfo.status === 'fulfilled' ? facebookInfo.value.data : null,
            lastUpdated: new Date()
          },
          twitter: {
            tweets: twitter.status === 'fulfilled' ? twitter.value.data : [],
            info: twitterInfo.status === 'fulfilled' ? twitterInfo.value.data : null,
            lastUpdated: new Date()
          },
          linkedin: {
            posts: linkedin.status === 'fulfilled' ? linkedin.value.data : [],
            info: null,
            lastUpdated: new Date()
          },
          instagram: {
            media: instagram.status === 'fulfilled' ? instagram.value.data : [],
            info: instagramInfo.status === 'fulfilled' ? instagramInfo.value.data : null,
            lastUpdated: new Date()
          }
        }
      };

    } catch (error) {
      logger.error('Error fetching all social media feeds:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Format social media post for display
   */
  formatPost(post, platform) {
    const baseFormat = {
      id: post.id,
      platform,
      timestamp: post.created_time || post.created_at || post.timestamp,
      permalink: post.permalink_url || post.permalink || null
    };

    switch (platform) {
      case 'facebook':
        return {
          ...baseFormat,
          content: post.message,
          image: post.full_picture,
          likes: post.likes?.summary?.total_count || 0,
          comments: post.comments?.summary?.total_count || 0
        };

      case 'twitter':
        return {
          ...baseFormat,
          content: post.text,
          image: null, // Twitter API v2 doesn't include media in basic tweet object
          likes: post.public_metrics?.like_count || 0,
          retweets: post.public_metrics?.retweet_count || 0,
          replies: post.public_metrics?.reply_count || 0
        };

      case 'instagram':
        return {
          ...baseFormat,
          content: post.caption,
          image: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
          likes: post.like_count || 0,
          comments: post.comments_count || 0,
          mediaType: post.media_type
        };

      default:
        return baseFormat;
    }
  }
}

// Create singleton instance
const socialMediaAPI = new SocialMediaAPI();

module.exports = socialMediaAPI;
