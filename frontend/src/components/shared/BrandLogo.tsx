import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  priority?: boolean;
  className?: string;
};

export function BrandLogo({ size = 56, priority = false, className = "" }: BrandLogoProps) {
  return (
    <Image
      src="/images/igreja-da-cidade-logo.webp"
      alt="Logótipo da Igreja da Cidade Luanda"
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
