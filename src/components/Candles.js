import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ApexCharts from 'react-apexcharts';
import moment from 'moment';
import {transfer1to4hours} from '../utils';

const options = {
	chart: {
		type: 'candlestick',
		height: 290,
		id: 'candles',
		toolbar: {
			autoSelected: 'pan',
			show: false
		},
		zoom: {
			enabled: false
		},
		animations: {
			enabled: false,
		},
	},
	title: {
		text: 'CandleStick Chart',
		align: 'left'
	},
	xaxis: {
		type: 'datetime',
	},
	yaxis: {
		tooltip: {
			enabled: true
		},
		range: 30,
	},
	tooltip: {
		x: {
			format: 'dd/MM/yy H:mm'
		}
	},
};
const optionsBar = {
	chart: {
		height: 160,
		type: 'bar',
		brush: {
			enabled: true,
			target: 'candles'
		},
		selection: {
			enabled: true,
			fill: {
				color: '#ccc',
				opacity: 0.4
			},
			stroke: {
				color: '#0D47A1',
			}
		},
		animations: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false
	},
	plotOptions: {
		bar: {
			columnWidth: '80%',
			colors: {
				ranges: [{
					from: -1000,
					to: 0,
					color: '#F15B46'
				}, {
					from: 1,
					to: 10000,
					color: '#FEB019'
				}],

			},
		}
	},
	stroke: {
		width: 0
	},
	xaxis: {
		type: 'datetime',
		axisBorder: {
			offsetX: 13
		}
	},
	yaxis: {
		labels: {
			show: false
		}
	},
};

const Candles = ({companyTicker}) => {
	const [result, setResult] = useState({});
	const [data, setData] = useState([]);
	const [dataBar, setDataBar] = useState([]);

	useEffect(() => {
		fetch(`/api/candles/${encodeURIComponent(companyTicker)}`)
			.then(response => response.json())
			.then(result => setResult(result));
	}, []);

	useEffect(() => {
		if (Object.keys(result).length === 0) return;
		const customCandles = [...result.candles];
		// переводим в 4 часа
		const transferData = transfer1to4hours(customCandles);
		const resultData = [];
		const resultDataBar = [];

		transferData.forEach(candle => {
			resultData.push({
				x: moment.utc(candle.time).toDate(),
				y: [candle.o, candle.h, candle.l, candle.c]
			});
			resultDataBar.push({
				x: moment.utc(candle.time).toDate(),
				y: candle.v
			});
		});

		setData(resultData);
		setDataBar(resultDataBar);
	}, [result]);
	console.log('result', result);
	console.log('data', data);
	console.log('dataBar', dataBar);
	if (Object.keys(result).length === 0) {
		return (
			<div>
				<h3>Not Found candles {companyTicker}</h3>
			</div>
		);
	}

	// console.log('result', result);
	// console.log('moment', moment('2021-02-01T07:00:00Z').toDate());
	// console.log('moment now', moment().toDate());
	return (
		<div>
			<h2>{companyTicker}: {result.interval}</h2>
			<ApexCharts options={options} series={[{data: data}]} type="candlestick" height={350}/>
			<ApexCharts options={optionsBar} series={[{
				name: 'volume',
				data: dataBar
			}]} type="bar" height={160}/>
		</div>
	);
};
export default Candles;
