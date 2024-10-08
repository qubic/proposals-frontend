import { QubicProposalsWhiteLogo } from '@app/assets/icons/logo'
import { Routes } from '@app/router'
import { Link } from 'react-router-dom'
import LanguagePicker from '../LanguagePicker'

export default function Header() {
  return (
    <header className="relative mx-auto flex items-center justify-center gap-6 border-b border-primary-60 p-20">
      <Link to={Routes.HOME}>
        <QubicProposalsWhiteLogo />
      </Link>
      <div className="absolute right-12 flex items-center sm:right-24">
        <LanguagePicker />
      </div>
    </header>
  )
}
