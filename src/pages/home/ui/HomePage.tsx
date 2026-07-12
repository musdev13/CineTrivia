export const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 text-zinc-900">
      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-8 shadow-xs text-center">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full border border-emerald-200/50 mb-4">FSD Architecture</span>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">CineTrivia</h1>
        <p className="mt-3 text-sm text-zinc-500">Проект успішно ініціалізовано без App.tsx з React Router (Data Mode) за FSD архітектурою!</p>
        <div className="mt-6 grid grid-cols-2 gap-2.5 text-left text-xs font-medium text-zinc-600">
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
            <span className="font-bold text-zinc-900 block mb-0.5">📁 app/</span>
            main.tsx, route.tsx, index.css
          </div>
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
            <span className="font-bold text-zinc-900 block mb-0.5">📁 pages/</span>
            Сторінки додатку
          </div>
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
            <span className="font-bold text-zinc-900 block mb-0.5">📁 features/</span>
            Фічі додатку
          </div>
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
            <span className="font-bold text-zinc-900 block mb-0.5">📁 shared/</span>
            ui, api, hooks, lib
          </div>
        </div>
      </div>
    </div>
  )
}
