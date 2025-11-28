export default function Section({ children, className, id }) {
  return (
    <section
      id={id}
      className={`min-h-dvh w-full mx-auto container overflow-x-hidden px-4 md:px-6 lg:px-8 py-6 ${className}`}
    >
      {children}
    </section>
  );
}
