import { InsertEvent, UpdateEvent, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { Authentication } from '../entities/auth.entity';
import { AuthService } from '../services/auth.service';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<Authentication> {
  listenTo() {
    return Authentication;
  }

  async beforeInsert({ entity }: InsertEvent<Authentication>): Promise<void> {
    if (entity.password) {
      entity.password = await AuthService.getHash(entity.password);
    }
  }

  async beforeUpdate({ entity, databaseEntity }: UpdateEvent<Authentication>): Promise<void> {
    if (entity!.password) {
      const password = await AuthService.getHash(entity!.password);

      if (password !== databaseEntity?.password) {
        entity!.password = password;
      }
    }
  }
}
