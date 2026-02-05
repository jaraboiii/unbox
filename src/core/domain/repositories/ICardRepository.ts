/**
 * Card Repository Interface
 * Interface สำหรับจัดการข้อมูลการ์ด
 */

import { GreetingCard, CreateCardInput } from '../entities/GreetingCard';

export interface ICardRepository {
  /**
   * สร้างการ์ดใหม่
   */
  create(input: CreateCardInput): Promise<GreetingCard>;
  
  /**
   * ค้นหาการ์ดจาก ID
   */
  findById(cardId: string): Promise<GreetingCard | null>;
  
  /**
   * เพิ่มจำนวนการดู
   */
  incrementViewCount(cardId: string): Promise<void>;
  
  /**
   * ลบการ์ด
   */
  delete(cardId: string): Promise<void>;
}
