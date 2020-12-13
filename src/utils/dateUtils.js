export function getTime(timestamp) {
    if (!timestamp) return ''
    let day = "",
        month = "",
        hours = "",
        minutes = "",
        seconds = "",
        d = new Date(timestamp);

    day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
    hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    let date = (d.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
    return date
}
