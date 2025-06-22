import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CheckInStatus {
  CHECKED_IN = 'checked-in',
  CHECKED_OUT = 'checked-out',
}

@Entity('checkin')
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column()
  teamId: string;

  @Column()
  checkInTime: Date;

  @Column({ nullable: true })
  checkOutTime: Date;

  @Column({
    type: 'enum',
    enum: CheckInStatus,
    default: CheckInStatus.CHECKED_IN,
  })
  status: CheckInStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
