export const pad = [
	{
		value: '0',
		color: '#00a307',
	},
	{
		value: '3',
		color: '#1f2737',
	},
	{
		value: '6',
		color: '#c72f40',
	},
	{
		value: '9',
		color: '#1f2737',
	},
	{
		value: '12',
		color: '#1f2737',
	},
	{
		value: '15',
		color: '#c72f40',
	},
	{
		value: '18',
		color: '#1f2737',
	},
	{
		value: '21',
		color: '#1f2737',
	},
	{
		value: '24',
		color: '#c72f40',
	},
	{
		value: '27',
		color: '#1f2737',
	},
	{
		value: '30',
		color: '#1f2737',
	},
	{
		value: '33',
		color: '#c72f40',
	},
	{
		value: '36',
		color: '#1f2737',
	},
	{
		value: '2',
		color: '#c72f40',
	},
	{
		value: '5',
		color: '#1f2737',
	},
	{
		value: '8',
		color: '#c72f40',
	},
	{
		value: '11',
		color: '#c72f40',
	},
	{
		value: '14',
		color: '#1f2737',
	},
	{
		value: '17',
		color: '#c72f40',
	},
	{
		value: '20',
		color: '#c72f40',
	},
	{
		value: '23',
		color: '#1f2737',
	},
	{
		value: '26',
		color: '#c72f40',
	},
	{
		value: '29',
		color: '#c72f40',
	},
	{
		value: '32',
		color: '#1f2737',
	},
	{
		value: '35',
		color: '#c72f40',
	},
	{
		value: '1',
		color: '#1f2737',
	},
	{
		value: '4',
		color: '#c72f40',
	},
	{
		value: '7',
		color: '#1f2737',
	},
	{
		value: '10',
		color: '#c72f40',
	},
	{
		value: '13',
		color: '#c72f40',
	},
	{
		value: '16',
		color: '#1f2737',
	},
	{
		value: '19',
		color: '#1f2737',
	},
	{
		value: '22',
		color: '#c72f40',
	},
	{
		value: '25',
		color: '#1f2737',
	},
	{
		value: '28',
		color: '#c72f40',
	},
	{
		value: '31',
		color: '#c72f40',
	},
	{
		value: '34',
		color: '#1f2737',
	},
].map((p) => ({ ...p, label: p.value, type: 0 }));

export type Pad = (typeof pad)[number];

export const pad2 = [
	{
		value: '8',
		label: 'Even',
		color: '#ffffff14',
		type: 1
	},
	{
		value: '8',
		label: 'BLACK',
		hideText: true,
		color: '#1f2737',
		type: 1
	},
	{
		value: '9',
		label: 'RED',
		hideText: true,
		color: '#c72f40',
		type: 2
	},
	{
		value: '9',
		label: 'Odd',
		color: '#ffffff14',
		type: 2
	},
];
