export class ConfirmDialogData {
  title = '';
  content = '';
  cancelButtonText = 'ACTION.CANCEL';
  confirmButtonText = 'ACTION.CONFIRM';
  confirmButtonClass = '';

  constructor(data: {
    title?: string;
    content?: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    confirmButtonClass?: string;
  }) {
    this.title = data.title ?? this.title;
    this.content = data.content ?? this.content;
    this.cancelButtonText = data.cancelButtonText ?? this.cancelButtonText;
    this.confirmButtonText = data.confirmButtonText ?? this.confirmButtonText;
    this.confirmButtonClass = data.confirmButtonClass ?? this.confirmButtonClass;
  }
}

export type ConfirmDialogResult = boolean | undefined;
