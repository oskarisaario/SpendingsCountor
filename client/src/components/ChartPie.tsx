import { Box, useMediaQuery } from '@mui/material';
import {  PieChart } from "@mui/x-charts";


interface IData {
  id: number,
  label: string,
  value: number
}


export default function ChartPie({ chartData } : { chartData: IData[] }) {
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');

  
  return (
    <Box textAlign='center' display='flex' flexDirection='column' padding='1rem' width={'100%'} gap='1rem'> 
      <PieChart 
        colors={['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf']}
        series={[
          {
            arcLabel: (item) => `${item.value}€`,
            arcLabelMinAngle: 35,
            data: chartData,
            cx: isNonMobileScreen ? '40%' : '80%',
            cy: isNonMobileScreen ? '50%' : '70%',
            outerRadius: isNonMobileScreen ? '100%' : '150%',
            valueFormatter: (item) => `${item.value}€`
          }
        ]}
        slotProps={{
          legend: {
            direction: isNonMobileScreen ? 'column' : 'row',
            position: { vertical: isNonMobileScreen ? 'middle' : 'top', horizontal: isNonMobileScreen ? 'right' : 'middle' },
            padding: 0,
            labelStyle: {
              fontSize: isNonMobileScreen ? 20 : 10
            },
          },
        }}
        width={isNonMobileScreen ? 700 : 250}
        height={isNonMobileScreen ? 400 : 400}
      />
    </Box>
  )
}
