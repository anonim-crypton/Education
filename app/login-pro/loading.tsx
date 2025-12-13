export default function LoginProLoading() {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-primary rounded-full" />
      </div>
    </div>
  )
}
