import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import { Box, Typography, useMediaQuery } from '@mui/material';
import FlexBetween from './FlexBetween';



interface IBars {
  date: string,
  income: number,
  moneySpend: number,
  saved: number
}


export default function ChartBars({ barsData } : { barsData: IBars[] }) {
  const totalIncome: number = barsData.reduce((total: number, s: IBars) => s.income + total, 0)
  const totalspend: number = barsData.reduce((total: number, s: IBars) => s.moneySpend + total, 0)
  const totalSaved : number = barsData.reduce((total: number, s: IBars) => s.saved + total, 0)
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');


  const chartSetting = {
    yAxis: [
      {
        label: 'Income €/month',
      },
    ],
    width: 300,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
  };
  
  const dataset = barsData;
  const valueFormatter = (value: number | null) => `${value}€`;


  return (
    <Box textAlign='center' display='flex' flexDirection='column' padding='1rem' width={'100%'} gap='1rem'>
      {barsData && (
        <BarChart 
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
          {...chartSetting}
          colors={['#1f77b4','#ff7f0e','#2ca02c']}
          series={[
            { dataKey: 'income', label: 'Income', valueFormatter },
            { dataKey: 'moneySpend', label: 'Spend', valueFormatter },
            { dataKey: 'saved', label: 'Saved', valueFormatter },
          ]}
          width={isNonMobileScreen ? 700 : 300}
          height={isNonMobileScreen ? 400 : 300}
          margin={{left: 60, right: 60}}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'top', horizontal:'middle' },
              padding: 0,
              labelStyle: {
                fontSize: isNonMobileScreen ? 20 : 10
              },
            },
          }}
        />
      )}
      <FlexBetween>
        <Typography>Income: {totalIncome}€</Typography>
        <Typography>Spend: {totalspend}€</Typography>
        <Typography>Saved: {totalSaved}€</Typography>
      </FlexBetween>
    </Box>
  )
}
