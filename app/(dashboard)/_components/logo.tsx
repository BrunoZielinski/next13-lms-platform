import Image from 'next/image'

export const Logo = () => {
  return <Image priority alt="Logo" width={130} height={130} src="/logo.svg" />
}
