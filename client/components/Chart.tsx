import {
    Box,
    Group, Alert,
    SegmentedControl, Paper,
    Text, Loader,
    createStyles,
    Center,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic';
import { timeConvert, dateTitle, lineColor, segData } from "./modules";
const Line = dynamic(() => import('@ant-design/plots').then(({ Line }) => Line),
    { ssr: false }
);
const useStyles = createStyles((theme) => ({}));
function Chart({ movementKey, searchDate }) {

    const { classes, theme } = useStyles();
    const [processedData, setProcessedData] = useState([]);
    const [timeFrame, setTimeFrame] = useState('15m');

    const { isLoading, error, data } = useQuery({
        queryKey: [movementKey + timeFrame + searchDate[0].getTime() + searchDate[1].getTime()],
        queryFn: () =>
            fetch('http://localhost:3001/' + movementKey + '/' + timeFrame + '/' + searchDate[0].getTime() + '/' + searchDate[1].getTime()).then(
                (res) => res.json(),
            ),
    })

    let calculation = useMemo(() => timeConvert(data, movementKey), [data, movementKey]);

    useEffect(() => {
        if (data) setProcessedData(calculation)
    }, [data]);

    const LineChart = () => {
        const config = {
            data: processedData,
            padding: 'auto',
            xField: 'Date',
            yField: movementKey,
            xAxis: {
                tickCount: 5,
                label: {
                    formatter: (v) => {
                        let timestamp = new Date((v));
                        return timestamp.toLocaleTimeString("en-UK", {
                            hour: 'numeric', minute: 'numeric', hour12: false
                        })
                    },
                }
            },
            lineStyle: {
                stroke: lineColor[0][movementKey],
            },
            theme: theme.colorScheme === 'dark' ? 'dark' : 'default',
            slider: {
                start: 0.10,
                end: 0.30,
                height: 30,
            },
        };

        return <Line {...config} />;
    };


    return (
        <Paper
            mt="xs"
            radius="md"
            withBorder>
            <div className={'widgetLink'}>
                <Group>
                    <div style={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            {'Turning Movements Counts'}
                        </Text>
                        <Text color="dimmed" size="xs">
                            {dateTitle(searchDate)}
                        </Text>
                    </div>
                    <SegmentedControl size="xs"
                        value={timeFrame}
                        onChange={setTimeFrame}
                        data={segData()}
                    />
                </Group>
            </div >
            <Box p="xs">
                {isLoading && <Center><Loader variant="bars" /></Center>}
                {<LineChart />}
            </Box>

        </Paper >
    );
}

export default Chart;