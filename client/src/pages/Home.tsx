import React, { useState } from "react";
import dayjs from 'dayjs';
import { 
  Box,
  IconButton,
  Typography,
  MenuItem,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  InputLabel
 } from "@mui/material";
 import {
  AddCircleOutline,
  RemoveCircleOutline,
 } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from '../redux/store';
import FlexBetween from "../components/FlexBetween";
import WidgetWrapper from "../components/WidgetWrapper";



const spendingClasses = [
  'Rent', 'Mortgage', 'Food', 'Clothing',
   'Subscriptions', 'Transportation', 'Hobbies',
    'Investments', 'Entertainment', 'Insurance', 'Kids'
  ];

export type TClass = 
  'Rent' | 'Mortgage' | 'Food' | 'Clothing' 
  | 'Subscriptions' | 'Transportation' | 'Hobbies' | 'Investments'
  | 'Entertainment' | 'Insurance' | 'Kids' | 'Other';


export interface ISpending {
    class: string,
    amount: number
}

export interface ISpendings {
  income: number,
  month: Date
  spendings?: Array<ISpending>
}

interface ICurrentSpendings {
  income: number,
  date: Date,
  spendings?: Array<ISpending>
  _id: string
}

interface InputField {
  id: number;
  value: {
    class: string,
    amount: number
  };
}

const spendings: ISpending[] = [];

export default function Home() {
  const theme = useTheme();
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<ISpendings | null>();
  const [income, setIncome] = useState<number>(0);
  const [month, setMonth] = useState<Date>(new Date());
  const [replaceOld, setReplaceOld] = useState<boolean>(false);
  const [replaceId, setReplaceId] = useState<string>('');
  const [warning, setWarning] = useState<boolean>(false);
  const [inputFields, setInputFields] = useState<InputField[]>([
    { id: 0, value: {class: '', amount: 0} },
  ]);



  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newIncome = Number(e.target.value);
    setIncome(newIncome);
  };


  const handleAddFields = () => {
    const newInputFields = [...inputFields];
    newInputFields.push({ id: inputFields.length, value: {class: '', amount: 0} });
    setInputFields(newInputFields);
  };

  const handleRemoveFields = (id: number) => {
    const newInputFields = inputFields.filter((field) => field.id !== id);
    setInputFields(newInputFields);
  };

  const handleInputChange = (id: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newInputFields = inputFields.map((field) => {
      if (field.id === id) {
        return { ...field, 
          value: {
            class: event.target.value,
            amount: field.value.amount
          } 
        };
      }
      return field;
    });
    setInputFields(newInputFields);
  };

  const handleAmountChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const amount = Number(e.target.value);
    const newInputFields = inputFields.map((field) => {
      if (field.id === id) {
        return { ...field, 
          value: {
            class: field.value.class,
            amount: amount
          }
        };
      }
      return field;
    });
    setInputFields(newInputFields);
  };


  //Checks if there is already saved Spending with selected month
  const checkDuplicates = () => {
    if(currentUser?.spendings) {
      const oldSpendings : ICurrentSpendings[] = currentUser!.spendings;
      const newSpending = formData?.month.toISOString();
      let isFound = false;
      oldSpendings.map((s) => {
        if(String(s.date).slice(0, 7) === newSpending?.toString().slice(0, 7) && !replaceOld){
          isFound = true;
          setReplaceId(s._id?? '');
          return;
        }
      })
      if(isFound){
        setWarning(true);
        return false;
      }
      setWarning(false);
      return true;
    }
  };


  const handleChange = () => {
    spendings.length = 0;
    inputFields.map(input => {
      spendings.push({
        class: input.value.class,
        amount: input.value.amount
      });
      setFormData({
        income,
        month,
        spendings,
      })     
    })
  }
  
  
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const isOkay = checkDuplicates();
    if(isOkay) {
      try {
        const res = await fetch(`/api/spendings/createSpending/${currentUser?._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({formData, replaceOld, replaceId}),
        });
        const data = await res.json();
        if(data.success === false) {
          console.log(data.message);
          return;
        }
        setReplaceOld(false);
        setReplaceId('');
        setWarning(false);
        setFormData(null);
        setInputFields([{ id: 0, value: {class: '', amount: 0} }]);
        spendings.length = 0;
        navigate('/mySpendings');
      } catch (error) {
        console.log(error)
      }
    }
    return;
  };


  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <WidgetWrapper width='80%' style={{backgroundColor: theme.palette.background.alt}} p='1rem 6%' textAlign='center' maxWidth='800px'>
          <Typography 
            fontWeight='bold' 
            fontSize='32px' 
            color='primary'
          >
            Add monthly spendings
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box textAlign='center' display='flex' flexDirection='column' padding='1rem' width={'100%'} gap='1rem'>
              <FlexBetween display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='1rem'>
              <TextField 
                id='income'
                label='Monthly income'
                inputProps={{ type: 'number'}}
                type='number'
                required
                onChange={(e) => handleIncomeChange(e)}
              />
              <DatePicker 
                views={['month', 'year']} 
                label={'MM/YYYY'} 
                defaultValue={dayjs()}
                disableFuture
                onChange={newValue => newValue && setMonth(newValue.toDate())}
              />
              </FlexBetween>
              <InputLabel>Select Class and amount</InputLabel>
              {inputFields.map((inputField, i) =>
              <Box key={i}  textAlign='center' display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} padding='1rem' width={'100%'} gap='1rem' justifyContent='justify-between'>
                <TextField
                  key={`Field ${inputField.id + 1}`}
                  label='Class of spending' 
                  value={inputField.value.class}
                  onChange={(e) => handleInputChange(inputField.id, e)}
                  select
                  required
                  sx={{width:'100%'}}
                >
                  {spendingClasses.map((s) => 
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  )}
                </TextField>
                <TextField 
                  id='amount'
                  label='Amount'
                  required
                  inputProps={{ type: 'number'}}
                  type='number'
                  onChange={(e) => handleAmountChange(inputField.id, e)}  
                />
                <IconButton onClick={() => handleRemoveFields(inputField.id)}>
                  <RemoveCircleOutline />
                </IconButton>
              </Box>
              )}
              <IconButton sx={{ width: '20%', borderRadius: '1rem'}} onClick={handleAddFields}>
                <Typography>Add spending</Typography>
                <AddCircleOutline />
              </IconButton>
              <Button 
                type="submit"
                sx={{  
                  p: '1rem', 
                  backgroundColor: theme.palette.primary.main, 
                  color: theme.palette.background.alt, 
                  '&:hover': {color: theme.palette.primary.main}
                }}
                onClick={handleChange}
              >
                <Typography fontWeight='bold'>SUBMIT</Typography>
              </Button>
              {warning && (
                <Box>
                  <Typography>Already added spendings for selected month!
                     Change month and press submit or press replace to continue and replace old spendings for
                     selected month
                  </Typography>
                  <Button 
                    type="submit"
                    sx={{  
                      p: '1rem', 
                      backgroundColor: theme.palette.primary.main, 
                      color: theme.palette.background.alt, 
                      '&:hover': {color: theme.palette.primary.main}
                    }}
                    onClick={() => setReplaceOld(true)}
                  >
                <Typography fontWeight='bold'>REPLACE</Typography>
              </Button>
                </Box>
              )}
            </Box>
          </form>
      </WidgetWrapper>
    </Box>
  )
}
