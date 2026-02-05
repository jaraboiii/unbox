
import { GreetingCard, CreateCardInput } from '@/core/domain/entities/GreetingCard';
import { ICardRepository } from '@/core/domain/repositories/ICardRepository';
import { supabase } from '@/infrastructure/config/supabase';
import { nanoid } from 'nanoid';

export class SupabaseCardRepository implements ICardRepository {
  private tableName = 'valentine2026';
  private bucketName = 'images';

  private async uploadBase64Image(base64String: string): Promise<string> {
    if (!base64String || !base64String.startsWith('data:image')) {
      return base64String; // Return as is if it's already a URL or empty
    }

    try {
      // Decode Base64
      const base64Data = base64String.split(',')[1];
      const mimeType = base64String.split(';')[0].split(':')[1];
      const extension = mimeType.split('/')[1];
      const fileName = `${nanoid()}.${extension}`;
      
      // Convert to Uint8Array for upload
      const byteArray = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: mimeType });

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, blob, {
          contentType: mimeType,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return ''; // Return empty string on failure to avoid breaking the whole process
    }
  }

  async create(input: CreateCardInput): Promise<GreetingCard> {
    // 1. Upload Images
    const imageUrls = await Promise.all(
      input.images.map(img => this.uploadBase64Image(img))
    );

    const eventImageUrls = input.eventImages 
      ? await Promise.all(input.eventImages.map(img => this.uploadBase64Image(img)))
      : [];

    // 2. Prepare Data for Insert
    // Note: mapping camelCase (Entity) to snake_case (DB)
    const dbData = {
      sender_name: input.senderName,
      receiver_name: input.receiverName,
      template_id: input.templateId,
      is_public: input.isPublic,
      custom_message: input.customMessage,
      passcode: input.passcode,
      passcode_hint: input.passcodeHint,
      passcode_message: input.passcodeMessage,
      youtube_url: input.youtubeUrl,
      images: imageUrls,
      event_images: eventImageUrls,
      image_captions: input.imageCaptions,
      event_descriptions: input.eventDescriptions,
      // view_count: 0 // Default in DB usually
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dbData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create card: ${error.message}`);
    }

    return this.mapToEntity(data);
  }

  async findById(cardId: string): Promise<GreetingCard | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', cardId)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToEntity(data);
  }

  async incrementViewCount(cardId: string): Promise<void> {
    // Try to call RPC if exists, or basic update
    // For simplicity, we just try an update. 
    // Limitation: This isn't atomic without RPC, but sufficient for this use case.
    
    // Check if view_count column exists implicitly by trying to read it? 
    // Or just run an update.
    try {
        const { data } = await supabase.from(this.tableName).select('view_count').eq('id', cardId).single();
        if (data) {
             await supabase
            .from(this.tableName)
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', cardId);
        }
    } catch (e) {
        // Ignore if view_count doesn't exist or fails
        console.warn('Could not increment view count', e);
    }
  }

  async delete(cardId: string): Promise<void> {
    await supabase.from(this.tableName).delete().eq('id', cardId);
  }

  private mapToEntity(data: any): GreetingCard {
    return {
      id: data.id,
      senderName: data.sender_name,
      receiverName: data.receiver_name,
      templateId: data.template_id,
      isPublic: data.is_public,
      customMessage: data.custom_message,
      passcode: data.passcode,
      passcodeHint: data.passcode_hint,
      passcodeMessage: data.passcode_message,
      youtubeUrl: data.youtube_url,
      images: data.images || [],
      eventImages: data.event_images || [],
      imageCaptions: data.image_captions || [],
      eventDescriptions: data.event_descriptions || [],
      createdAt: new Date(data.created_at),
      viewCount: data.view_count || 0,
    };
  }
}
