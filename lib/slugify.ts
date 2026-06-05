const GR2LAT: Record<string, string> = {
  Α: "a", Β: "v", Γ: "g", Δ: "d", Ε: "e", Ζ: "z", Η: "i", Θ: "th", Ι: "i", Κ: "k",
  Λ: "l", Μ: "m", Ν: "n", Ξ: "x", Ο: "o", Π: "p", Ρ: "r", Σ: "s", Τ: "t", Υ: "y",
  Φ: "f", Χ: "ch", Ψ: "ps", Ω: "o",
};

export function slugify(input: string): string {
  const noAccents = input.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
  let out = "";
  for (const ch of noAccents) {
    if (GR2LAT[ch]) out += GR2LAT[ch];
    else if (/[0-9A-Z]/.test(ch)) out += ch.toLowerCase();
    else out += " ";
  }
  return out.trim().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "item";
}
