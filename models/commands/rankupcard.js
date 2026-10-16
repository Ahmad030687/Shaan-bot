// ===== PREMIUM RANKUP CARD DESIGN =====
const width = 1200;
const height = 500;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Background
const bg = ctx.createLinearGradient(0, 0, width, height);
bg.addColorStop(0, "#080812");
bg.addColorStop(0.48, "#17102D");
bg.addColorStop(1, "#090914");

ctx.fillStyle = bg;
ctx.fillRect(0, 0, width, height);

// Decorative glow
function glow(x, y, radius, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

glow(1050, 70, 400, "rgba(153, 75, 255, 0.22)");
glow(100, 480, 300, "rgba(255, 190, 70, 0.12)");

// Rounded rectangle helper
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Main glass card
roundRect(35, 35, 1130, 430, 32);
ctx.fillStyle = "rgba(255,255,255,0.045)";
ctx.fill();

ctx.lineWidth = 2;
ctx.strokeStyle = "rgba(190,155,255,0.35)";
ctx.stroke();

// Gold top accent
const accent = ctx.createLinearGradient(100, 0, 1100, 0);
accent.addColorStop(0, "#9B63FF");
accent.addColorStop(0.5, "#FFD98A");
accent.addColorStop(1, "#9B63FF");

roundRect(75, 55, 1050, 5, 3);
ctx.fillStyle = accent;
ctx.fill();

// Avatar frame
const avatarSize = 245;
const avatarX = 105;
const avatarY = 125;
const centerX = avatarX + avatarSize / 2;
const centerY = avatarY + avatarSize / 2;

// Avatar glow
ctx.save();
ctx.shadowColor = "#A875FF";
ctx.shadowBlur = 35;
ctx.beginPath();
ctx.arc(centerX, centerY, avatarSize / 2 + 8, 0, Math.PI * 2);
ctx.fillStyle = "#A875FF";
ctx.fill();
ctx.restore();

// Avatar image
ctx.save();
ctx.beginPath();
ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
ctx.clip();
ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
ctx.restore();

// Avatar border
ctx.beginPath();
ctx.arc(centerX, centerY, avatarSize / 2 + 4, 0, Math.PI * 2);
ctx.lineWidth = 5;
ctx.strokeStyle = "#FFD98A";
ctx.stroke();

// Small VIP label
roundRect(135, 390, 185, 42, 21);
ctx.fillStyle = "#FFD98A";
ctx.fill();

ctx.font = "bold 19px Sans";
ctx.textAlign = "center";
ctx.fillStyle = "#17102D";
ctx.fillText("✦ VIP ACHIEVEMENT ✦", 227, 417);

// Text area
ctx.textAlign = "left";

// LEVEL UP heading
ctx.font = "bold 62px Sans";
ctx.fillStyle = "#FFFFFF";
ctx.shadowColor = "rgba(180,120,255,0.65)";
ctx.shadowBlur = 18;
ctx.fillText("LEVEL UP!", 420, 135);
ctx.shadowBlur = 0;

// Username
ctx.font = "bold 38px Sans";
ctx.fillStyle = "#D9B8FF";

let displayName = String(name || "Member");
if (displayName.length > 22) {
  displayName = displayName.slice(0, 20) + "...";
}
ctx.fillText(displayName, 425, 195);

// Congratulations
ctx.font = "26px Sans";
ctx.fillStyle = "rgba(255,255,255,0.78)";
ctx.fillText("Congratulations! Your hard work paid off.", 425, 245);

// Level transition box
roundRect(420, 275, 650, 95, 18);
ctx.fillStyle = "rgba(255,255,255,0.07)";
ctx.fill();
ctx.strokeStyle = "rgba(255,217,138,0.35)";
ctx.lineWidth = 1.5;
ctx.stroke();

// Previous level
ctx.textAlign = "center";
ctx.font = "bold 32px Sans";
ctx.fillStyle = "#B8B4C9";
ctx.fillText(`LEVEL ${curLevel}`, 550, 330);

// Arrow
ctx.font = "bold 36px Sans";
ctx.fillStyle = "#FFD98A";
ctx.fillText("➜", 745, 330);

// New level
ctx.font = "bold 42px Sans";
ctx.fillStyle = "#FFD98A";
ctx.fillText(`LEVEL ${nextLevel}`, 935, 332);

// Bottom branding
ctx.textAlign = "left";
ctx.font = "bold 24px Sans";
ctx.fillStyle = "#FFFFFF";
ctx.fillText("AHMAD RDX", 425, 420);

ctx.font = "17px Sans";
ctx.fillStyle = "rgba(255,255,255,0.5)";
ctx.fillText("PREMIUM RANKUP EXPERIENCE", 620, 420);

// Bottom right decorative star
ctx.font = "bold 38px Sans";
ctx.fillStyle = "#FFD98A";
ctx.fillText("✦", 1070, 420);
