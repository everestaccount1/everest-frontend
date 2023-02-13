const formatError = (error: string) => {
  if (!error) return '';
  if (error.toString().match(/'(.*?)'/)?.length) {
    return error.toString().match(/'(.*?)'/)[0].replaceAll('\'','');
  }
  return error?.toString();
}

export default formatError;