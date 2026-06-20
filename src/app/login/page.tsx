import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'

function SignInButton({
  provider,
  label,
  color,
}: {
  provider: string
  label: string
  color: string
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn(provider, { redirectTo: '/' })
      }}
    >
      <button
        type="submit"
        className={`w-full px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${color} border border-white/5 hover:scale-[1.02] active:scale-[0.98]`}
      >
        {label}
      </button>
    </form>
  )
}

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <main className="min-h-[calc(100vh-57px)] flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-[#f1f5f9]">
            <span className="text-[#14f5c7]">Raw</span>FX
          </h1>
          <p className="text-sm text-[#94a3b8]">Sign in to access your journal</p>
        </div>

        <div className="space-y-3">
          <SignInButton
            provider="google"
            label="Continue with Google"
            color="bg-white/5 text-[#f1f5f9] hover:bg-white/10"
          />
          <SignInButton
            provider="github"
            label="Continue with GitHub"
            color="bg-white/5 text-[#f1f5f9] hover:bg-white/10"
          />
        </div>

        <p className="text-xs text-center text-[#475569]">
          Your data stays private. We only use your email and profile photo.
        </p>
      </div>
    </main>
  )
}
