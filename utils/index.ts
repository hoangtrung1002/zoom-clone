export const formatString = (text: string): string => {
  if (text?.length >= 20) {
    return `${text.substring(0, 20)}...`;
  }

  return text;
};
