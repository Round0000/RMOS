function getFormattedDate(date, format) {
  const YYYY = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, "0");
  const DD = date.getDate().toString().padStart(2, "0");
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");

  format = format.replace("YYYY", YYYY);
  format = format.replace("MM", MM);
  format = format.replace("DD", DD);
  format = format.replace("hh", hh);
  format = format.replace("mm", mm);
  format = format.replace("ss", ss);

  return format;
}
