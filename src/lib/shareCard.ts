import type { Bird } from "../data/birdz";
import { RARITY } from "../data/birdz";

/**
 * Renders a share-card PNG (art + name + token id + price) on a canvas and
 * triggers a download. Artwork is a bundled same-origin asset, so the canvas
 * is never tainted.
 */
export async function downloadShareCard(bird: Bird): Promise<boolean> {
  try {
    const img = new Image();
    img.src = bird.image;
    await img.decode();

    const W = 900;
    const H = 1100;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const accent = RARITY[bird.rarity].color;

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0a0b14");
    grad.addColorStop(1, "#181a2c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Artwork panel
    const pad = 60;
    const artSize = W - pad * 2;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 6;
    ctx.strokeRect(pad - 3, pad - 3, artSize + 6, artSize + 6);
    ctx.drawImage(img, pad, pad, artSize, artSize);

    // Text
    ctx.fillStyle = "#eef1f7";
    ctx.font = "bold 64px Inter, system-ui, sans-serif";
    ctx.fillText(bird.name, pad, pad + artSize + 95);
    ctx.fillStyle = accent;
    ctx.font = "600 40px Inter, system-ui, sans-serif";
    ctx.fillText(
      `${bird.rarity} · ${bird.tokenId}`,
      pad,
      pad + artSize + 155
    );
    ctx.fillStyle = "#9aa3b8";
    ctx.font = "600 44px Inter, system-ui, sans-serif";
    ctx.fillText(`◆ ${bird.price.toFixed(2)} ETH`, pad, pad + artSize + 220);
    ctx.font = "500 28px Inter, system-ui, sans-serif";
    ctx.fillText("KryptoBirdz — demo collection", pad, H - 40);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `kryptobird-${bird.tokenId.replace("#", "")}.png`;
    a.click();
    return true;
  } catch {
    return false;
  }
}
