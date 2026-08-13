export function FullWidthWorkspaceStyles() {
  return (
    <style>{`
      /* Full-width application canvas. The shell fills the viewport; the
         sidebar keeps its own width and main consumes only the REMAINING width.
         Important: do not set the flex child to width:100% or it becomes
         viewport-width PLUS the sidebar and creates the horizontal overflow
         visible on Your World. */
      .shell {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        overflow-x: clip;
      }

      .shell > .main,
      .main.workspace-main,
      .country-template-root .main {
        flex: 1 1 0%;
        min-width: 0;
        width: auto !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
        box-sizing: border-box;
        overflow-x: clip;
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
        box-sizing: border-box;
      }

      /* Make direct page wrappers consume the available main column instead of
         retaining implicit centered gutters. */
      .main.workspace-main > *,
      .country-template-root .main > * {
        max-width: none;
      }

      /* The shared rail already has a desktop collapse control. Expanded it
         remains 256px; collapsed it drops to 64px, returning 192px to main. */
      body.rail-collapsed .shell > .main,
      body.rail-collapsed .main.workspace-main,
      body.rail-collapsed .country-template-root .main {
        flex: 1 1 0%;
        width: auto !important;
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
