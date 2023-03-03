import { parsePrice, handlePriceChange, getCleanNumber } from '@/lib/helpers'
import { useEffect } from 'react'
interface Props {
  loanType: string
  conventionalLoanLimit: number | undefined
  primaryLoanAmount: string
  downPayment: string
  homePrice: string
  FHAInterestRate: number
  setPrimaryLoanAmount: (value: string) => void
  setFHALoanAmount: (value: string) => void
  setDownPayment: (value: string) => void
  setPrimaryInterestRate: (value: number) => void
  setLoanType: (value: string) => void
  setConventionalLoanLimit: (value: number | undefined) => void
  FHALoanLimit: number | undefined
  setFHAInterestRate: (value: number) => void
  setPiggybackInterestRate: (value: number) => void
  piggybackInterestRate: number
  FHALoanAmount: string
  primaryInterestRate: number
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
  }, [homePrice, propertyType, loanType])

  // useEffect(() => {
  //   maximizeLoan()
  // }, [loanType])

  const resetLoanVars = () => {
    setPrimaryLoanAmount('')
    setFHALoanAmount('0')
    setPiggyBackLoanAmount('')
    setDownPayment('')
    setPrimaryInterestRate(7.547)
    // setLoanType('conventional')
  }

  const cleanDownPayment = getCleanNumber(downPayment)
  const cleanHomePrice = getCleanNumber(homePrice)
  const cleanPrimaryLoanAmount = getCleanNumber(primaryLoanAmount)
  const cleanFHALoanAmount = getCleanNumber(FHALoanAmount)
  const cleanMinDownPayment =
    cleanHomePrice *
    (loanType === 'conventional' ? 0.03 : loanType === 'fha' ? 0.035 : 0.1)
  const loanLimit =
    loanType === 'conventional' || loanType === 'piggyback'
      ? conventionalLoanLimit
      : loanType === 'fha'
      ? FHALoanLimit
      : 0
  const houseLoanLimitDiff = cleanHomePrice - (loanLimit || 0)
  const cleanPiggyBackLoanAmount = getCleanNumber(piggyBackLoanAmount)

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

    if (cleanHomePrice < loanLimit) {
      return console.log('affordable house you got there')
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
    }

    console.log('hi')
    setDownPayment(
      handlePriceChange(
        (cleanHomePrice > loanLimit
          ? cleanHomePrice - loanLimit
          : cleanMinDownPayment
        )
          .toFixed()
          .toString(),
      ),
    )
    setPrimaryLoanAmount(
      handlePriceChange(
        (cleanHomePrice > loanLimit
          ? loanLimit
          : loanLimit - cleanHomePrice
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

  const maximizeLoan = () => {
    if (!homePrice) return

    if (loanType === 'piggyback') {
      setPrimaryLoanAmount(handlePriceChange((loanLimit || 0).toString()))
      setDownPayment(handlePriceChange((cleanHomePrice * 0.1).toString()))
      return
    }

    if (cleanHomePrice < loanLimit) {
      console.log('1')
      setPrimaryLoanAmount(
        handlePriceChange((cleanHomePrice - cleanMinDownPayment).toString()),
      )
      setDownPayment(
        handlePriceChange(cleanMinDownPayment.toFixed().toString()),
      )
      return
    }

    if (houseLoanLimitDiff > cleanMinDownPayment) {
      console.log('2', houseLoanLimitDiff, cleanMinDownPayment)
      setPrimaryLoanAmount(handlePriceChange((loanLimit || 0).toString()))
      setDownPayment(handlePriceChange(houseLoanLimitDiff.toString()))
      return
    }

    if (houseLoanLimitDiff < cleanMinDownPayment) {
      console.log('3')
      setDownPayment(handlePriceChange(cleanMinDownPayment.toString()))
      setPrimaryLoanAmount(
        handlePriceChange((cleanHomePrice - cleanDownPayment).toString()),
      )
      return
    }
  }

  const adjustLoanValueBasedOnDownPayment = () => {
    if (loanType === 'piggyback') {
      console.log('here2')
      setDownPayment(handlePriceChange((cleanHomePrice * 0.1).toString()))
      setPiggyBackLoanAmount(
        handlePriceChange(
          (cleanHomePrice - cleanDownPayment - loanLimit).toString(),
        ),
      )
      return
    }

    if (downPaymentTooLow()) return maximizeLoan()
    const newLoanAmount = cleanHomePrice - cleanDownPayment

    setPrimaryLoanAmount(handlePriceChange(newLoanAmount.toString()))
  }

  const loanOptimized = () => {
    return (
      cleanHomePrice -
        cleanPrimaryLoanAmount -
        cleanDownPayment -
        cleanPiggyBackLoanAmount ===
      0
    )
  }

  const loanMaximized = () => {
    return (
      cleanPrimaryLoanAmount === loanLimit ||
      cleanHomePrice - cleanMinDownPayment === cleanPrimaryLoanAmount
    )
  }

  const optimizeDownPayment = () => {
    console.log('here0')
    const optimizeDownPayment = cleanHomePrice - cleanPrimaryLoanAmount

    if (
      optimizeDownPayment < cleanMinDownPayment ||
      cleanHomePrice > cleanPrimaryLoanAmount ||
      cleanPrimaryLoanAmount > loanLimit
    ) {
      console.log('here')
      maximizeLoan()
      return
    }

    setDownPayment(handlePriceChange(optimizeDownPayment.toString()))
  }

  const downPaymentOptimized = () => {
    return (
      cleanDownPayment >= Math.floor(cleanMinDownPayment) && loanOptimized()
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
        <button className="border-2 px-2 mt-1" onClick={() => {}}>
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
            Piggyback
          </option>
          <option value="jumbo" disabled={jumboImpossible()}>
            Jumbo
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
              value={primaryInterestRate}
              onChange={(e) => setPrimaryInterestRate(Number(e.target.value))}
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
            <label>FHA Interest Rate</label>
            <input
              value={FHAInterestRate}
              onChange={(e) => setFHAInterestRate(Number(e.target.value))}
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
              // placeholder={piggybackInterestRate.toString()}
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
            <label>Piggyback Interest Rate</label>
            <input
              placeholder={piggybackInterestRate.toString()}
              onChange={(e) => setPiggybackInterestRate(Number(e.target.value))}
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
        {homePrice && primaryLoanAmount && !loanOptimized() && (
          <button
            className="border-2 px-2"
            onClick={() => {
              adjustLoanValueBasedOnDownPayment()
            }}
          >
            Optimize For Down Payment
          </button>
        )}
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

      {/* <hr className="w-1/2" /> */}
      {/* <p> Primary Loan Amount + Down Payment = Home Price</p>
  {primaryLoanAmount} + {downPayment} = {homePrice} */}
    </div>
  )
}
