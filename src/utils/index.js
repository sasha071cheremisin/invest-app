import moment from 'moment';

const timeIntervals = {
	7: [7,8,9,10],
	11: [11,12,13,14],
	15: [15,16,17,18],
	19: [19,20,21,22],
	23: [23,0,1],
};
const keys = Object.keys(timeIntervals);

const getPositionInterval = (hour) => {
	for (let i = 0; i < keys.length; i++) {
		const intervalArr = timeIntervals[keys[i]];
		const idx = intervalArr.indexOf(hour);
		if (idx !== -1) {
			return {
				interval: keys[i],
				position: idx === 0 ? 'first' : idx === intervalArr.length - 1 ? 'last' : null
			};
			break;
		}
	}
}

export const transfer1to4hours = (candles) => {
	const transformCandles = [];
	let currentInterval = 0;

	for (let i = 0; i < candles.length; i++) {
		const hour = moment.utc(candles[i].time).hour();
		const {interval, position} = getPositionInterval(hour);

		if (currentInterval === interval) {
			transformCandles[transformCandles.length - 1].c = candles[i].c;
			transformCandles[transformCandles.length - 1].v += candles[i].v;

			if (candles[i].h > transformCandles[transformCandles.length - 1].h) {
				transformCandles[transformCandles.length - 1].h = candles[i].h;
			}
			if (candles[i].l < transformCandles[transformCandles.length - 1].l) {
				transformCandles[transformCandles.length - 1].l = candles[i].l;
			}
		} else {
			transformCandles.push(candles[i]);
			currentInterval = interval;
		}
	}

	return transformCandles;
}
