export const getPagination = (page, limit) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
  const { count: total, rows: data } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(total / limit);

  return { total, data, currentPage, totalPages };
};