#!/usr/bin/env node

// load modules
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

// read argument
var argv = minimist(process.argv.slice(2));

// help message
if (argv.h){
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE -h            Show this help message and exit. -n, -s        Latitude: N positive; S negative. -e, -w        Longitude: E positive; W negative. -z            Time zone: uses tz.guess() from moment-timezone by default. -d 0-6        Day to retrieve weather: 0 is today; defaults to 1. -j            Echo pretty JSON from open-meteo API and exit.")
    process.exit(0);
}

// create url
let lat;
if (argv.n){
    lat = Math.round(argv.n * 100) / 100;
} else if (argv.s){
    lat = Math.round(argv.s * 100) / 100;
} else {
    lat = undefined;
}
if (lat == undefined){
    console.log('Latitude must be in range.')
    process.exit(1);
}

let long;
if (argv.e){
    long = Math.round(argv.e * 100) / 100;
} else if (argv.w){
    long = Math.round(argv.w * 100) / 100;
} else {
    long = undefined;
}
if (long == undefined){
    console.log("Longitude must be in range.")
    process.exit(1);
}

const timezone = argv.z ?? moment.tz.guess();




const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;

//API tings
const response = await fetch(url);
const data = await response.json();

// j flag
if (argv.j){
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}



// response text

const days = argv.d ?? 1;
const rain = data.daily.precipitation_hours[days];


let day_message = undefined;
if (days == 0) {
  day_message = "today.";
} else if (days > 1) {
    day_message = "in " + days + " days.";
} else {
    day_message = "tomorrow."
}

if (rain > 0){
    console.log("You might need your galoshes " + day_message);
}
else{
    console.log("You probably won't need your galoshes " + day_message);
}


