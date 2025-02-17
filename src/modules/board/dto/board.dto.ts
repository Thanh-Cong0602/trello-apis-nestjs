export type BoardDto = {
  _id: string;

  title: string;

  slug: string;

  description: string;

  type: string;

  columnOrderIds: string[];

  ownerIds: string[];

  memberIds: string[];

  createdAt: number;

  updatedAt: number | null;

  _destroy: boolean;
};
