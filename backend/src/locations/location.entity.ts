// src/locations/location.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity()
export class Location {
  @Column()
  name: string;

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @ManyToOne(() => Company, company => company.locations)
  company: Company;
}