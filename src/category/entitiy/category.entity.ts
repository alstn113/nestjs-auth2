import { Review } from "@/review/entity/review.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Review, (review) => review.categories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "review_id" })
  review: Review;
}
