export function FullWidthWorkspaceStyles() {
  return (
    <style>{`
      /* Full-width application canvas. Main fills the space REMAINING beside
         the sidebar; width:100% here would mean sidebar + viewport width and
         causes the horizontal overflow seen in Your World. */
      .shell {
        display: flex;
        width: 100%;
        min-width: 0;
        max-width: 100%;
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
        overflow-x: clip;
      }

      /* Page wrappers should use the whole main canvas. Do not remove width
         constraints from intentionally narrow controls/dialogs/cards. */
      .main.workspace-main > *,
      .country-template-root .main > * {
        min-width: 0;
      }

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

      .country-template-root .country-page-card {
        width: 100%;
        max-width: none;
        margin-left: 0;
        margin-right: 0;
      }

      /* Expanded rail stays 256px; the existing collapse control reduces it to
         64px. In both states main simply takes the remainder. */
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
