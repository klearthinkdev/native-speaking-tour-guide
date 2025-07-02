import { SnackType } from '../../enums/snack-type.enum';

export class Snack {
  message: string;
  type?: SnackType;
  duration: number;

  constructor(data: { message: string; type?: SnackType; duration?: number }) {
    this.message = data.message;
    this.type = data.type;
    this.duration = typeof data.duration === 'number' && data.duration > 0 ? data.duration : 4000;
  }
}
