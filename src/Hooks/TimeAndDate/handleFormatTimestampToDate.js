import moment from "moment"

function handleFormatDateB(date) {
    return moment(date).format("dddd, MMM Do YYYY")
}

function handleFormatTimestampToDate(timestamp) {
    const createdAtDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6)//1e6 = 1000000
    return moment(createdAtDate).format("DD MMM YYYY")
}

export { handleFormatDateB, handleFormatTimestampToDate }