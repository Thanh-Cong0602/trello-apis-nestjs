export const pagingSkipValue = (page: number, itemPerPage: number): number => {
  if (!page || !itemPerPage) return 0;
  if (page <= 0 || itemPerPage <= 0) return 0;

  return (page - 1) * itemPerPage;
};
