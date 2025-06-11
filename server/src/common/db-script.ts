import { Logger } from '@nestjs/common';
import { Booking } from 'src/bookings/entities/booking.entity';
import dataSource from 'src/config/orm.config';
import { Repository } from 'typeorm';

async function bootstrap() {
  const logger = new Logger('UpdateBookingsWithSnapshots');
  logger.log('Updating bookings with snapshots of location and service...');

  await dataSource.initialize();
  logger.log('Data source initialized.');

  const bookingRepository: Repository<Booking> =
    dataSource.getRepository(Booking);

  try {
    // Fetch all bookings from the database
    const bookings = await bookingRepository.find({
      // where: [
      //   { service_snapshot: Equal({}) },
      //   { location_snapshot: Equal({}) },
      // ],
      relations: {
        service: true,
        location: { business: true },
      },
      withDeleted: true,
    });

    logger.log(`Found ${bookings.length} bookings to update.`);

    // Update each booking with its snapshots
    for (const booking of bookings) {
      if (!booking.service || !booking.location) {
        continue;
      }

      booking.location_snapshot = {
        ...booking.location_snapshot,
        business_id: booking.location.business.id,
      };

      await bookingRepository.save(booking);
    }

    logger.log('Update completed successfully.');
  } catch (error) {
    logger.error('Error:', error);
  } finally {
    // Close the database connection when done
    await dataSource.destroy();
  }
}

bootstrap();
