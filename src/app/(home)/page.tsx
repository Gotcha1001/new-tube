import { HydrateClient, trpc } from "@/trpc/server";
import MotionWrapperDelay from "../components1/FramerMotion/MotionWrapperDelay";
import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();

  return (
    <div className="">
      <MotionWrapperDelay
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <HydrateClient>
          <HomeView categoryId={categoryId} />
        </HydrateClient>
      </MotionWrapperDelay>
    </div>
  );
};

export default Page;
