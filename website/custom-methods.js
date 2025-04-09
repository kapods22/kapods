Date.prototype.getMonthName = function() {
  if (this.getMonth() == 0) {return "January"};
  if (this.getMonth() == 1) {return "February"};
  if (this.getMonth() == 2) {return "March"};
  if (this.getMonth() == 3) {return "April"};
  if (this.getMonth() == 4) {return "May"};
  if (this.getMonth() == 5) {return "June"};
  if (this.getMonth() == 6) {return "July"};
  if (this.getMonth() == 7) {return "August"};
  if (this.getMonth() == 8) {return "September"};
  if (this.getMonth() == 9) {return "October"};
  if (this.getMonth() == 10) {return "November"};
  if (this.getMonth() == 11) {return "December"};
};

Date.prototype.getMonthAbbr = function() {
  if (this.getMonth() == 0) {return "Jan"};
  if (this.getMonth() == 1) {return "Feb"};
  if (this.getMonth() == 2) {return "Mar"};
  if (this.getMonth() == 3) {return "Apr"};
  if (this.getMonth() == 4) {return "May"};
  if (this.getMonth() == 5) {return "June"};
  if (this.getMonth() == 6) {return "July"};
  if (this.getMonth() == 7) {return "Aug"};
  if (this.getMonth() == 8) {return "Sept"};
  if (this.getMonth() == 9) {return "Oct"};
  if (this.getMonth() == 10) {return "Nov"};
  if (this.getMonth() == 11) {return "Dec"};
};

Date.prototype.getDayName = function() {
  if (this.getDay() == 0) {return "Sunday"};
  if (this.getDay() == 1) {return "Monday"};
  if (this.getDay() == 2) {return "Tuesday"};
  if (this.getDay() == 3) {return "Wednesday"};
  if (this.getDay() == 4) {return "Thursday"};
  if (this.getDay() == 5) {return "Friday"};
  if (this.getDay() == 6) {return "Saturday"};
};

Date.prototype.getDayAbbr = function() {
  if (this.getDay() == 0) {return "Sun"};
  if (this.getDay() == 1) {return "Mon"};
  if (this.getDay() == 2) {return "Tues"};
  if (this.getDay() == 3) {return "Wed"};
  if (this.getDay() == 4) {return "Thurs"};
  if (this.getDay() == 5) {return "Fri"};
  if (this.getDay() == 6) {return "Sat"};
};

String.prototype.gReplaceAll = function(search, replacement) {
  // An alternative to String.prototype.replaceAll() that should work in all browsers
  return this.replace(new RegExp(search, 'g'), replacement);
}

String.prototype.removeEndStr = function(endStr) {
  // Removes every instance of endStr at the end of the string
  let str = this;
  while (str.endsWith(endStr)) {
    str = str.slice(0, -endStr.length);
  }
  return str;
}
