import { QubicProposalsWhiteLogo } from '@app/assets/icons/logo'
import { PublicRoutes } from '@app/router'
import { Link } from 'react-router-dom'
import LanguagePicker from '../LanguagePicker'
import { ConnectWalletButton } from '../buttons'

export default function Header() {
  return (
    <header className="relative mx-auto flex h-[var(--header-height)] items-center justify-center gap-6 border-b border-primary-60 p-20 sm:h-[var(--desktop-header-height)]">
      <Link to={PublicRoutes.HOME}>
        <QubicProposalsWhiteLogo />
      </Link>
      {/* Mobile ConnectWalletButton */}
      <div className="absolute left-12 lg:hidden">
        <ConnectWalletButton variant="text" showIcon labelClassName="hidden" />
      </div>
      <div className="absolute right-12 flex items-center gap-8 sm:right-24">
        {/* Desktop ConnectWalletButton */}
        <ConnectWalletButton
          className="hidden p-10 lg:flex"
          variant="text"
          showIcon
          labelClassName="text-gray-50 md:block"
        />
        <LanguagePicker />
      </div>
    </header>
  )
}
