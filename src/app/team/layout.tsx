import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Наша команда - ОРЕОН",
  description: "Команда профессионалов ОРЕОН. 13 специалистов по подбору и доставке автомобилей из Европы. Опыт работы более 13 лет.",
  openGraph: {
    title: "Наша команда - ОРЕОН",
    description: "Команда профессионалов ОРЕОН. 13 специалистов по подбору и доставке автомобилей из Европы. Опыт работы более 13 лет.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
