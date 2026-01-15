import axios, { AxiosInstance } from 'axios';

// 配置信息
const CONFIG = {
  dataApiBaseUrl: 'https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint', // 替换为你的 App ID
  apiKey: 'YOUR_DATA_API_KEY', // 替换为你的 API Key
  database: 'zpddyz',
};

class MongoDBService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: CONFIG.dataApiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'api-key': CONFIG.apiKey,
      },
    });
  }

  private async callAPI(action: string, payload: any) {
    try {
      const response = await this.client.post(`/action/${action}`, payload);
      return response.data;
    } catch (error: any) {
      console.error(`MongoDB API Error (${action}):`, error.response?.data || error.message);
      throw error;
    }
  }

  async query(collection: string, filter: any = {}) {
    return this.callAPI('find', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }

  async queryOne(collection: string, filter: any) {
    return this.callAPI('findOne', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }

  async insert(collection: string, document: any) {
    return this.callAPI('insertOne', {
      database: CONFIG.database,
      collection,
      document: {
        ...document,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async update(collection: string, filter: any, update: any) {
    return this.callAPI('updateOne', {
      database: CONFIG.database,
      collection,
      filter,
      update: { $set: update },
    });
  }

  async delete(collection: string, filter: any) {
    return this.callAPI('deleteOne', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }
}

export const mongodbService = new MongoDBService();