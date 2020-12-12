
  let startDate = new Date(challenge.startDate);
  let format = challenge.timeFormat;
  function timeFormatNumb(format){
  if (format == 'Days'){
    return 1;
  }
  else if (format == 'Weeks'){
      return 7;
    }
  else if (format == 'Months'){
      return 30;
    }
    else if (format == 'Years'){
      return 365;
    }
  }
  let duration = challenge.timeNumber * timeFormatNumb(format);
  let finishDate = startDate + duration;
  let date2 = finishDate;
  function daysBetween(date1, date2) {
    if (today() < startDate ){
      let date1 = startDate;
    } 
    else{
      let date1 = today();
    }
 

}
  
