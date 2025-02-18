export type ColumnDto = {
  _id: string;

  boardId: string;

  title: string;

  cardOrderIds: string[];

  cards?: string[];

  createdAt?: Date | null;

  updatedAt?: Date | null;

  _destroy: boolean;
};
