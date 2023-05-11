import Image from 'next/image'
import { propertyTypeName } from '@/lib/data'
import { parsePrice } from '@/lib/helpers'

interface MortgageInfoCardProps {
  propertyData: any
  listPrice: number
  listingState: string
  listingCounty: string
  propertyType: string
  propertyLoading: boolean
}
export const MortgageInfoCard = ({
  propertyData,
  listPrice,
  listingState,
  listingCounty,
  propertyType,
  propertyLoading,
}: MortgageInfoCardProps) => {
  return (
    <>
      {propertyLoading ? (
        <MortgageInfoCardSkeleton />
      ) : (
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Mortgage Breakdown</h1>
          {propertyData?.image && (
            <Image
              src={propertyData.image}
              width={propertyData.image ? 500 : 0}
              height={propertyData.image ? 500 : 0}
              alt="home image"
            />
          )}
          <ul>
            {!!listPrice && <li>List Price: ${parsePrice(listPrice)}</li>}
            {propertyData?.address?.street_address && (
              <li>
                Address: {propertyData?.address?.street_address}, {listingState}{' '}
                {propertyData?.address?.zip_code}
              </li>
            )}
            {listingCounty && <li>County: {listingCounty}</li>}
            {propertyType && (
              <li>Property Type: {propertyTypeName[propertyType]}</li>
            )}
            {propertyData?.property_type?.units && (
              <li># of Units: {propertyData?.property_type?.units}</li>
            )}
          </ul>
        </div>
      )}
    </>
  )
}

const MortgageInfoCardSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col gap-2">
      <h1 className="text-xl font-bold">Mortgage Breakdown</h1>
      <div className="mb-2 h-64 w-full animate-pulse bg-gray-300" />
      <div className="flex flex-col gap-2">
        <span className="h-8 w-full bg-gray-300" />
        <span className="flex gap-2">
          <span className="h-8 w-full bg-gray-300" />
          <span className="h-8 w-full bg-gray-300" />
        </span>
        <span className="h-8 w-full bg-gray-300" />
      </div>
    </div>
  )
}
