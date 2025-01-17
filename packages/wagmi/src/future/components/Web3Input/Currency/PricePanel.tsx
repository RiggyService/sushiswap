import { Price, Type, tryParseAmount } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { FC, useMemo } from 'react'
import { CurrencyInputProps } from './CurrencyInput'
import { ZERO } from '@sushiswap/math'

type PricePanel = Pick<CurrencyInputProps, 'loading' | 'currency' | 'value' | 'usdPctChange'> & {
  error?: string
  price: Price<Type, Type> | undefined
}

export const PricePanel: FC<PricePanel> = ({ loading, price, currency, value, usdPctChange, error }) => {
  const parsedValue = useMemo(() => tryParseAmount(value, currency), [currency, value])

  const [big, portion] = (parsedValue && price ? `${price.quote(parsedValue).toFixed(2)}` : '0.00').split(
    '.'
  )

  if (loading)
    return (
      <div className="w-1/5 flex items-center">
        <Skeleton.Text fontSize="text-lg" className="w-full" />
      </div>
    )

  if (error) {
    return <p className="font-medium text-lg py-1 select-none text-red">{error}</p>
  }

  return (
    <p className="font-medium text-lg flex items-baseline select-none text-gray-500 dark:text-slate-400">
      {!loading && price?.equalTo(ZERO) ? (
        <span className="text-sm flex items-center">Price not available</span>
      ) : (
        <>
          $ {big}.<span className="text-sm font-semibold">{portion}</span>
        </>
      )}
      {!(!loading && price?.equalTo(ZERO)) && usdPctChange && usdPctChange !== 0 ? (
        <span
          className={classNames(
            'text-sm pl-1',
            usdPctChange > 0
              ? 'text-green'
              : usdPctChange < -5
              ? 'text-red'
              : usdPctChange < -3
              ? 'text-yellow'
              : 'text-slate-500'
          )}
        >
          {' '}
          {`${usdPctChange?.toFixed(2) === '0.00' ? '' : usdPctChange > 0 ? '(+' : '('}${
            usdPctChange?.toFixed(2) === '0.00' ? '' : `${usdPctChange?.toFixed(2)}%)`
          }`}
        </span>
      ) : null}
    </p>
  )
}
