export const DateFormatter = (dateString: string): string => {
 const options: Intl.DateTimeFormatOptions = {
   weekday: "long",
   day: "2-digit",
   month: "long",
   year: "numeric",
 };

 const date = new Date(dateString);
 const formatter = new Intl.DateTimeFormat("en-US", options);
 const formattedDateParts = formatter.formatToParts(date);

 const weekday = formattedDateParts.find(
   (part) => part.type === "weekday"
 )?.value;
 const dayOfMonth = formattedDateParts.find(
   (part) => part.type === "day"
 )?.value;
 const month = formattedDateParts.find((part) => part.type === "month")?.value;
 const year = formattedDateParts.find((part) => part.type === "year")?.value;

 if (weekday && dayOfMonth && month && year) {
   const suffix =
     parseInt(dayOfMonth) >= 11 && parseInt(dayOfMonth) <= 13
       ? "th"
       : ["st", "nd", "rd"][(parseInt(dayOfMonth) % 10) - 1] || "th";
   const formattedDayOfMonth = dayOfMonth + suffix;

   return `${weekday} -  ${formattedDayOfMonth} ${month}, ${year}`;
 }

 return "";
};

export const generateDateString = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const timeZoneOffset = -currentDate.getTimezoneOffset() / 60; // Convert minutes to hours

  const timeZoneOffsetString = timeZoneOffset >= 0 ?
    `+${String(timeZoneOffset).padStart(2, '0')}:00` :
    `-${String(Math.abs(timeZoneOffset)).padStart(2, '0')}:00`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timeZoneOffsetString}`;
};


// const dateToFormat = "2023-07-14T14:21:00Z"; 
// const formattedDate = DateFormatter(generateDateString());
