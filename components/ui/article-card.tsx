import Image from "next/image";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";

export interface ArticleCardProps {
  href: string;
  title: string;
  categoryName: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt?: string;
}

export function ArticleCard({ href, title, categoryName, imageUrl, imageAlt, publishedAt }: ArticleCardProps) {
  return (
    <Card>
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
          <Image src={imageUrl} alt={imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </div>
        <CardBody className="p-6">
          <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-wider text-brand">
            {categoryName}
          </span>
          <h3 className="mb-1 text-[17px] text-ink">{title}</h3>
          {publishedAt && <span className="text-[13px] text-ink-soft">{publishedAt}</span>}
        </CardBody>
      </Link>
    </Card>
  );
}
