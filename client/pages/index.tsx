import { useEffect, useState } from 'react';
import { Grid, Container, Title, Switch, Text, Card, Paper, createStyles, ThemeIcon, Group, RingProgress, Select } from '@mantine/core';
import Chart from '../components/Chart';
import { DateRangePicker } from '@mantine/dates';
import { movementData, defaultRange } from '../components/modules'
const ICON_SIZE = 60;
const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
    control: {
        width: 300,
        display: 'flex',
        margin: '0 auto',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
            }`,
        transition: 'background-color 150ms ease',
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[opened ? 5 : 6]
                : opened
                    ? theme.colors.gray[0]
                    : theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },
    card: {
        position: 'relative',
        overflow: 'visible',
        padding: theme.spacing.xl,
        paddingBottom: 0,
        paddingTop: theme.spacing.xl * 1.5 + ICON_SIZE / 3,
        marginTop: '-2px !important'
    },

    icon: {
        position: 'absolute',
        top: -ICON_SIZE / 3,
        left: `calc(50% - ${ICON_SIZE / 2}px)`,
    },
}));

export default function Dashboard(props) {
    const [opened, setOpened] = useState(false);
    const { classes, theme } = useStyles({ opened });
    const [selected, setSelected] = useState('SBT');

    let selectData = movementData.map(v => {
        return { value: Object.keys(v)[0], label: Object.values(v)[0] }
    })

    const [dateR, setDateR] = useState(defaultRange);

    useEffect(() => {
        checkNull(dateR)
    }, [dateR])

    function checkNull(d) {
        if (d.some(el => el === null)) {
            setDateR(defaultRange)
        } else {
            setDateR(d)
        }
    }


    return (
        <Container size="xl">
            <Grid mt='-20px' >
                <Grid.Col xs={12} mb={'lg'}><Title order={2}>Summary</Title></Grid.Col>
                <Grid.Col xs={3} p={5}>
                    <Paper
                        radius="md"
                        withBorder className={classes.card} mt={ICON_SIZE / 3}>
                        <ThemeIcon color={'green'} className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
                            Live
                        </ThemeIcon>
                        <Group>
                            <Select value={selected} size='xs' style={{ width: '100%' }}
                                label="Vehicles Crossing On"
                                onChange={(v) => setSelected(v)
                                }
                                data={selectData}
                            />
                            <DateRangePicker size='xs' style={{ width: '100%' }}
                                label="Date Range"
                                placeholder="Pick dates range"
                                value={dateR}
                                onChange={(r) => checkNull(r)}
                                mb={'md'}
                            />
                        </Group>
                        <Group mb='md'>

                            <Card withBorder radius="md" w="138px" h='138px' >
                                <Text size="xs" transform="uppercase" weight={700}>
                                    {selected} Type
                                </Text>

                                <Switch
                                    size="lg"
                                    onLabel={<Text size={12}>Vehicles</Text>}
                                    offLabel={<Text size={12}>Total</Text>}
                                />

                            </Card>
                            <Card withBorder radius="md" w="138px" h='138px' p='8px' >
                                <RingProgress
                                    label={
                                        <Text size="xs" align="center">
                                            Traffic
                                        </Text>
                                    }
                                    sections={[
                                        { value: 50, color: theme.colors.green[6] },
                                        { value: 25, color: theme.colors.orange[6] },
                                        { value: 15, color: theme.colors.red[6] },
                                    ]}
                                />
                            </Card>
                        </Group>
                    </Paper>

                </Grid.Col>
                <Grid.Col xs={9} p={5} mt='-10px'>
                    <Chart movementKey={selected} searchDate={dateR} />
                </Grid.Col>
            </Grid>
        </Container >
    );
}
