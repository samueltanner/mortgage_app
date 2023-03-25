import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface CountiesParams {
  state_abbr: string
}

export const useGetCounties = ({ state_abbr }: CountiesParams) => {
  const fetchCounties = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/county_list/?state_abbr=${
        state_abbr ? state_abbr : ''
      }`,
    )
    return data
  }

  return useQuery(['counties', state_abbr], fetchCounties)
}
