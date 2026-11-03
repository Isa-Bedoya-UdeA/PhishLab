import { Exercise } from '../../domain/types/exercise.ts';
import { INITIAL_EXERCISES } from '../seed/exercisesData.ts';

export interface IExerciseRepository {
  getAll(): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | null>;
  getNext(currentId: string): Promise<Exercise | null>;
  count(): Promise<number>;
}

export class ExerciseRepository implements IExerciseRepository {
  private exercises: Exercise[];

  constructor(customExercises?: Exercise[]) {
    this.exercises = customExercises || INITIAL_EXERCISES;
  }

  public async getAll(): Promise<Exercise[]> {
    return [...this.exercises];
  }

  public async getById(id: string): Promise<Exercise | null> {
    const found = this.exercises.find((e) => e.id === id);
    return found ? { ...found } : null;
  }

  public async getNext(currentId: string): Promise<Exercise | null> {
    const idx = this.exercises.findIndex((e) => e.id === currentId);
    if (idx === -1 || idx === this.exercises.length - 1) {
      return null;
    }
    return { ...this.exercises[idx + 1] };
  }

  public async count(): Promise<number> {
    return this.exercises.length;
  }
}

export const exerciseRepository = new ExerciseRepository();
