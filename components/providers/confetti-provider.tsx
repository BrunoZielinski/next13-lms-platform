'use client'

import ReactConfetti from 'react-confetti'

import { useConfettiStore } from '@/hooks/use-confetti-store'

export const ConfettiProvider = () => {
  const { isOpen, onClose } = useConfettiStore()

  if (!isOpen) return null

  return (
    <ReactConfetti
      recycle={false}
      numberOfPieces={500}
      onConfettiComplete={onClose}
      className="z-[100] pointer-events-none w-full"
    />
  )
}
