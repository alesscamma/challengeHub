function hbsHelpers(hbs) {
  hbs.registerHelper("setChecked", function (valueFromDB, fieldValue) {
    if (valueFromDB.includes(fieldValue)) {
      return "checked";
    } else {
        return "";
    }
  });
}

module.exports = hbsHelpers;