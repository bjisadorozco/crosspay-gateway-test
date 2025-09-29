interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
    </div>
  )
}
