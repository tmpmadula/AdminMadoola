/**
 * Converts unix timestamp into a time ago string like 2 hours ago
 *
 * @param {string} date unix timestamp
 */


 //import moment from "moment";
export const timeAgo = (unixTimestamp) => {
  const date = new Date(parseInt(unixTimestamp));
  console.log("new",date)

  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + ' years';
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' months';
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' days';
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' hours';
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + ' mins';
  }

  return Math.floor(seconds) + ' seconds';
};

/**
 * Converts unix timestamp to current date
 *
 * @param {string} date unix timestamp
 */
export const currentDate = (unixTimestamp) => {
  const date = new Date(parseInt(unixTimestamp));
  //console.log("new",date)
  //const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const month = date.toString().substr(4,3);
  const day = date.toString().substr(8,2);
  const year = date.toString().substr(11,4);
  const time = date.toLocaleString('en-ZA', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });


  return `${month} ${day}, ${year} ${time}`;
};
