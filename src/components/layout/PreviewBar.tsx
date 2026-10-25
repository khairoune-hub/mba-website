import { RefreshOnSave } from './RefreshOnSave'

/** Shown in draft mode: a banner + live-preview refresh on save. */
export function PreviewBar({ label, exitLabel, path }: { label: string; exitLabel: string; path: string }) {
  return (
    <>
      <RefreshOnSave />
      <div className="sticky top-0 z-50 bg-gold text-navy">
        <div className="container-mba flex items-center justify-between gap-4 py-2 text-sm font-semibold">
          <span>{label}</span>
          <a href={`/next/exit-preview?path=${encodeURIComponent(path)}`} className="underline">
            {exitLabel}
          </a>
        </div>
      </div>
    </>
  )
}
