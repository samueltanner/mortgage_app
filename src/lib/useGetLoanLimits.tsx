import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface useGetLoanLimitsProps {
  state_abbr: string
  county_name: string
}
export const useGetLoanLimits = ({
  state_abbr,
  county_name,
}: useGetLoanLimitsProps) => {
  const paramsPresent =
    !!state_abbr && state_abbr !== '' && !!county_name && county_name !== ''
  const fetchLoanLimits = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/loan_limit_by_county/`,
      {
        params: {
          state_abbr,
          county_name,
        },
      },
    )

    return data
  }

  return useQuery(['loan_limits', state_abbr, county_name], fetchLoanLimits, {
    enabled: paramsPresent,
  })
}
