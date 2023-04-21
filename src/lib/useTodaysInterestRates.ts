import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export const useTodaysInterestRates = () => {
  const fetchTodaysInterestRates = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interest_rates/`)
    return data
  }

  return useQuery(['interest_rates'], fetchTodaysInterestRates, { refetchOnWindowFocus: false })
};
