import { getApi } from "@/queries/__generated";
import { formatUriArray } from "@/utils/common";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import parse from "@/utils/parse";

export interface PostProps {
  params: { uri: string[] };
  searchParams: { [key: string]: string };
}

// the entry point for all pages in this path
export default async function Post(props: PostProps) {
  const {
    params: { uri },
  } = props;

  const { post } = await getApi().Post({
    uri: formatUriArray(uri),
  });

  // this is how we throw 404 errors now
  if (!post) notFound();

  // const blocks =
  //   page?.template &&
  //   "blocks" in page?.template &&
  //   page?.template?.blocks?.sections;

  return (
    <div className="template-post">
      {post?.title && <h1>{post?.title}</h1>}
      {!!post?.content && <div>{parse(post.content)}</div>}
      {/* {blocks && !!blocks?.length && <Blocks blocks={blocks} />} */}
    </div>
  );
}

// new feature to dynamically generate SEO metadata on the server
export async function generateMetadata(
  props: PostProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {
    params: { uri },
  } = props;

  const parentMeta = await parent;

  const { post } = await getApi().Post({
    uri: formatUriArray(uri),
  });
  if (!post || !("title" in post)) notFound();

  return {
    title: [post?.title, parentMeta?.title?.absolute]
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
