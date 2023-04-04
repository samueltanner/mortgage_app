import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface CountiesParams {
  state_abbr: string
}

export const useGetCounties = ({ state_abbr }: CountiesParams) => {
  const fetchCounties = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/county_list/`,
      {
        params: {
          state_abbr,
        },
      },
    )
    if (!state_abbr || state_abbr === '') {
      return {
        isLoading: false,
        isError: false,
        isSuccess: false,
        data: [],
      }
    }
    return data.counties
  }

  return useQuery(['counties', state_abbr], fetchCounties)
}
