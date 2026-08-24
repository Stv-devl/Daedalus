import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-semibold">Daedalus</h1>
      <p className="text-neutral-400">
        Plateforme d’agents IA. Aucune feature n’est encore livrée — commence par
        <code className="mx-1 rounded bg-neutral-800 px-1.5 py-0.5">/product</code>
        puis <code className="rounded bg-neutral-800 px-1.5 py-0.5">/spec</code>.
      </p>
    </section>
  );
}
