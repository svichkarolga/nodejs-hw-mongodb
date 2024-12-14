const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['personal', 'home', 'work'].includes(contactType);

  if (isContactType(contactType)) return contactType;
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavorite } = query;

  const parsedType = parseContactType(contactType);
  const parsedIsFavorite = parseBoolean(isFavorite);

  return {
    contactType: parsedType,
    isFavorite: parsedIsFavorite,
  };
};
