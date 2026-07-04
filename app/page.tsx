import { getPosts } from "@/actions/post.action";
import { getUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import RandomUsers from "@/components/RandomUsers";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser()
  const posts = await getPosts()
  const userId = await getUserId()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 px-3">
      <div className="col-span-6">
        {/* create post section */}
        {user && <CreatePost />}

        {/* posts */}
        <div className="space-y-5 mt-7">
          {posts.length > 0 && posts.map((post) => {
            return <PostCard key={post.id} post={post} dbUserId={userId ?? null} />
          })}
        </div>


      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <RandomUsers />
      </div>
    </div>
  );
}
