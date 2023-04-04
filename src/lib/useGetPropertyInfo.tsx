import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface CountiesParams {
  listing_url: string
  get_loan_limits: boolean
}

export const useGetPropertyInfo = ({
  listing_url,
  get_loan_limits,
}: CountiesParams) => {
  const fetchCounties = async () => {
    if (listing_url) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/property_info/`,
        {
          params: {
            listing_url,
            get_loan_limits,
          },
        },
      )
      return data
    }
    if (!listing_url) {
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: null,
      }
    }
  }

  return useQuery(['listing', listing_url], fetchCounties)
}
