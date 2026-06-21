'use client'

export default function JournalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-[calc(100vh-49px)] items-center justify-center">
      <div className="glass rounded-2xl p-8 w-full max-w-md text-center space-y-4">
        <div className="text-4xl">&#x26A0;&#xFE0F;</div>
        <h2 className="text-lg font-semibold text-[#f1f5f9]">Couldn&apos;t load journal</h2>
        <p className="text-sm text-[#94a3b8]">
          {error.message || 'A server error occurred.'}
        </p>
        <button
          onClick={reset}
          className="glass rounded-lg px-4 py-2 text-sm font-semibold text-[#f1f5f9] hover:bg-white/5 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
