import { parsePrice, handlePriceChange, getCleanNumber } from '@/lib/helpers'
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
}: Props) => {
  const resetLoanVars = () => {
    setPrimaryLoanAmount('')
    setFHALoanAmount('0')
    setDownPayment('')
    setPrimaryInterestRate(7.547)
    setLoanType('conventional')
  }

  const cleanDownPayment = getCleanNumber(downPayment)
  const cleanHomePrice = getCleanNumber(homePrice)
  const cleanPrimaryLoanAmount = getCleanNumber(primaryLoanAmount)
  const cleanFHALoanAmount = getCleanNumber(FHALoanAmount)
  const minDownPayment =
    cleanHomePrice * (loanType === 'conventional' ? 0.03 : 0.035)
  const houseLoanLimitDiff = cleanHomePrice - (conventionalLoanLimit || 0)

  const downPaymentTooLow = () => {
    if (loanType === 'conventional') {
      return cleanDownPayment / cleanHomePrice < 0.03
    }
    if (loanType === 'fha') {
      return cleanDownPayment / cleanHomePrice < 0.035
    }
  }

  const salesPriceNotMet = () => {
    if (loanType === 'conventional') {
      return cleanDownPayment + cleanPrimaryLoanAmount !== cleanHomePrice
    }
    if (loanType === 'fha') {
      return cleanDownPayment + cleanFHALoanAmount !== cleanHomePrice
    }
  }

  const maximizeLoan = () => {
    if (!homePrice) return
    if (loanType === 'conventional') {
      if (houseLoanLimitDiff > minDownPayment) {
        setPrimaryLoanAmount(
          handlePriceChange((conventionalLoanLimit || 0).toString()),
        )
        setDownPayment(handlePriceChange(houseLoanLimitDiff.toString()))
      }

      if (houseLoanLimitDiff < minDownPayment) {
        setDownPayment(handlePriceChange(minDownPayment.toString()))
        setPrimaryLoanAmount(
          handlePriceChange((cleanHomePrice - cleanDownPayment).toString()),
        )
      }
    }
    if (loanType === 'fha') {
      null
    }
  }

  const adjustLoanValueBasedOnDownPayment = () => {
    if (downPaymentTooLow()) return maximizeLoan()
    if (loanType === 'conventional') {
      const newLoanAmount = cleanHomePrice - cleanDownPayment
      setPrimaryLoanAmount(handlePriceChange(newLoanAmount.toString()))
    }
  }

  const loanOptimized = () => {
    if (loanType === 'conventional') {
      return cleanHomePrice - cleanPrimaryLoanAmount - cleanDownPayment === 0
    }
  }

  const loanMaximized = () => {
    if (loanType === 'conventional') {
      return cleanPrimaryLoanAmount === conventionalLoanLimit
    }
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
          <option value="piggyback">Piggyback</option>
          <option value="jumbo">Jumbo</option>
        </select>
      </span>
      {['conventional', 'piggyback'].includes(loanType) && (
        <>
          {conventionalLoanLimit && (
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
            {!loanMaximized() && (
              <button
                className="border-2 px-2"
                onClick={() => {
                  maximizeLoan()
                }}
              >
                Maximize Loan
              </button>
            )}
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
            <label>FHA Interest Rate</label>
            <input
              value={FHAInterestRate}
              onChange={(e) => setFHAInterestRate(Number(e.target.value))}
            />
            %
          </span>
          <span className="flex gap-2">
            <label>FHA Loan Limit</label>
            <input value={FHALoanLimit && parsePrice(FHALoanLimit)} disabled />
          </span>
        </>
      )}
      {loanType === 'piggyback' && (
        <span className="flex gap-2">
          <label>Piggyback Interest Rate</label>
          <input
            placeholder={piggybackInterestRate.toString()}
            onChange={(e) => setPiggybackInterestRate(Number(e.target.value))}
          />
          %
        </span>
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
        {cleanPrimaryLoanAmount > (conventionalLoanLimit || 0) && (
          <p>* Loan Amount cannot exceed Loan Limit</p>
        )}
      </div>
      {/* <hr className="w-1/2" /> */}
      {/* <p> Primary Loan Amount + Down Payment = Home Price</p>
  {primaryLoanAmount} + {downPayment} = {homePrice} */}
    </div>
  )
}
