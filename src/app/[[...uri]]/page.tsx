import { getApi } from "@/queries/__generated";
import { formatUriArray } from "@/utils/common";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export interface PageProps {
  params: { uri: string[] };
  searchParams: { [key: string]: string };
}

// the entry point for all pages in this path
export default async function Page(props: PageProps) {
  const {
    params: { uri },
  } = props;

  const { page } = await getApi().Page({
    uri: formatUriArray(uri),
  });

  // this is how we throw 404 errors now
  if (!page) notFound();

  const blocks = page.sections?.sections;

  return (
    <div className="template-page">
      {page?.title && <h1>{page?.title}</h1>}
      {blocks?.map((block) => {
        if (block.__typename === "SectionsSectionsHeroLayout") {
          return (
            <div key="SectionsSectionsHeroLayout">
              <h2>HeroLayout</h2>
            </div>
          );
        }

        if (block.__typename === "SectionsSectionsTextImageLayout") {
          return (
            <div key="SectionsSectionsTextImageLayout">
              <h2>TextImageLayout</h2>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// new feature to dynamically generate SEO metadata on the server
export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {
    params: { uri },
  } = props;

  const parentMeta = await parent;

  const { page } = await getApi().Page({
    uri: formatUriArray(uri),
  });
  if (!page || !("title" in page)) notFound();

  return {
    title: [page?.title, parentMeta?.title?.absolute]
      .filter((v) => !!v)
      .join(" — "),
  };
}

// generateStaticParams replaces getStaticPaths
// and returns an array of all valid slugs for this path
export async function generateStaticParams() {
  const api = getApi();
  const { pages } = await api.allPages();
  const uris = pages?.nodes?.map((e) => e?.uri).filter((v) => !!v) || [];

  return uris.map((uri) => {
    return { uri: uri?.split("/").filter((v) => !!v) };
  });
}

// revalidate every minute
export const revalidate = 60;
