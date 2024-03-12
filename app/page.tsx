import Einstein from "@/components/einstein";

export default function Home() {
  return (
    <main className="flex flex-col h-full space-y-4">
      <div className="md:grid md:grid-cols-1 gap-4">
        <Einstein />
      </div>
    </main>
  );
}
