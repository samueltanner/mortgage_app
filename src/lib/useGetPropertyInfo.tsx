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
  const listingURLPresent = !!listing_url && listing_url !== ''
  const fetchCounties = async () => {
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
  return useQuery(['listing', listing_url], fetchCounties, {
    enabled: listingURLPresent,
  })
}
