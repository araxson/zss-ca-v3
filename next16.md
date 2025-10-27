[p] Tuesday, October 21st 2025
[h1] Next.js 16
[p] Ahead of our upcoming  Next.js Conf 2025   , Next.js 16 is now available.
[p] This release provides the latest improvements to Turbopack, caching, and the Next.js architecture. Since the previous beta release, we added several new features and improvements:
[li] Cache Components: New model using Partial Pre-Rendering (PPR) and use cache for instant navigation.
[li] Next.js Devtools MCP: Model Context Protocol integration for improved debugging and workflow.
[li] Proxy: Middleware replaced by  proxy.ts to clarify network boundary.
[li] DX: Improved logging for builds and development requests.
[p] For reminder, those features were available since the previous beta release:
[li] Turbopack (stable): Default bundler for all apps with up to 5-10x faster Fast Refresh, and 2-5x faster builds
[li] Turbopack File System Caching (beta): Even faster startup and compile times for the largest apps
[li] React Compiler Support (stable): Built-in integration for automatic memoization
[li] Build Adapters API (alpha): Create custom adapters to modify the build process
[li] Enhanced Routing: Optimized navigations and prefetching with layout deduplication and incremental prefetching
[li] Improved Caching APIs: New  updateTag() and refined  revalidateTag()
[li] React 19.2: View Transitions,  useEffectEvent(),  <Activity/>
[li] Breaking Changes: Async params,  next/image defaults, and more
[p] Upgrade to Next.js 16:
[p] For cases where the codemod can't fully migrate your code, please read the  upgrade guide.
[h2] New Features and Improvements
[h3] Cache Components
[p] Cache Components are a new set of features designed to make caching in Next.js both more explicit, and more flexible. They center around the new  "use cache" directive, which can be used to cache pages, components, and functions, and which leverages the compiler to automatically generate cache keys wherever it’s used.
[p] Unlike the implicit caching found in previous versions of the App Router, caching with Cache Components is entirely opt-in. All dynamic code in any page, layout, or API route is executed at request time by default, giving Next.js an out-of-the-box experience that’s better aligned with what developers expect from a full-stack application framework.
[p] Cache Components also complete the story of Partial Prerendering (PPR), which was first introduced in 2023. Prior to PPR, Next.js had to choose whether to render each URL statically or dynamically; there was no middle ground. PPR eliminated this dichotomy, and let developers opt portions of their static pages into dynamic rendering (via Suspense) without sacrificing the fast initial load of fully static pages.
[p] You can enable Cache Components in your  next.config.ts file:
[p] We will be sharing more about Cache Components and how to use them at  Next.js Conf 2025    on October 22nd, and we will be sharing more content in our blog and documentation in the coming weeks.
[p] Note: as previously announced in the beta release, the previous experimental  experimental.ppr flag and configuration options have been removed in favor of the Cache Components configuration.
[p] Learn more in the documentation  here.
[h3] Next.js Devtools MCP
[p] Next.js 16 introduces  Next.js DevTools MCP, a Model Context Protocol integration for AI-assisted debugging with contextual insight into your application.
[p] The Next.js DevTools MCP provides AI agents with:
[li] Next.js knowledge: Routing, caching, and rendering behavior
[li] Unified logs: Browser and server logs without switching contexts
[li] Automatic error access: Detailed stack traces without manual copying
[li] Page awareness: Contextual understanding of the active route
[p] This enables AI agents to diagnose issues, explain behavior, and suggest fixes directly within your development workflow.
[p] Learn more in the documentation  here.
[h3] proxy.ts (formerly  middleware.ts)
[p] proxy.ts replaces  middleware.ts and makes the app’s network boundary explicit.  proxy.ts runs on the Node.js runtime.
[li] What to do: Rename  middleware.ts →  proxy.ts and rename the exported function to  proxy. Logic stays the same.
[li] Why: Clearer naming and a single, predictable runtime for request interception.
[p] Note: The  middleware.ts file is still available for Edge runtime use cases, but it is deprecated and will be removed in a future version.
[p] Learn more in the documentation  here.
[h3] Logging Improvements
[p] In Next.js 16 the development request logs are extended showing where time is spent.
[li] Compile: Routing and compilation
[li] Render: Running your code and React rendering
[p] The build is also extended to show where time is spent. Each step in the build process is now shown with the time it took to complete.
[p] The following features were  previously announced in the beta release:
[h3] Developer Experience
[h4] Turbopack (stable)
[p] Turbopack has reached stability for both development and production builds, and is now the default bundler for all new Next.js projects. Since its beta release earlier this summer, adoption has scaled rapidly: more than 50% of development sessions and 20% of production builds on Next.js 15.3+ are already running on Turbopack.
[p] With Turbopack, you can expect:
[li] 2–5× faster production builds
[li] Up to 10× faster Fast Refresh
[p] We're making Turbopack the default to bring these performance gains to every Next.js developer, no configuration required. For apps with custom webpack setups, you can continue using webpack by running:
[h4] Turbopack File System Caching (beta)
[p] Turbopack now supports filesystem caching in development, storing compiler artifacts on disk between runs for significantly faster compile times across restarts, especially in large projects.
[p] Enable filesystem caching in your configuration:
[p] All internal Vercel apps are already using this feature, and we’ve seen notable improvements in developer productivity across large repositories.
[p] We’d love to hear your feedback as we iterate on filesystem caching. Please try it out and share your experience.
[h4] Simplified  create-next-app
[p] create-next-app has been redesigned with a simplified setup flow, updated project structure, and improved defaults. The new template includes the App Router by default, TypeScript-first configuration, Tailwind CSS, and ESLint.
[h4] Build Adapters API (alpha)
[p] Following the  Build Adapters RFC   , we've worked with the community and deployment platforms to deliver the first alpha version of the Build Adapters API.
[p] Build Adapters allow you to create custom adapters that hook into the build process, enabling deployment platforms and custom build integrations to modify Next.js configuration or process build output.
[p] Share your feedback in the  RFC discussion   .
[h4] React Compiler Support (stable)
[p] Built-in support for the React Compiler is now stable in Next.js 16 following the React Compiler's 1.0 release. The React Compiler automatically memoizes components, reducing unnecessary re-renders with zero manual code changes.
[p] The  reactCompiler configuration option has been promoted from  experimental to stable. It is not enabled by default as we continue gathering build performance data across different application types. Expect compile times in development and during builds to be higher when enabling this option as the React Compiler relies on Babel.
[p] Install the latest version of the React Compiler plugin:
[h3] Core Features & Architecture
[h4] Enhanced Routing and Navigation
[p] Next.js 16 includes a complete overhaul of the routing and navigation system,
making page transitions leaner and faster.
[p] Layout deduplication: When prefetching multiple URLs with a shared layout, the layout is downloaded once instead of separately for each Link. For example, a page with 50 product links now downloads the shared layout once instead of 50 times, dramatically reducing the network transfer size.
[p] Incremental prefetching: Next.js only prefetches parts not already in cache, rather than entire pages. The prefetch cache now:
[li] Cancels requests when the link leaves the viewport
[li] Prioritizes link prefetching on hover or when re-entering the viewport
[li] Re-prefetches links when their data is invalidated
[li] Works seamlessly with upcoming features like Cache Components
[p] Trade-off: You may see more individual prefetch requests, but with much lower total transfer sizes. We believe this is the right trade-off for nearly all applications. If the increased request count causes issues, please let us know. We're working on additional optimizations to inline data chunks more efficiently.
[p] These changes require no code modifications and are designed to improve performance across all apps.
[h4] Improved Caching APIs
[p] Next.js 16 introduces refined caching APIs for more explicit control over cache behavior.
[p] revalidateTag() now requires a    cacheLife profile    as the second argument to enable stale-while-revalidate (SWR) behavior:
[p] The profile argument accepts built-in  cacheLife profile names (like  'max',  'hours',  'days') or  custom profiles    defined in your  next.config. You can also pass an inline  { expire: number } object. We recommend using  'max' for most cases, as it enables background revalidation for long-lived content. When users request tagged content, they receive cached data immediately while Next.js revalidates in the background.
[p] Use  revalidateTag() when you want to invalidate only properly tagged cached entries with stale-while-revalidate behavior. This is ideal for static content that can tolerate eventual consistency.
[p] Migration guidance: Add the second argument with a  cacheLife profile (we recommend  'max') for SWR behavior, or use  updateTag() in Server Actions if you need read-your-writes semantics.
[p] updateTag() is a new Server Actions-only API that provides  read-your-writes semantics, expiring and immediately reading fresh data within the same request:
[p] This ensures interactive features reflect changes immediately. Perfect for forms, user settings, and any workflow where users expect to see their updates instantly.
[p] refresh() is a new Server Actions-only API for refreshing  uncached data only. It doesn't touch the cache at all:
[p] This API is complementary to the client-side  router.refresh(). Use it when you need to refresh uncached data displayed elsewhere on the page after performing an action. Your cached page shells and static content remain fast while dynamic data like notification counts, live metrics, or status indicators refresh.
[h4] React 19.2 and Canary Features
[p] The App Router in Next.js 16 uses the latest React  Canary release   , which includes the newly released React 19.2 features and other features being incrementally stabilized. Highlights include:
[li] View Transitions   : Animate elements that update inside a Transition or navigation
[li] useEffectEvent   : Extract non-reactive logic from Effects into reusable Effect Event functions
[li] Activity   : Render "background activity" by hiding UI with  display: none while maintaining state and cleaning up Effects
[p] Learn more in the  React 19.2 announcement   .
[h3] Breaking Changes and Other Updates
[h4] Version Requirements
[th] Change
[th] Details
[td] Node.js 20.9+
[td] Minimum version now 20.9.0 (LTS); Node.js 18 no longer supported
[td] TypeScript 5+
[td] Minimum version now 5.1.0
[td] Browsers
[td] Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+
[h4] Removals
[p] These features were previously deprecated and are now removed:
[th] Removed
[th] Replacement
[td] AMP support
[td] All AMP APIs and configs removed ( useAmp,  export const config = { amp: true })
[td] next lint command
[td] Use Biome or ESLint directly;  next build no longer runs linting. A codemod is available:  npx @next/codemod@canary next-lint-to-eslint-cli .
[td] devIndicators options
[td] appIsrStatus,  buildActivity,  buildActivityPosition removed from config. The indicator remains.
[td] serverRuntimeConfig,  publicRuntimeConfig
[td] Use environment variables ( .env files)
[td] experimental.turbopack location
[td] Config moved to top-level  turbopack (no longer in  experimental)
[td] experimental.dynamicIO flag
[td] Renamed to  cacheComponents
[td] experimental.ppr flag
[td] PPR flag removed; evolving into Cache Components programming model
[td] export const experimental_ppr
[td] Route-level PPR export removed; evolving into Cache Components programming model
[td] Automatic  scroll-behavior: smooth
[td] Add  data-scroll-behavior="smooth" to HTML document to opt back in
[td] unstable_rootParams()
[td] We are working on an alternative API that we will ship in an upcoming minor
[td] Sync  params,  searchParams props access
[td] Must use async:  await params,  await searchParams
[td] Sync  cookies(),  headers(),  draftMode() access
[td] Must use async:  await cookies(),  await headers(),  await draftMode()
[td] Metadata image route  params argument
[td] Changed to async  params;  id from  generateImageMetadata now  Promise<string>
[td] next/image local src with query strings
[td] Now requires  images.localPatterns config to prevent enumeration attacks
[h4] Behavior Changes
[p] These features have new default behaviors in Next.js 16:
[th] Changed Behavior
[th] Details
[td] Default bundler
[td] Turbopack is now the default bundler for all apps; opt out with  next build --webpack
[td] images.minimumCacheTTL default
[td] Changed from 60s to 4 hours (14400s); reduces revalidation cost for images without cache-control headers
[td] images.imageSizes default
[td] Removed  16 from default sizes (used by only 4.2% of projects); reduces srcset size and API variations
[td] images.qualities default
[td] Changed from  [1..100] to  [75];  quality prop is now coerced to closest value in  images.qualities
[td] images.dangerouslyAllowLocalIP
[td] New security restriction blocks local IP optimization by default; set to  true for private networks only
[td] images.maximumRedirects default
[td] Changed from unlimited to 3 redirects maximum; set to  0 to disable or increase for rare edge cases
[td] @next/eslint-plugin-next default
[td] Now defaults to ESLint Flat Config format, aligning with ESLint v10 which will drop legacy config support
[td] Prefetch cache behavior
[td] Complete rewrite with layout deduplication and incremental prefetching
[td] revalidateTag() signature
[td] Now requires  cacheLife profile as second argument for stale-while-revalidate behavior
[td] Babel configuration in Turbopack
[td] Automatically enables Babel if a babel config is found (previously exited with hard error)
[td] Terminal output
[td] Redesigned with clearer formatting, better error messages, and improved performance metrics
[td] Dev and build output directories
[td] next dev and  next build now use separate output directories, enabling concurrent execution
[td] Lockfile behavior
[td] Added lockfile mechanism to prevent multiple  next dev or  next build instances on the same project
[td] Parallel routes  default.js
[td] All parallel route slots now require explicit  default.js files; builds fail without them. Create  default.js that calls  notFound() or returns  null for previous behavior
[td] Modern Sass API
[td] Bumped  sass-loader to v16, which supports modern Sass syntax and new features
[h4] Deprecations
[p] These features are deprecated in Next.js 16 and will be removed in a future version:
[th] Deprecated
[th] Details
[td] middleware.ts filename
[td] Rename to  proxy.ts to clarify network boundary and routing focus
[td] next/legacy/image component
[td] Use  next/image instead for improved performance and features
[td] images.domains config
[td] Use  images.remotePatterns config instead for improved security restriction
[td] revalidateTag() single argument
[td] Use  revalidateTag(tag, profile) for SWR, or  updateTag(tag) in Actions for read-your-writes
[h4] Additional Improvements
[li] Performance improvements: Significant performance optimizations for  next dev and  next start commands
[li] Node.js native TypeScript for  next.config.ts: Run  next dev,  next build, and  next start commands with  --experimental-next-config-strip-types flag to enable native TypeScript for  next.config.ts.
[p] We'll aim to share a more comprehensive migration guide ahead of the stable release in our documentation.
[h2] Feedback and Community
[p] Share your feedback and help shape the future of Next.js:
[li] GitHub Discussions
[li] GitHub Issues
[li] Discord Community
[h2] Contributors
[p] Next.js is the result of the combined work of over 3,000 individual developers. This release was brought to you by:
[li] The  Next.js team:  Andrew   ,  Hendrik   ,  Janka   ,  Jiachi   ,  Jimmy   ,  Jiwon   ,  JJ   ,  Josh   ,  Jude   ,  Sam   ,  Sebastian   ,  Sebbie   ,  Wyatt   , and  Zack   .
[li] The  Turbopack team:  Benjamin   ,  Josh   ,  Luke   ,  Niklas   ,  Tim   ,  Tobias   , and  Will   .
[li] The  Next.js Docs team:  Delba   ,  Rich   ,  Ismael   , and  Joseph   .
[p] Huge thanks to @mischnic, @timneutkens, @unstubbable, @wyattjoh, @Cy-Tek, @lukesandberg, @OoMNoO, @ztanner, @icyJoseph, @huozhi, @gnoff, @ijjk, @povilasv, @dwrth, @obendev, @aymericzip, @devjiwonchoi, @SyMind, @vercel-release-bot, @Shireee, @eps1lon, @dharun36, @kachkaev, @bgw, @yousefdawood7, @TheAlexLichter, @sokra, @ericx0099, @leerob, @Copilot, @fireairforce, @fufuShih, @anvibanga, @hayes, @Milancen123, @martinfrancois, @lubieowoce, @gaojude, @lachlanjc, @liketiger, @styfle, @aaronbrown-vercel, @Samii2383, @FelipeChicaiza, @kevva, @m1abdullahh, @F7b5, @Anshuman71, @RobertFent, @poteto, @chloe-yan, @sireesha-siri, @brian-lou, @joao4xz, @stefanprobst, @samselikoff, @acdlite, @gwkline, @bgub, @brock-statsig, and @karlhorky for helping!
[h4] Resources
[h4] More
[h4] About Vercel
[h4] Legal
[h4] Subscribe to our newsletter
[p] Stay updated on new releases and features, guides, and case studies.
[p] © 2025 Vercel, Inc.
