// import { StudioView } from "@/modules/studio/ui/view/studio-view";
// import { trpc } from "@/trpc/client";
// import { HydrateClient } from "@/trpc/server";

// const Page = async () => {
//   void trpc.studio.getMany.prefetchInfinite();

//   return (
//     <HydrateClient>
//       <StudioView />
//     </HydrateClient>
//   );
// };

// export default Page;

import { DEFAULT_LIMIT } from "@/constants";
import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { trpc, HydrateClient } from "@/trpc/server";

const Page = async () => {
  // Changed from prefetchInfinite to prefetch since getMany is a regular query
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
