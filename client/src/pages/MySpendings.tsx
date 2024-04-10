import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setSpendings } from '../redux/userSlice';
import { Box, Typography, useTheme, useMediaQuery, TextField, Divider, MenuItem } from '@mui/material';
import WidgetWrapper from "../components/WidgetWrapper";
import ChartPie from '../components/ChartPie';
import ChartBars from '../components/ChartBars';
import FlexBetween from '../components/FlexBetween';
import HorizontalBars from '../components/HorizontalBars';



interface ISpending {
  class: string,
  amount: number
}

interface ISpendings{
  month: Date,
  income: number,
  spendings?: Array<ISpending>
}

interface IData {
  id: number,
  label: string,
  value: number
}

interface IBars {
  month: string,
  income: number,
  moneySpend: number,
  saved: number
}



export default function MySpendings() {
  const [userSpendings, setUserSpendings] = useState<ISpendings[] | undefined>();
  const [chartData, setChartData] = useState<IData[]>();
  const [barsData, setBarsData] = useState<IBars[]>();
  const [income, setIncome] = useState<number>(0);
  const [moneySpend, setMoneySpend] = useState<number>(0);
  const [monthField, setMonthField] = useState<ISpendings | string>('');
  const dispatch = useDispatch();
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  const { currentUser, token } = useSelector((state: RootState) => state.user);
  const theme = useTheme();
  

  useEffect(() => {
    const getSpendings = async() => {
      try {
        const res = await fetch(`/api/spendings/userSpendings/${currentUser?._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success === false || data.length === 0) {
          console.log(data.message);
          return;
        }
        //dispatch(setSpendings(data))
        const newSpendings: ISpendings[] = [];
        data.map((s: ISpendings) => {
          const newSpending = {month: s.month, income: s.income, spendings: s.spendings}
          newSpendings.push(newSpending);
        })
        dispatch(setSpendings(newSpendings))
        setUserSpendings(newSpendings);
        dataForBars(data);
      } catch (error) {
        console.log('error',error)
      }
    };
    getSpendings();
  }, [!userSpendings, !chartData]);  // eslint-disable-line react-hooks/exhaustive-deps



  //MODIFY KEYS IN OBJECTS TO WORK IN PIECHART
  const dataForPie = (userSpendings: ISpendings) => {
    if(userSpendings) {
      setIncome(userSpendings?.income);
      setMoneySpend(userSpendings.spendings.reduce((total: number, s: ISpending) => s.amount + total, 0))
      let newKeysForChart: IData[] = [];
      newKeysForChart = userSpendings?.spendings?.map((rec, i) => {
        return {
          'value': rec.amount,
          'label': rec.class,
          'id': i
        }
      })
      /*newKeysForChart = newKeysForChart.map((s, i) => ({
        ...s, 'id': i
      }))*/
      setChartData(newKeysForChart);
    }
    return;
  };

  const dataForBars = (data: ISpendings[]) => {
    if(data) {
      const newSpendings: IBars[] = [];
      data.map((s: ISpendings) => {
        const spend = s.spendings.reduce((total: number, s: ISpending) => s.amount + total, 0)
        const newSpending = {
          month: String(s.month).slice(0, 7), 
          income: s.income, 
          moneySpend: spend,
          saved: s.income - spend
        }
        newSpendings.push(newSpending);
      })
      setBarsData(newSpendings);
    }
  };


  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMonthField(e.target.value);
  };


  return (
    <Box display="flex" justifyContent="center" alignItems="center" marginBottom='1.5rem'>
      <WidgetWrapper width='80%' style={{backgroundColor: theme.palette.background.alt}} p='1rem 6%' textAlign='center' maxWidth='800px'>
        <Typography fontWeight='bold' fontSize={isNonMobileScreen ? '32px' : '20px'} color='primary'>Spendings by month</Typography>
        <Box  textAlign='center' display='flex' flexDirection= 'row' padding='1rem' width={'100%'} gap='1rem' justifyContent='center'>     
          <TextField
            id='month'
            label='Month'
            select
            sx={{width: isNonMobileScreen ? '30%' : '100%'}}
            value={monthField}
            onChange={(e) => handleMonthChange(e)}
          >
            {userSpendings ? userSpendings.map((s, i) => (
              <MenuItem key={i} value={String(s.month).slice(0, 7)} onClick={() => dataForPie(s)}>{String(s.month).slice(0, 7)}</MenuItem>
            )) : (
              <Typography textAlign='center'>No spendings added yet</Typography>
            )}
          </TextField>
        </Box>
        {chartData && (
          <>
          <ChartPie chartData={chartData} />
          <FlexBetween>
            <Typography>Income: {income}€/m</Typography>
            <Typography>Spend: {moneySpend}€/m</Typography>
            <Typography>Saved: {income - moneySpend}€/m</Typography>
          </FlexBetween>
          </>
        )}
        {barsData && (
          <>
            <Divider sx={{marginBottom: '1rem', marginTop: '1rem'}}/>         
            <Typography fontWeight='bold' fontSize={isNonMobileScreen ? '32px' : '20px'} color='primary'>All your monthly spendings</Typography>
            <ChartBars barsData={barsData} />
            <Divider sx={{marginBottom: '1rem', marginTop: '1rem'}}/>            
            <Typography fontWeight='bold' fontSize={isNonMobileScreen ? '32px' : '20px'} color='primary'>All your spendings by class</Typography>
            {userSpendings && (
              <HorizontalBars userSpendings={userSpendings} />
            )}
          </>
        )}
      </WidgetWrapper>
    </Box>
  )
}
