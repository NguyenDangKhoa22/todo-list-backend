export interface ICommentCreate {
  comment: string;
  attachmentId?: number;
  taskId: string;
  userId: string;
}

export interface ICommentUpdate {
  id: number;
  comment?: string;
  attachmentId?: number;
  isActive?: boolean;
  taskId: string;
  userId: string;
}
