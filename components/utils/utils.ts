/**
 * Function to capitalize string
 * @param str The string to be capitalized
 * @returns Capitalized string
 */
export const capitalize = (str: string) => {
  return str
    .split(" ") // split the string by spaces into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // capitalize first letter of each word
    .join(" "); // join the array of words back into a string
};

/**
 * * Function to update the properties of a state object
 * @param key The key of the property to be updated
 * @param value The value of the property to be updated
 * @param setState The set state function
 */
export const handleInputChange = <T>(
  key: string,
  value: T,
  setState: Function
) => {
  setState((prev: any) => ({ ...prev, [key]: value }));
};
