import moment from "moment";

export const handleFormatDate = (date) => {
  return moment(date, "MMMM Do YYYY").format("DD MMM YYYY");
};
