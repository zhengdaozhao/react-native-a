/**
 * Initdson 数据模型 - 代表一个写作主题/初稿
 */
export interface Initdson {
  _id?: string;
  username: string;
  subject: string;
  allsub: string; // JSON 字符串，包含 key 和 label
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Writing 数据模型 - 代表一篇具体的文章
 */
export interface Writing {
  _id?: string;
  username: string;
  subject: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User 数据模型 - 用户账户
 */
export interface User {
  _id?: string;
  email: string;
  username: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API 响应类型
 */
export interface ApiResponse<T> {
  documents?: T[];
  document?: T;
  insertedId?: string;
  modifiedCount?: number;
  deletedCount?: number;
  count?: number;
  error?: string;
}