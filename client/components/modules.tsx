//add date to chart title
function dateTitle(date) {
    let conv = (date) => {
        let timestamp = new Date(date);
        return timestamp.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
        });
    }
    return conv(date[0]) + ' to ' + conv(date[1])

}
// convert timestamp to min for chart
function timeConvert(data, key) {
    if (data?.hasOwnProperty('error')) return []
    return data?.map(v => {
        let timestamp = new Date(Number(v.Date));
        let date = timestamp.toLocaleDateString("en-UK", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric", hour: 'numeric', minute: 'numeric'
        });
        return { Date: date, [key]: v[key] }
    })
}

const lineColor = [{ 'SBT': '#C34D58', 'SBL': '#B0B872', 'NBT': '#7C1BD0', 'NBL': '#55BC06', 'WBT': '#39785F', 'WBL': ' #C51D34', 'EBT': '#3cd2cd', 'EBL': '#95ed27' }];

const segData = () => ['15m', '30m', '1h', '2h'].map(v => {
    return { label: v, value: v }
})

const movementData = [
    { SBT: 'SouthBound Through' }, { SBL: 'SouthBound LeftTurn' }, { NBT: 'NorthBound Through' }, { NBL: 'NorthBound LeftTurn' }, { WBT: 'WestBound Through' }, { WBL: 'WestBound LeftTurn' }, { EBT: 'EastBound Through' }, { EBL: 'EastBound LeftTurn' }
];

let defaultRange = [
    new Date(2022, 1, 21),
    new Date(2022, 1, 28),
]


export { dateTitle, timeConvert, lineColor, segData, movementData, defaultRange }