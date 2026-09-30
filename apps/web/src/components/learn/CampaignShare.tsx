"use client";

import { useSyncExternalStore } from "react";
import { Download, MessageCircle, Share2 } from "lucide-react";
import { buttonClass } from "../ui/styles";

type Props = {
  imageUrl: string;
  shareText: string;
  fileName: string;
  text: { shareImage: string; shareWhatsapp: string; shareDownload: string };
};

const canShareFiles = () =>
  typeof navigator !== "undefined" &&
  typeof navigator.canShare === "function" &&
  navigator.canShare({ files: [new File([""], "x.jpg", { type: "image/jpeg" })] });

/**
 * Share a campaign poster. On phones that support it, "Share image" opens the
 * phone's share sheet (WhatsApp, etc.) with the picture. Otherwise people can
 * share the text on WhatsApp or download the picture.
 */
export function CampaignShare({ imageUrl, shareText, fileName, text }: Props) {
  const shareFiles = useSyncExternalStore(() => () => {}, canShareFiles, () => false);

  async function shareImage() {
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
      await navigator.share({ files: [file], text: shareText });
    } catch {
      // The person closed the share sheet, or sharing failed: nothing to do.
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {shareFiles && (
        <button type="button" onClick={shareImage} className={buttonClass("primary")}>
          <Share2 aria-hidden="true" className="size-5" />
          {text.shareImage}
        </button>
      )}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(shareFiles ? "secondary" : "primary")}
        data-testid="share-whatsapp"
      >
        <MessageCircle aria-hidden="true" className="size-5" />
        {text.shareWhatsapp}
      </a>
      <a href={imageUrl} download={fileName} className={buttonClass("secondary")} data-testid="share-download">
        <Download aria-hidden="true" className="size-5" />
        {text.shareDownload}
      </a>
    </div>
  );
}
