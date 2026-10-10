from PIL import Image
from pathlib import Path

assets = Path(r"C:\Users\nguye\.cursor\projects\d-REPO-profile\assets")
public = Path(r"d:\REPO\profile\public")

icon_src = Image.open(assets / "icon-512.jpg").convert("RGBA")
w, h = icon_src.size
side = min(w, h)
left = (w - side) // 2
top = (h - side) // 2
icon_sq = icon_src.crop((left, top, left + side, top + side))

for name, size in [("icon-512.png", 512), ("icon-192.png", 192), ("apple-touch-icon.png", 180)]:
    out = icon_sq.resize((size, size), Image.Resampling.LANCZOS)
    if name == "apple-touch-icon.png":
        bg = Image.new("RGBA", (size, size), (7, 17, 15, 255))
        bg.alpha_composite(out)
        out = bg.convert("RGB")
        out.save(public / name, "PNG", optimize=True)
    else:
        out.save(public / name, "PNG", optimize=True)
    print("wrote", name, out.size)

ico_sizes = [16, 32, 48]
ico_imgs = [icon_sq.resize((s, s), Image.Resampling.LANCZOS).convert("RGBA") for s in ico_sizes]
ico_imgs[0].save(
    public / "favicon.ico",
    format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_imgs[1:],
)
print("wrote favicon.ico")

og = Image.open(assets / "og-image.jpg").convert("RGB")
target_w, target_h = 1200, 630
ow, oh = og.size
scale = max(target_w / ow, target_h / oh)
nw, nh = int(ow * scale), int(oh * scale)
og_r = og.resize((nw, nh), Image.Resampling.LANCZOS)
left = (nw - target_w) // 2
top = (nh - target_h) // 2
og_crop = og_r.crop((left, top, left + target_w, top + target_h))
og_crop.save(public / "og-image.png", "PNG", optimize=True)
print("wrote og-image.png", og_crop.size)
