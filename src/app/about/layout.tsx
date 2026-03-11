import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О компании ОРЕОН - Авто из Европы",
  description: "ОРЕОН — команда специалистов с опытом в подборе и импорте автомобилей более 13 лет. Честность, прозрачность и профессионализм.",
  openGraph: {
    title: "О компании ОРЕОН - Авто из Европы",
    description: "ОРЕОН — команда специалистов с опытом в подборе и импорте автомобилей более 13 лет. Честность, прозрачность и профессионализм.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
