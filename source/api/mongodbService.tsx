import axios, { AxiosInstance } from 'axios';
import atlasConfig from '../atlasConfig.json';
import { ApiResponse } from '../types';

// 配置信息 - 从 MongoDB Atlas 获取
const CONFIG = {
  // 格式: https://data.mongodb-api.com/app/{APP_ID}/endpoint/data/v1
  dataApiBaseUrl: `${atlasConfig.dataApiBaseUrl}/app/${atlasConfig.appId}/endpoint/data/v1`,
  apiKey: '12ae40a9-27e1-4bec-a579-ca8c32f3790f', // 在 Atlas 中创建的 API Key
  database: 'zpddyz',
};

class MongoDBService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: CONFIG.dataApiBaseUrl,
      headers: {
        'Content-Type': 'application/ejson',
        'Access-Control-Request-Headers': '*',
        'api-key': CONFIG.apiKey,
      },
      timeout: 10000,
    });
  }

  private async callAPI<T>(action: string, payload: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(`/action/${action}`, payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error(`MongoDB API Error (${action}):`, errorMessage);
      throw new Error(`API Error: ${errorMessage}`);
    }
  }

  async query<T>(collection: string, filter: any = {}): Promise<ApiResponse<T>> {
    return this.callAPI<T>('find', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }

  async queryOne<T>(collection: string, filter: any): Promise<ApiResponse<T>> {
    return this.callAPI<T>('findOne', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }

  async insert<T>(collection: string, document: T): Promise<ApiResponse<T>> {
    return this.callAPI<T>('insertOne', {
      database: CONFIG.database,
      collection,
      document: {
        ...document,
        createdAt: new Date().toISOString(),
      },
    });
  }

  async insertMany<T>(collection: string, documents: T[]): Promise<ApiResponse<T>> {
    return this.callAPI<T>('insertMany', {
      database: CONFIG.database,
      collection,
      documents: documents.map(doc => ({
        ...doc,
        createdAt: new Date().toISOString(),
      })),
    });
  }

  async update<T>(collection: string, filter: any, update: Partial<T>): Promise<ApiResponse<T>> {
    return this.callAPI<T>('updateOne', {
      database: CONFIG.database,
      collection,
      filter,
      update: { $set: update },
    });
  }

  async updateMany<T>(collection: string, filter: any, update: Partial<T>): Promise<ApiResponse<T>> {
    return this.callAPI<T>('updateMany', {
      database: CONFIG.database,
      collection,
      filter,
      update: { $set: update },
    });
  }

  async delete(collection: string, filter: any): Promise<ApiResponse<any>> {
    return this.callAPI('deleteOne', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }

  async deleteMany(collection: string, filter: any): Promise<ApiResponse<any>> {
    return this.callAPI('deleteMany', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }

  async count(collection: string, filter: any = {}): Promise<ApiResponse<any>> {
    return this.callAPI('count', {
      database: CONFIG.database,
      collection,
      filter,
    });
  }
}

export const mongodbService = new MongoDBService();