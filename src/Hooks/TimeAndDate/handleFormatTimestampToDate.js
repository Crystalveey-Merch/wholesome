import moment from "moment";

function handleFormatDateB(date) {
  return moment(date).format("dddd, MMM Do YYYY");
}

function handleFormatTimestampToDate(timestamp) {
  const createdAtDate = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
  ); //1e6 = 1000000
  return moment(createdAtDate).format("DD MMM YYYY");
}

function handleFormatTimestampToDate2(timestamp) {
  const createdAtDate = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
  ); //1e6 = 1000000
  // return in format Monday, 1st January 2022
  return moment(createdAtDate).format("dddd, Do MMMM YYYY");
}

export {
  handleFormatDateB,
  handleFormatTimestampToDate,
  handleFormatTimestampToDate2,
};
