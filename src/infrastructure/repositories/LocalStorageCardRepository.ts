
import { GreetingCard, CreateCardInput } from '@/core/domain/entities/GreetingCard';
import { ICardRepository } from '@/core/domain/repositories/ICardRepository';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'unbox_greeting_cards';

export class LocalStorageCardRepository implements ICardRepository {
  private getCards(): GreetingCard[] {
    if (typeof window === 'undefined') return [];
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((card: any) => ({
      ...card,
      createdAt: new Date(card.createdAt)
    }));
  }

  private saveCards(cards: GreetingCard[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        const sortedCards = [...cards].sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        );
        
        const recentCards = sortedCards.slice(-10);
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCards));
        } catch (retryError) {
          localStorage.removeItem(STORAGE_KEY);
          const lastCard = cards[cards.length - 1];
          if (lastCard) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([lastCard]));
          }
        }
      } else {
        throw error;
      }
    }
  }

  async create(input: CreateCardInput): Promise<GreetingCard> {
    const cards = this.getCards();
    
    const newCard: GreetingCard = {
      ...input,
      id: nanoid(10),
      createdAt: new Date(),
      viewCount: 0,
    };
    
    cards.push(newCard);
    this.saveCards(cards);
    
    return newCard;
  }

  async findById(cardId: string): Promise<GreetingCard | null> {
    const cards = this.getCards();
    return cards.find(card => card.id === cardId) || null;
  }

  async incrementViewCount(cardId: string): Promise<void> {
    const cards = this.getCards();
    const card = cards.find(c => c.id === cardId);
    
    if (card) {
      card.viewCount += 1;
      this.saveCards(cards);
    }
  }

  async delete(cardId: string): Promise<void> {
    const cards = this.getCards();
    const filtered = cards.filter(c => c.id !== cardId);
    this.saveCards(filtered);
  }
}
