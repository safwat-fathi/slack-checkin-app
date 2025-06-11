import { Logger } from '@nestjs/common';
import dataSource from 'src/config/orm.config';
import {
  Action,
  Permission,
  Resource,
} from 'src/roles/entities/permission.entity';

async function bootstrap() {
  const logger = new Logger('Seed');
  logger.log('Seeding...');

  await dataSource.initialize();

  const permissionRepository = dataSource.getRepository(Permission);

  try {
    // Create seed data
    const permissions: Omit<Permission, 'id'>[] = [
      { action: Action.VIEWER, resource: Resource.TEAM },
      { action: Action.VIEWER, resource: Resource.CALENDAR },
      { action: Action.VIEWER, resource: Resource.LOCATIONS },
      { action: Action.VIEWER, resource: Resource.BOOKINGS },
      { action: Action.VIEWER, resource: Resource.CUSTOMERS },
      { action: Action.VIEWER, resource: Resource.SERVICES },
      { action: Action.VIEWER, resource: Resource.SETTINGS },
      { action: Action.EDITOR, resource: Resource.TEAM },
      { action: Action.EDITOR, resource: Resource.CALENDAR },
      { action: Action.EDITOR, resource: Resource.LOCATIONS },
      { action: Action.EDITOR, resource: Resource.BOOKINGS },
      { action: Action.EDITOR, resource: Resource.CUSTOMERS },
      { action: Action.EDITOR, resource: Resource.SERVICES },
      { action: Action.EDITOR, resource: Resource.SETTINGS },
    ];

    await permissionRepository.save(permissions);
    logger.log('Seeding completed successfully.');
  } catch (error) {
    logger.error('Seeding error:', error);
  } finally {
    // Optionally destroy the connection when done
    await dataSource.destroy();
  }
}

bootstrap();
