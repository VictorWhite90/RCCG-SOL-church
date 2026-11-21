import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink text-paper">
      <div className="container-x pt-24">
        <p className="eyebrow text-rose">Page not found</p>
        <h1 className="display mt-5 max-w-3xl text-4xl md:text-5xl">
          Even the lost sheep gets <em className="text-rose">found.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/70">We couldn&apos;t find that page, but there&apos;s still a place for you here.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="brand" size="lg" arrow>Go home</ButtonLink>
          <ButtonLink href="/visit" variant="outline-light" size="lg">Plan a visit</ButtonLink>
        </div>
      </div>
    </section>
  );
}
