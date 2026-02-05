

import { GreetingCard, CreateCardInput } from '../domain/entities/GreetingCard';
import { ICardRepository } from '../domain/repositories/ICardRepository';

export class CreateCardUseCase {
  constructor(private cardRepository: ICardRepository) {}

  async execute(input: CreateCardInput): Promise<GreetingCard> {

    if (!input.senderName || input.senderName.trim() === '') {
      throw new Error('ชื่อผู้มอบห้ามว่าง');
    }

    if (!input.receiverName || input.receiverName.trim() === '') {
      throw new Error('ชื่อผู้รับห้ามว่าง');
    }

    if (!input.templateId || input.templateId.trim() === '') {
      throw new Error('กรุณาเลือก Template');
    }


    const card = await this.cardRepository.create(input);

    return card;
  }
}
