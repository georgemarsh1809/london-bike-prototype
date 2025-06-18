import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const EllipsisTick = ({ x, y, payload }) => {
    const maxChars = 9;
    const label =
        payload.value.length > maxChars
            ? payload.value.slice(0, maxChars - 1) + '…'
            : payload.value;

    const barWidth = 60; // adjust this to your actual bar width
    const leftAlignedX = x - barWidth / 2 + 4; // +4 px padding so text isn’t flush left
    return (
        <text
            x={leftAlignedX - 5}
            y={y + 10}
            fill="#333"
            textAnchor="start"
            fontSize={13}
            style={{ userSelect: 'none' }}
        >
            {label}
        </text>
    );
};

export const BoroughChangesGraph = ({ data }) => {
    return (
        <div
            style={{
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                padding: '15px',
                border: 'solid 3px rgb(62, 94, 58)',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
        >
            <ResponsiveContainer width="100%" height={302}>
                <BarChart
                    data={data}
                    width={750}
                    height={300}
                    margin={{
                        right: 10,
                        left: -15,
                        bottom: -8,
                    }}
                    barCategoryGap="3%"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="borough" tick={EllipsisTick} interval={0} />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name) => [
                            `${value}`,
                            name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                        labelFormatter={(label) => `Borough: ${label}`}
                    />

                    <Bar
                        dataKey="pct_change"
                        fill="#6fbf73"
                        barSize={'11%'}
                        radius={[4, 4, 0, 0]}
                        barBackground={{ fill: '#e0e0e0' }}
                    >
                        {data?.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    entry.actual_pct_change >= 0
                                        ? '#34d399'
                                        : '#f87171'
                                } // green or red
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
