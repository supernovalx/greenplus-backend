import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GlobalConfig {
  @PrimaryColumn()
  key: string;

  @Column()
  value: string;
}
