import type { ShopifyProduct } from "@workspace/api-client-react";
import coreTeePhoto from "../../../../attached_assets/generated_images/lynx-core-tee.jpg";
import coreTeeBlackPhoto from "../../../../attached_assets/generated_images/lynx-core-tee-black.jpg";
import coreTeeWhitePhoto from "../../../../attached_assets/generated_images/lynx-core-tee-white.jpg";
import tempoShortPhoto from "../../../../attached_assets/generated_images/lynx-tempo-short.jpg";
import liftTankPhoto from "../../../../attached_assets/generated_images/lynx-lift-tank.jpg";
import liftTankOlivePhoto from "../../../../attached_assets/generated_images/lynx-lift-tank-olive.jpg";
import liftTankWhitePhoto from "../../../../attached_assets/generated_images/lynx-lift-tank-white.jpg";
import motionTightPhoto from "../../../../attached_assets/generated_images/lynx-motion-tight.jpg";
import crewSocksPhoto from "../../../../attached_assets/generated_images/lynx-crew-socks.jpg";
import oversizedTeePhoto from "../../../../attached_assets/generated_images/lynx-oversized-tee.jpg";
import oversizedTeeBlackPhoto from "../../../../attached_assets/generated_images/lynx-oversized-tee-black.jpg";
import oversizedTeeOlivePhoto from "../../../../attached_assets/generated_images/lynx-oversized-tee-olive.jpg";
import runShortPhoto from "../../../../attached_assets/generated_images/lynx-run-short.jpg";
import runCapPhoto from "../../../../attached_assets/generated_images/lynx-run-cap.jpg";
import zipHoodiePhoto from "../../../../attached_assets/generated_images/lynx-zip-hoodie.jpg";
import zipHoodieOlivePhoto from "../../../../attached_assets/generated_images/lynx-zip-hoodie-olive.jpg";
import zipHoodieOffWhitePhoto from "../../../../attached_assets/generated_images/lynx-zip-hoodie-off-white.jpg";
import compressionTopPhoto from "../../../../attached_assets/generated_images/lynx-compression-top.jpg";
import compressionTopWhitePhoto from "../../../../attached_assets/generated_images/lynx-compression-top-white.jpg";
import compressionTopOlivePhoto from "../../../../attached_assets/generated_images/lynx-compression-top-olive.jpg";
import trainingJoggersPhoto from "../../../../attached_assets/generated_images/lynx-training-joggers.jpg";
import shakerBottlePhoto from "../../../../attached_assets/generated_images/lynx-shaker-bottle.jpg";
import liftingBeltPhoto from "../../../../attached_assets/generated_images/lynx-lifting-belt.jpg";
import wristWrapsPhoto from "../../../../attached_assets/generated_images/lynx-wrist-wraps.jpg";
import trainingGlovesPhoto from "../../../../attached_assets/generated_images/lynx-training-gloves.jpg";
import resistanceBandsPhoto from "../../../../attached_assets/generated_images/lynx-resistance-bands.jpg";

type ProductPresentation = {
  english: string;
  color: string;
  image: string;
  badge?: string;
  colors?: ProductColorChoice[];
};

export type ProductColorChoice = {
  id: string;
  label: string;
  hex: string;
  image: string;
};

const presentationByHandle: Record<string, ProductPresentation> = {
  "lynx-core-tee": {
    english: "CORE TRAINING TEE",
    color: "#737a52",
    image: coreTeePhoto,
    badge: "الأكثر مبيعًا",
    colors: [
      { id: "olive", label: "زيتوني", hex: "#737a52", image: coreTeePhoto },
      { id: "black", label: "أسود", hex: "#252522", image: coreTeeBlackPhoto },
      { id: "off-white", label: "أوف وايت", hex: "#e7dfd0", image: coreTeeWhitePhoto },
    ],
  },
  "lynx-tempo-short": {
    english: "TEMPO SHORT",
    color: "#bf5639",
    image: tempoShortPhoto,
    badge: "جديد",
  },
  "lynx-lift-tank": {
    english: "LIFT TANK",
    color: "#343a34",
    image: liftTankPhoto,
    colors: [
      { id: "charcoal", label: "رمادي فحمي", hex: "#42433f", image: liftTankPhoto },
      { id: "olive", label: "زيتوني", hex: "#66704b", image: liftTankOlivePhoto },
      { id: "off-white", label: "أوف وايت", hex: "#e7dfd0", image: liftTankWhitePhoto },
    ],
  },
  "lynx-motion-tight": {
    english: "MOTION TIGHT",
    color: "#777c8a",
    image: motionTightPhoto,
    badge: "اختيار الكوتش",
  },
  "lynx-crew-socks": {
    english: "CREW SOCKS · 2 PACK",
    color: "#d7b99b",
    image: crewSocksPhoto,
  },
  "lynx-oversized-tee": {
    english: "OFF-DUTY OVERSIZED",
    color: "#c5bdb0",
    image: oversizedTeePhoto,
    colors: [
      { id: "off-white", label: "أوف وايت", hex: "#e7dfd0", image: oversizedTeePhoto },
      { id: "black", label: "أسود", hex: "#252522", image: oversizedTeeBlackPhoto },
      { id: "olive", label: "زيتوني", hex: "#66704b", image: oversizedTeeOlivePhoto },
    ],
  },
  "lynx-run-short": {
    english: "RUN SHORT",
    color: "#bd8552",
    image: runShortPhoto,
  },
  "lynx-run-cap": {
    english: "LYNX RUN CAP",
    color: "#858b68",
    image: runCapPhoto,
  },
  "lynx-zip-hoodie": {
    english: "ZIP TRAINING HOODIE",
    color: "#5c5954",
    image: zipHoodiePhoto,
    badge: "جديد",
    colors: [
      { id: "charcoal", label: "فحمي", hex: "#393936", image: zipHoodiePhoto },
      { id: "olive", label: "زيتوني", hex: "#66704b", image: zipHoodieOlivePhoto },
      { id: "off-white", label: "أوف وايت", hex: "#e7dfd0", image: zipHoodieOffWhitePhoto },
    ],
  },
  "lynx-compression-top": {
    english: "LONG-SLEEVE COMPRESSION",
    color: "#41505a",
    image: compressionTopPhoto,
    badge: "جديد",
    colors: [
      { id: "black", label: "أسود", hex: "#252522", image: compressionTopPhoto },
      { id: "off-white", label: "أوف وايت", hex: "#e7dfd0", image: compressionTopWhitePhoto },
      { id: "olive", label: "زيتوني", hex: "#66704b", image: compressionTopOlivePhoto },
    ],
  },
  "lynx-training-joggers": {
    english: "TRAINING JOGGERS",
    color: "#53534e",
    image: trainingJoggersPhoto,
    badge: "جديد",
  },
  "lynx-shaker-bottle": {
    english: "LYNX SHAKER",
    color: "#5b6e62",
    image: shakerBottlePhoto,
    badge: "جديد",
  },
  "lynx-lifting-belt": {
    english: "WEIGHT LIFTING BELT",
    color: "#716154",
    image: liftingBeltPhoto,
    badge: "جديد",
  },
  "lynx-wrist-wraps": {
    english: "WRIST WRAPS",
    color: "#55534f",
    image: wristWrapsPhoto,
    badge: "جديد",
  },
  "lynx-training-gloves": {
    english: "TRAINING GLOVES",
    color: "#4b514b",
    image: trainingGlovesPhoto,
    badge: "جديد",
  },
  "lynx-resistance-bands": {
    english: "RESISTANCE BANDS",
    color: "#a17f61",
    image: resistanceBandsPhoto,
    badge: "جديد",
  },
};

export type StoreProduct = ShopifyProduct & Omit<ProductPresentation, "colors"> & {
  colors: ProductColorChoice[];
};

export function toStoreProduct(product: ShopifyProduct): StoreProduct {
  const presentation = presentationByHandle[product.handle];
  return {
    ...product,
    english: presentation?.english ?? product.handle.replaceAll("-", " ").toUpperCase(),
    color: presentation?.color ?? "#77756d",
    image: product.imageUrl ?? presentation?.image ?? "",
    badge: presentation?.badge,
    colors: presentation?.colors ?? [],
  };
}
