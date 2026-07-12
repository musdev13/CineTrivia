import { Outlet } from "react-router"

export function BaseLayout() {
    return  (
        <div className="min-h-screen flex flex-col items-center justify-between p-6 max-w-4xl mx-auto space-y-8">
            {/* Шапка */}
            <header className="text-center mt-8 space-y-2">
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent text-glow-primary uppercase animate-pulse">
                CineTrivia
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                Перевір свої знання кіно за допомогою постерів, акторів та кадрів!
                </p>
            </header>

            {/* Головний контент */}
            <main className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Outlet />
            </main>
            <footer className="text-center text-muted-foreground text-[10px] pb-4">
                CineTrivia &copy; {new Date().getFullYear()}. Дані отримано за допомогою
                TMDB API.
            </footer>
        </div>)
}