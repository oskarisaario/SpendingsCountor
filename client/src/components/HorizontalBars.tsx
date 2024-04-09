import { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import { Box, useMediaQuery } from '@mui/material';



interface ISpending {
  class: string,
  amount: number
}

interface ISpendings {
  date: string,
  income: number,
  spendings?: Array<ISpending>
}



interface IClasses {
  [key: string] : number,
}



export default function HorizontalBars({ userSpendings } : { userSpendings: ISpendings[] }) {
  const [test, setTest] = useState<IClasses[]>();
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  
  useEffect(() => {
    if(userSpendings) {
      const spendingClasses: IClasses[] = [];
      const classes: IClasses = {};
      spendingClasses.push(classes);
      userSpendings.map(spendings => spendings.spendings?.map(s => {
        if(!spendingClasses[0][s.class]) {
          classes[s.class] = s.amount;
        } else {
          if(spendingClasses[0][s.class]){
            spendingClasses[0][s.class] = spendingClasses[0][s.class] + s.amount;
          }
        }
      }))
      setTest(spendingClasses)
    }
  }, [])


  const chartSetting = {
    xAxis: [
      {
        label: 'Money spend',
      },
    ],
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateY(-10px)',
      },
    },
    width: 300,
    height: 300,
  };
  
  const valueFormatter = (value: number | null) => `${value}€`;


  if(test){
    delete test[0]['auto-generated-id-0']
  }

  return (
    <Box textAlign='center' display='flex' flexDirection='column' padding='1rem' width={'100%'} gap='1rem'>
      {test && (
      <BarChart 
        yAxis={[{scaleType: 'band', data: Object.keys(test[0]) }]}
        {...chartSetting}        
        colors={['#1f77b4']}
        series={[{ data: Object.values(test[0]) , valueFormatter }]}
        layout='horizontal'
        width={isNonMobileScreen ? 700 : 300}
        height={isNonMobileScreen ? 400 : 300}
        margin={{left: 95, right: 40, top: 10}}
      />
      )}
    </Box>
  )
}
