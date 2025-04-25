import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Location } from '../locations/location.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cnpj: string;

  @Column({ nullable: true })
  website: string;

  @ManyToOne(() => User, (user) => user.companies)
  user: User;

  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];
}