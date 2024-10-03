import http from "k6/http";
import { sleep } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  /* Option 0: Smoke test */
  vus: 500,
  duration: "1h",

  /* Option 1: Average load test*/

  // stages: [
  //   { duration: '5m', target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
  //   { duration: '30m', target: 100 }, // stay at 100 users for 30 minutes
  //   { duration: '5m', target: 0 }, // ramp-down to 0 users
  // ],

  /* Option 2: Stress test */

  // stages: [
  //   { duration: '10m', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
  //   { duration: '30m', target: 200 }, // stay at higher 200 users for 30 minutes
  //   { duration: '5m', target: 0 }, // ramp-down to 0 users
  // ],

  /* Option 3: Soak test */

  // stages: [
  //   { duration: '5m', target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
  //   { duration: '8h', target: 100 }, // stay at 100 users for 8 hours!!!
  //   { duration: '5m', target: 0 }, // ramp-down to 0 users
  // ],

  /* Option 4: Spike test */

  // stages: [
  //   { duration: '5m', target: 3000 }, // fast ramp-up to a high point
  //   // No plateau
  //   { duration: '1m', target: 0 }, // quick ramp-down to 0 users
  // ],

  /* Option 5: Breakpoint test */

  // executor: 'ramping-arrival-rate', //Assure load increase if the system slows
  // stages: [
  //   { duration: '2h', target: 20000 }, // just slowly ramp-up to a HUGE load
  // ],
};

export default function () {
  let data = {
    primary_key: uuidv4(),
    properties: {
      name: "mahamad",
    },
  };
  const batch_max = 250;
  const events = [];

  let event_names = ["event", "example", "test", "upload", "checkouPmt"];
  let r_num;

  let event;

  let customer;

  const customers = [
      "ffffcac5-332e-46fe-9f1f-ddb9889395d2",
      "ffffadb5-e52c-450a-ac20-e8a20bcc9ddb"
    ];

  const dateMin = -5;
  const dateMax = 5;
  let daysAgo;

  for(let i = 0; i < batch_max; i++) {
    r_num = Math.floor(Math.random() * 1000);
    event = `${event_names[Math.floor(Math.random() * event_names.length)]}-${r_num}`;

    customer = customers[Math.floor(Math.random() * customers.length)];

    daysAgo = Math.floor(
      Math.random() * (dateMax - dateMin + 1) +
        dateMin
    );

    var d = new Date();
    d.setDate(d.getDate() - daysAgo);

    const uuid = uuidv4();

    events.push(`{
      "timestamp": "${d.toISOString()}",
      "uuid": "${uuid}",
      "event": "${event}",
      "source": "mobile",
      "correlationKey": "_id",
      "correlationValue": "${customer}",
    }`)
  }

  // console.log(event);
  let temp_id = uuidv4();
  let res = http.post(
    //"correlationValue": "${temp_id}"
    // 'https://api.laudspeaker.com/customers/upsert',
    "http://localhost:3001/events/batch",
    `{
      "batch": [${events}]
    }`,
    {
      headers: {
        Authorization: "Api-Key fqz9AdCYDzMt2mK2oCnbs32jUafiYr1T8kF5vhl2",
        "Content-Type": "application/json",
      },
    }
  );

  // consl

  // console.log(JSON.stringify(res, null, 2))
  // sleep(1);
}
