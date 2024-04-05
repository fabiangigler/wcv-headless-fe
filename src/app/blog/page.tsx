import { getApi } from "@/queries/__generated";
import { formatUriArray } from "@/utils/common";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import parse from "@/utils/parse";
import Link from "@/components/link";

export interface PostProps {
  params: { uri: string[] };
  searchParams: { [key: string]: string };
}

// the entry point for all pages in this path
export default async function Page(props: PostProps) {
  const {
    params: { uri },
  } = props;

  const { posts } = await getApi().allPosts();

  return (
    <div className="template-blog">
      <h1>Blog</h1>

      <div className="grid grid-cols-3 gap-24">
        {!!posts?.nodes?.length &&
          posts.nodes.map((post) => (
            <article
              key={post.title}
              className="border-white border px-16 py-24"
            >
              <h2>{post.title}</h2>
              {!!post?.excerpt && <div>{parse(post.excerpt)}</div>}
              {!!post?.uri && <Link href={post.uri}>Read more</Link>}
            </article>
          ))}
      </div>
    </div>
  );
}

// new feature to dynamically generate SEO metadata on the server
export async function generateMetadata(
  props: PostProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMeta = await parent;

  return {
    title: ["Blog", parentMeta?.title?.absolute].filter((v) => !!v).join(" — "),
  };
}

// revalidate every minute
export const revalidate = 60;
