const dummyData = require('./data.json');
const NodeCache = require('node-cache');

const myCache = new NodeCache({ stdTTL: 60 }); // 1min
const mvMnt = ['SBT', 'SBL', 'NBT', 'NBL', 'WBT', 'WBL', 'EBT', 'EBL'];
const tF = [{ '15m': 15, '30m': 30, '1h': 60, '2h': 120 }];

function timeFrameConverter(data, movementKey, tfKey, timeline) {
  let start = Number(data[0].entry_date);
  let newData = [];
  let t = tF[0][tfKey];
  let end = start + t * 60000;
  let count = 0;
  data.forEach((v) => {
    if (start <= Number(v.entry_date) && end > Number(v.entry_date)) {
      return (count += v.movements[movementKey].v);
    } else {
      newData = [...newData, { Date: start, [movementKey]: count }];
      start = Number(v.entry_date);
      end = start + t * 60000;
      count = v.movements[movementKey].v;
    }
  });
  let cKey = movementKey + tfKey + timeline;
  console.log('sent from thread', cKey);
  myCache.set(cKey, newData);
  return newData;
}

function process(movement, timeFrame, from, to) {
  let cKey = movement + timeFrame + from + to;
  if (myCache.has(cKey)) {
    console.log('sent from cache', cKey);
    return myCache.get(cKey);
  } else {
    let filterData = dummyData.TMC.filter(
      (v) =>
        Number(from) <= Number(v.entry_date) &&
        Number(v.entry_date) <= Number(to)
    );
    if (filterData.length < 10) {
      return timeFrameConverter(dummyData.TMC, movement, timeFrame, from + to);
    }
    return timeFrameConverter(filterData, movement, timeFrame, from + to);
  }
}

module.exports = { process, mvMnt, tF };
