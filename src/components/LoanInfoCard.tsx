import {
  parsePrice,
  handlePriceChange,
  getCleanNumber,
  handleNumberInputChange,
} from '@/lib/helpers'
import { useEffect } from 'react'
interface Props {
  loanType: string
  conventionalLoanLimit: number
  primaryLoanAmount: string
  downPayment: string
  homePrice: string
  FHAInterestRate: number | undefined
  setPrimaryLoanAmount: (value: string) => void
  setFHALoanAmount: (value: string) => void
  setDownPayment: (value: string) => void
  setPrimaryInterestRate: (value: number | undefined) => void
  setLoanType: (value: string) => void
  setConventionalLoanLimit: (value: number) => void
  FHALoanLimit: number
  setFHAInterestRate: (value: number | undefined) => void
  setPiggybackInterestRate: (value: number | undefined) => void
  piggybackInterestRate: number | undefined
  FHALoanAmount: string
  primaryInterestRate: number | undefined
  propertyType: number
  piggyBackLoanAmount: string
  setPiggyBackLoanAmount: (value: string) => void
}

export const LoanInfoCard = ({
  loanType,
  conventionalLoanLimit,
  primaryLoanAmount,
  downPayment,
  primaryInterestRate,
  homePrice,
  setPrimaryLoanAmount,
  setFHALoanAmount,
  setDownPayment,
  setPrimaryInterestRate,
  setLoanType,
  FHAInterestRate,
  FHALoanLimit,
  setFHAInterestRate,
  setPiggybackInterestRate,
  piggybackInterestRate,
  FHALoanAmount,
  setConventionalLoanLimit,
  propertyType,
  piggyBackLoanAmount,
  setPiggyBackLoanAmount,
}: Props) => {
  useEffect(() => {
    resetLoanVars()
  }, [homePrice, propertyType])

  const resetLoanVars = () => {
    setPrimaryLoanAmount('')
    setFHALoanAmount('0')
    setPiggyBackLoanAmount('')
    setDownPayment('')
    setPrimaryInterestRate(7.547)
    if (!['conventional', 'fha'].includes(loanType)) {
      setLoanType('conventional')
    }

    setLoanType('conventional')
  }

  const cleanDownPayment = getCleanNumber(downPayment)
  const cleanHomePrice = getCleanNumber(homePrice)
  const cleanPrimaryLoanAmount = getCleanNumber(primaryLoanAmount)
  const cleanMinDownPayment =
    cleanHomePrice *
    (loanType === 'conventional' ? 0.03 : loanType === 'fha' ? 0.035 : 0.15)
  const loanLimit =
    loanType === 'conventional' || loanType === 'piggyback'
      ? conventionalLoanLimit
      : loanType === 'fha'
      ? FHALoanLimit
      : 0
  const cleanPiggyBackLoanAmount = getCleanNumber(piggyBackLoanAmount)
  const adjustedPrimaryLoan = cleanHomePrice - cleanDownPayment

  const piggyBackImpossible = () => {
    return cleanHomePrice < cleanHomePrice * 0.1 + conventionalLoanLimit
  }

  const jumboImpossible = () => {
    return cleanHomePrice <= conventionalLoanLimit
  }

  const maximizeBorrowing = () => {
    if (cleanHomePrice <= loanLimit) {
      setDownPayment(handlePriceChange(cleanMinDownPayment.toString()))
      setPrimaryLoanAmount(
        handlePriceChange((cleanHomePrice - cleanMinDownPayment).toString()),
      )
      return
    }

    if (loanType === 'jumbo') {
      setDownPayment(handlePriceChange(cleanMinDownPayment.toString()))
      setPrimaryLoanAmount(
        handlePriceChange((cleanHomePrice - cleanMinDownPayment).toString()),
      )
      return
    }

    if (loanType === 'piggyback') {
      const piggyback = cleanHomePrice - loanLimit - cleanHomePrice * 0.1
      setDownPayment(handlePriceChange(cleanMinDownPayment.toString()))
      setPrimaryLoanAmount(handlePriceChange((loanLimit || 0).toString()))
      setPiggyBackLoanAmount(handlePriceChange(piggyback.toString()))
      return
    }

    const loanDiff =
      cleanHomePrice - loanLimit > cleanMinDownPayment
        ? cleanHomePrice - loanLimit
        : cleanMinDownPayment

    setDownPayment(handlePriceChange(loanDiff.toString()))
    setPrimaryLoanAmount(
      handlePriceChange((cleanHomePrice - loanDiff).toString()),
    )
  }

  const optimizeForDownCustomDownPayment = () => {
    if (cleanDownPayment < cleanMinDownPayment) {
      return maximizeBorrowing()
    }

    if (cleanDownPayment > cleanHomePrice) {
      setDownPayment(handlePriceChange(cleanHomePrice.toString()))
      setPrimaryLoanAmount('0')
      setPiggyBackLoanAmount('0')
      return
    }

    if (loanType === 'piggyback') {
      setPrimaryLoanAmount(handlePriceChange(loanLimit.toString()))
      setPiggyBackLoanAmount(
        handlePriceChange(
          (
            cleanHomePrice -
            cleanPrimaryLoanAmount -
            cleanDownPayment
          ).toString(),
        ),
      )
      return
    }

    if (
      cleanHomePrice -
        cleanPrimaryLoanAmount -
        cleanPiggyBackLoanAmount -
        cleanDownPayment >
      0
    ) {
      return maximizeBorrowing()
    }

    if (
      cleanHomePrice -
        cleanPrimaryLoanAmount -
        cleanPiggyBackLoanAmount -
        cleanDownPayment <
      0
    ) {
      setPrimaryLoanAmount(
        handlePriceChange(
          (adjustedPrimaryLoan > loanLimit
            ? loanLimit
            : adjustedPrimaryLoan
          ).toString(),
        ),
      )
      setPiggyBackLoanAmount('0')
      return
    }

    setPrimaryLoanAmount(
      handlePriceChange(
        (adjustedPrimaryLoan > loanLimit
          ? loanLimit
          : adjustedPrimaryLoan
        ).toString(),
      ),
    )
  }

  const downPaymentTooLow = () => {
    if (loanType === 'conventional') {
      return cleanDownPayment / cleanHomePrice < 0.03
    }
    if (loanType === 'fha') {
      return cleanDownPayment / cleanHomePrice < 0.035
    }
  }

  const salesPriceNotMet = () => {
    return (
      cleanDownPayment + cleanPrimaryLoanAmount + cleanPiggyBackLoanAmount !==
      cleanHomePrice
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="flex gap-2">
        <p className="text-2xl font-bold">Loan Info</p>
        <button
          className="border-2 px-2 w-fit h-fit mt-1"
          onClick={() => {
            resetLoanVars()
          }}
        >
          Reset
        </button>
        <button
          className="border-2 px-2 mt-1"
          onClick={() => {
            maximizeBorrowing()
          }}
        >
          Maximize Borrowing
        </button>
        <button
          className="border-2 px-2 mt-1"
          onClick={() => {
            optimizeForDownCustomDownPayment()
          }}
        >
          Adjust to Custom Down Payment
        </button>
      </span>
      <span className="flex gap-2">
        <label htmlFor="loanType">Loan Type</label>
        <select
          onChange={(e) => setLoanType(e.target.value)}
          id="loanType"
          value={loanType}
        >
          <option value="conventional">Conventional 30-Year</option>
          <option value="fha">FHA</option>
          <option value="piggyback" disabled={piggyBackImpossible()}>
            Piggyback{' '}
            {propertyType !== 1 && '* Usually Not Possible on Multifamily *'}
          </option>
          <option
            value={`jumbo`}
            disabled={jumboImpossible() || propertyType !== 1}
          >
            Jumbo{' '}
            {propertyType !== 1 && '* Usually Not Possible on Multifamily *'}
          </option>
        </select>
      </span>
      {['conventional', 'piggyback', 'jumbo'].includes(loanType) && (
        <>
          {loanType !== 'jumbo' && conventionalLoanLimit && (
            <span className="flex gap-2">
              <label htmlFor="conventionalLoanLimit">
                Conventional Loan Limit
              </label>
              $
              <input
                id="conventionalLoanLimit"
                value={parsePrice(conventionalLoanLimit)}
                disabled
              />
            </span>
          )}
          <span className="flex gap-2">
            <label htmlFor="primaryLoanAmount">Primary Loan Amount</label>
            $
            <input
              id="primaryLoanAmount"
              value={primaryLoanAmount}
              onChange={(e) => {
                setPrimaryLoanAmount(handlePriceChange(e.target.value))
              }}
            />
          </span>
          <span className="flex gap-2">
            <label htmlFor="primaryInterestRate">Primary Interest Rate</label>
            <input
              id="primaryInterestRate"
              type="number"
              step="0.01"
              value={primaryInterestRate || ''}
              onChange={(e) => {
                setPrimaryInterestRate(handleNumberInputChange(e))
              }}
            />
            %
          </span>
        </>
      )}
      {loanType === 'fha' && (
        <>
          <span className="flex gap-2">
            <label>FHA Loan Limit</label>
            <input value={FHALoanLimit && parsePrice(FHALoanLimit)} disabled />
          </span>
          <span className="flex gap-2">
            <label htmlFor="primaryLoanAmount">Primary Loan Amount</label>
            $
            <input
              id="primaryLoanAmount"
              value={primaryLoanAmount}
              onChange={(e) => {
                setPrimaryLoanAmount(handlePriceChange(e.target.value))
              }}
            />
          </span>
          <span className="flex gap-2">
            <label htmlFor="fhaInterestRate">FHA Interest Rate</label>
            <input
              id="fhaInterestRate"
              type="number"
              step="0.01"
              value={FHAInterestRate || ''}
              onChange={(e) => {
                setFHAInterestRate(handleNumberInputChange(e))
              }}
            />
            %
          </span>
        </>
      )}
      {loanType === 'piggyback' && (
        <>
          <span className="flex gap-2">
            <label>Piggyback Loan Amount</label>
            $
            <input
              value={piggyBackLoanAmount}
              onChange={(e) =>
                setPiggyBackLoanAmount(handlePriceChange(e.target.value))
              }
            />
            <p>
              {(
                (getCleanNumber(piggyBackLoanAmount) /
                  getCleanNumber(homePrice)) *
                100
              ).toFixed(2)}
              % of Home Price
            </p>
          </span>
          <span className="flex gap-2">
            <label htmlFor="piggybackInterestRate">
              Piggyback Interest Rate
            </label>
            <input
              id="piggybackInterestRate"
              type="number"
              step="0.01"
              value={piggybackInterestRate || ''}
              onChange={(e) => {
                setPiggybackInterestRate(handleNumberInputChange(e))
              }}
            />
            %
          </span>
        </>
      )}
      <span className="flex gap-2">
        <label htmlFor="downPayment">Down Payment</label>
        $
        <input
          id="downPayment"
          onChange={(e) => setDownPayment(handlePriceChange(e.target.value))}
          value={downPayment}
        />
        {homePrice && downPayment && (
          <p>
            {(
              (getCleanNumber(downPayment) / getCleanNumber(homePrice)) *
              100
            ).toFixed(2)}
            % of Home Price
          </p>
        )}
      </span>
      <div className="flex flex-col">
        {(!downPayment || downPaymentTooLow()) && (
          <p>
            * Minimum Down Payment is $
            {loanType === 'fha'
              ? '3.5%'
              : loanType === 'conventional' || loanType === 'jumbo'
              ? '3%'
              : '10%'}
          </p>
        )}
        {salesPriceNotMet() && <p>* Loan Amount + Down Payment ≠ Home Price</p>}
        {cleanPrimaryLoanAmount > (conventionalLoanLimit || 0) &&
          loanType !== 'jumbo' && <p>* Loan Amount cannot exceed Loan Limit</p>}
      </div>
    </div>
  )
}
