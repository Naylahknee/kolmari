export function FullWidthWorkspaceStyles() {
  return (
    <style>{`
      /* Full-width application canvas. Keep the shared sidebar, but let the
         working surface consume every remaining pixel of the viewport. */
      .shell {
        width: 100%;
        min-width: 0;
      }

      .shell > .main,
      .main.workspace-main,
      .country-template-root .main {
        flex: 1 1 auto;
        min-width: 0;
        width: 100%;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
      }

      /* Remove page-level centering/max-width constraints without touching
         intentionally narrow controls, dialogs, or cards that are not page
         wrappers. */
      .main.workspace-main .max-w-screen-xl,
      .main.workspace-main .max-w-screen-2xl,
      .country-template-root .main .max-w-screen-xl,
      .country-template-root .main .max-w-screen-2xl,
      .main.workspace-main .mx-auto[class*="max-w-"],
      .country-template-root .main .mx-auto[class*="max-w-"] {
        width: 100% !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }

      /* The shared rail already has a desktop collapse control. Expanded it
         remains 256px; collapsed it drops to 64px, returning 192px to main. */
      body.rail-collapsed .shell > .main,
      body.rail-collapsed .main.workspace-main,
      body.rail-collapsed .country-template-root .main {
        flex: 1 1 auto;
        width: 100%;
        max-width: none !important;
      }

      @media (max-width: 900px) {
        .shell > .main,
        .main.workspace-main,
        .country-template-root .main {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
      }

      @media (max-width: 560px) {
        .shell > .main,
        .main.workspace-main,
        .country-template-root .main {
          padding-left: 8px !important;
          padding-right: 8px !important;
        }
      }
    `}</style>
  )
}
