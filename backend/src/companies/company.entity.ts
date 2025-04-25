import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Location } from '../locations/location.entity';

@Entity()
export class Company {
  @Column({ unique: true }) // CNPJ único por empresa
  cnpj: string;

  @Column({ nullable: true }) // Diferencial: Logo para SaaS
  logoUrl: string;

  // Relacionamentos (crucial para SaaS)
  @ManyToOne(() => User, user => user.companies)
  user: User;

  @OneToMany(() => Location, location => location.company)
  locations: Location[];
}