import Image from 'next/image'
import { propertyTypeName } from '@/lib/data'

interface MortgageInfoCardProps {
  propertyData: any
  listPrice: number
  listingState: string
  listingCounty: string
  propertyType: string
}
export const MortgageInfoCard = ({
  propertyData,
  listPrice,
  listingState,
  listingCounty,
  propertyType,
}: MortgageInfoCardProps) => {
  return (
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
        {listPrice && <li>List Price: ${listPrice}</li>}
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
  )
}
