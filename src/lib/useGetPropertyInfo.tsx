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
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/property_info/`,
        {
          params: {
            listing_url,
            get_loan_limits,
          },
        },
      )

      if (!response.data) {
        throw new Error('Response data is missing')
      }

      const { data } = response

      return data
    } catch (error) {
      throw new Error('Failed to fetch property data')
    }
  }

  const query = useQuery(['listing', listing_url], fetchCounties, {
    enabled: listingURLPresent,
    retry: 2,
    retryDelay: 1000,
  })

  // Set isLoading to false if the query is disabled
  const isLoading = query.isLoading && query.isFetching && listingURLPresent

  return { ...query, isLoading }
}
