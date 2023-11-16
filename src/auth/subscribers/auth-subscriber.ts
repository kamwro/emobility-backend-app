import { InsertEvent, UpdateEvent, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../services/auth.service';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert({ entity }: InsertEvent<User>): Promise<void> {
    if (entity.password) {
      entity.password = await AuthService.getHash(entity.password);
    }
  }

  async beforeUpdate({ entity, databaseEntity }: UpdateEvent<User>): Promise<void> {
    if (entity!.password) {
      const password = await AuthService.getHash(entity!.password);

      if (password !== databaseEntity?.password) {
        entity!.password = password;
      }
    }
  }
}
