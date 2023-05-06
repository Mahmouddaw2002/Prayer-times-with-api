import axios from "axios";

let video = document.querySelector("video");
video.playbackRate = 1;

const cities = [
  {
    arabicName: "القدس",
    name: "Jerusalem",
  },
  {
    arabicName: "بيت لحم",
    name: "Bethlehem",
  },
  {
    arabicName: "غزة",
    name: "North Gaza",
  },

  {
    arabicName: "الخليل",
    name: "Hebron",
  },

  {
    arabicName: "نابلس",
    name: "Nablus",
  },

  {
    arabicName: "رام الله",
    name: "Ramallah",
  },

  {
    arabicName: "سلفيت",
    name: "Salfit",
  },

  {
    arabicName: "رفح",
    name: "Rafah",
  },
];

for (let city of cities) {
  const content = `
        <option>${city.arabicName}</option>
        `;
  document.getElementById("cities-select").innerHTML += content;
}

document
  .getElementById("cities-select")
  .addEventListener("change", function () {
    let cityName = "";
    for (let city of cities) {
      if (city.arabicName == this.value) {
        cityName = city.name;
        document.getElementById("citiesName").innerHTML = city.arabicName;
      }
    }

    getPrayersTimingOfCity(cityName);
  });

function getPrayersTimingOfCity(cityName) {
  const params = {
    country: "PS",
    city: cityName,
  };

  axios
    .get("http://api.aladhan.com/v1/timingsByCity", {
      params: params,
    })
    .then(function (response) {
      const apiData = response.data.data;
      fillTimeForPrayer("fajer-time", apiData.timings.Fajr);
      console.log(apiData.timings.Fajr);
      fillTimeForPrayer("sunrise-time", apiData.timings.Sunrise);
      fillTimeForPrayer("dhuhr-time", apiData.timings.Dhuhr);
      fillTimeForPrayer("asr-time", apiData.timings.Asr);
      fillTimeForPrayer("sunset-time", apiData.timings.Sunset);
      fillTimeForPrayer("isha-time", apiData.timings.Isha);

      const readableDateYear = apiData.date.hijri.year;
      const readableDateMonth = apiData.date.hijri.month.ar;
      const readableDateWeekday = apiData.date.hijri.weekday.ar;
      const readableDateDay = apiData.date.hijri.day;
      const readableDateReadable = apiData.date.readable;

      const date =
        readableDateReadable +
        " | " +
        readableDateWeekday +
        " | " +
        readableDateDay +
        " | " +
        readableDateMonth +
        " | " +
        readableDateYear;
      fillTimeDataForPrayer("date", date);
    })
    .catch(function (error) {
      console.log(error);
    });
}

getPrayersTimingOfCity("Jerusalem");

function fillTimeForPrayer(id, time) {
  var ts = time;
  var H = +ts.substr(0, 2);
  var h = H % 12 || 12;
  h = h < 10 ? "0" + h : h;
  var ampm = H < 12 ? " AM " : " PM ";
  ts = h + ts.substr(2, 3) + ampm;
  document.getElementById(id).innerHTML = ts;
}

function fillTimeDataForPrayer(id, date) {
  document.getElementById(id).innerHTML = date;
}

function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  var meridian = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  var strTime = h + ":" + m + ":" + s + " " + meridian;
  document.getElementById("timeClock").innerText = strTime;
  setTimeout(startTime, 1000);
}

startTime();
