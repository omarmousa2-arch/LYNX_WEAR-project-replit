import { execFileSync } from "node:child_process";
import process from "node:process";

const SAMPLE_QUANTITY = 10;
const SIZES = ["S", "M", "L", "XL"];

const productsToSeed = [
  {
    handle: "lynx-core-tee",
    title: "تيشيرت كور",
    type: "تيشيرتات",
    description: "قميص تدريب خفيف بيمتص العرق ويتحرك معاك في كل عدة.",
    price: 22,
    sizes: SIZES,
  },
  {
    handle: "lynx-tempo-short",
    title: "شورت تيمبو",
    type: "شورتات",
    description: "شورت مرن وخفيف للجري وتمارين القوة.",
    price: 26,
    sizes: SIZES,
  },
  {
    handle: "lynx-lift-tank",
    title: "تيشيرت ليفت",
    type: "تيشيرتات",
    description: "تيشيرت كت بدون أكمام لحرية حركة أكبر أثناء التمرين.",
    price: 18,
    sizes: SIZES,
  },
  {
    handle: "lynx-motion-tight",
    title: "ليجنز موشن",
    type: "ليجنز",
    description: "ليجنز تدريب مرن بخصر ثابت وحركة مريحة.",
    price: 32,
    sizes: SIZES,
  },
  {
    handle: "lynx-crew-socks",
    title: "شراب كرو",
    type: "إكسسوارات",
    description: "شراب رياضي مريح للاستخدام اليومي والتمرين.",
    price: 8,
  },
  {
    handle: "lynx-oversized-tee",
    title: "تيشيرت أوفرسايز",
    type: "تيشيرتات",
    description: "قصة واسعة وخامة مريحة للإحماء والتمرين.",
    price: 24,
    sizes: SIZES,
  },
  {
    handle: "lynx-run-short",
    title: "شورت رن",
    type: "شورتات",
    description: "شورت جري خفيف ببطانة مريحة.",
    price: 23,
    sizes: SIZES,
  },
  {
    handle: "lynx-run-cap",
    title: "كاب رن",
    type: "إكسسوارات",
    description: "كاب رياضي خفيف للحماية أثناء الجري.",
    price: 14,
  },
  {
    handle: "lynx-zip-hoodie",
    title: "هودي بسوستة",
    type: "هوديز",
    description: "هودي تدريب بسوستة كاملة مناسب للإحماء وبعد التمرين.",
    price: 48,
    sizes: SIZES,
  },
  {
    handle: "lynx-compression-top",
    title: "تيشيرت ضغط طويل",
    type: "تيشيرتات",
    description: "طبقة ضغط طويلة وخفيفة للتمرين والحركة.",
    price: 32,
    sizes: SIZES,
  },
  {
    handle: "lynx-training-joggers",
    title: "بنطلون تدريب",
    type: "بنطلونات",
    description: "بنطلون تدريب مريح بخصر مرن وحركة سهلة.",
    price: 38,
    sizes: SIZES,
  },
  {
    handle: "lynx-shaker-bottle",
    title: "شيكر لينكس",
    type: "إكسسوارات",
    description: "شيكر عملي لتحضير مشروبك بعد التمرين.",
    price: 16,
  },
  {
    handle: "lynx-lifting-belt",
    title: "حزام رفع أثقال",
    type: "مستلزمات الجيم",
    description: "حزام دعم لتمارين الأوزان الثقيلة.",
    price: 35,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    handle: "lynx-wrist-wraps",
    title: "رباط معصم",
    type: "مستلزمات الجيم",
    description: "أربطة معصم عملية لدعم القبضة أثناء التمرين.",
    price: 14,
  },
  {
    handle: "lynx-training-gloves",
    title: "جوانتي تدريب",
    type: "مستلزمات الجيم",
    description: "قفازات تدريب بقبضة مريحة وحماية لليد.",
    price: 18,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    handle: "lynx-resistance-bands",
    title: "أشرطة مقاومة",
    type: "مستلزمات الجيم",
    description: "أشرطة مقاومة متعددة الاستخدام للإحماء وتمارين القوة.",
    price: 22,
  },
];

function adminRequest(query, variables = {}) {
  const stdout = execFileSync(
    process.execPath,
    ["shopify-admin-api.mjs", JSON.stringify({ query, variables })],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );
  const response = JSON.parse(stdout);
  if (response.errors?.length) {
    throw new Error(response.errors.map((error) => error.message).join("; "));
  }
  return response.data;
}

function assertNoUserErrors(result, operation) {
  const userErrors = result?.userErrors ?? [];
  if (userErrors.length) {
    throw new Error(
      `${operation} failed: ${userErrors.map((error) => error.message).join("; ")}`,
    );
  }
}

function loadProduct(handle) {
  const result = adminRequest(
    `query LynxSeedProduct {
      products(first: 1, query: "handle:${handle}") {
        nodes {
          id
          handle
          variants(first: 100) {
            nodes {
              id
              title
              price
              selectedOptions { name value }
              inventoryItem {
                id
                tracked
                inventoryLevels(first: 10) {
                  nodes {
                    location { id name }
                    quantities(names: ["available"]) { name quantity }
                  }
                }
              }
            }
          }
        }
      }
    }`,
  );
  return result.products.nodes[0] ?? null;
}

function availableQuantity(level) {
  return level?.quantities.find((quantity) => quantity.name === "available")
    ?.quantity ?? 0;
}

const initial = adminRequest(`query LynxSeedSetup {
  locations(first: 1) { nodes { id name } }
  publications(first: 20) { nodes { id name } }
  products(first: 100) { nodes { handle } }
}`);

const location = initial.locations.nodes[0];
if (!location) throw new Error("The connected Shopify store has no inventory location.");

const publication = initial.publications.nodes.find(
  (item) => item.name === "Replit",
);
if (!publication) {
  throw new Error(
    'A Replit preview publication was not found. No products were published to another sales channel.',
  );
}

for (const productSeed of productsToSeed) {
  let product = loadProduct(productSeed.handle);

  if (!product) {
    const productOptions = productSeed.sizes
      ? [
          {
            name: "Size",
            position: 1,
            values: productSeed.sizes.map((name) => ({ name })),
          },
        ]
      : undefined;

    const created = adminRequest(
      `mutation CreateLynxProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            handle
            variants(first: 100) {
              nodes {
                id
                title
                selectedOptions { name value }
                inventoryItem { id }
              }
            }
          }
          userErrors { field message }
        }
      }`,
      {
        product: {
          title: productSeed.title,
          handle: productSeed.handle,
          descriptionHtml: `<p>${productSeed.description} السعر والكمية المعروضان تجريبيان للمعاينة فقط.</p>`,
          productType: productSeed.type,
          vendor: "Lynx Wear",
          tags: ["Lynx Wear", "DEMO", "Preview", productSeed.type],
          status: "ACTIVE",
          productOptions,
        },
      },
    );
    const creation = created.productCreate;
    assertNoUserErrors(creation, `Create ${productSeed.handle}`);
    if (!creation.product) {
      throw new Error(`Shopify did not return ${productSeed.handle} after creation.`);
    }
    console.log(`Created ${productSeed.handle}`);
    product = creation.product;
  } else {
    console.log(`Using existing ${productSeed.handle}`);
  }

  if (productSeed.sizes) {
    const existingSizes = new Set(
      product.variants.nodes
        .map(
          (variant) =>
            variant.selectedOptions.find((option) => option.name === "Size")
              ?.value,
        )
        .filter(Boolean),
    );
    const missingSizes = productSeed.sizes.filter(
      (size) => !existingSizes.has(size),
    );

    if (missingSizes.length) {
      const created = adminRequest(
        `mutation CreateLynxVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!, $key: String!) {
          productVariantsBulkCreate(productId: $productId, variants: $variants)
            @idempotent(key: $key) {
            productVariants { id title }
            userErrors { field message }
          }
        }`,
        {
          productId: product.id,
          variants: missingSizes.map((size) => ({
            optionValues: [{ optionName: "Size", name: size }],
          })),
          key: `lynx-preview:${productSeed.handle}:sizes:${missingSizes.join("-")}:v1`,
        },
      );
      assertNoUserErrors(
        created.productVariantsBulkCreate,
        `Create sizes for ${productSeed.handle}`,
      );
    }
  }

  product = loadProduct(productSeed.handle);
  if (!product) {
    throw new Error(`Could not reload ${productSeed.handle} after variant creation.`);
  }

  const targetPrice = productSeed.price.toFixed(2);
  const variantsToPrice = product.variants.nodes.filter(
    (variant) => Number(variant.price).toFixed(2) !== targetPrice,
  );
  if (variantsToPrice.length) {
    const updated = adminRequest(
      `mutation SetLynxPreviewPrices($productId: ID!, $variants: [ProductVariantsBulkInput!]!, $key: String!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants)
          @idempotent(key: $key) {
          productVariants { id price }
          userErrors { field message }
        }
      }`,
      {
        productId: product.id,
        variants: variantsToPrice.map((variant) => ({
          id: variant.id,
          price: targetPrice,
        })),
        key: `lynx-preview:${productSeed.handle}:price:${targetPrice}:v1`,
      },
    );
    assertNoUserErrors(
      updated.productVariantsBulkUpdate,
      `Set preview price for ${productSeed.handle}`,
    );
  }

  product = loadProduct(productSeed.handle);
  for (const variant of product.variants.nodes) {
    const inventoryItem = variant.inventoryItem;
    let level = inventoryItem.inventoryLevels.nodes.find(
      (item) => item.location.id === location.id,
    );

    if (!level) {
      const activated = adminRequest(
        `mutation ActivateLynxPreviewInventory($inventoryItemId: ID!, $locationId: ID!, $key: String!) {
          inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId)
            @idempotent(key: $key) {
            inventoryLevel {
              id
              quantities(names: ["available"]) { name quantity }
            }
            userErrors { field message }
          }
        }`,
        {
          inventoryItemId: inventoryItem.id,
          locationId: location.id,
          key: `lynx-preview:${productSeed.handle}:activate:${variant.title}:v1`,
        },
      );
      const activation = activated.inventoryActivate;
      assertNoUserErrors(
        activation,
        `Activate inventory for ${productSeed.handle} ${variant.title}`,
      );
      level = {
        location,
        quantities: activation.inventoryLevel?.quantities ?? [],
      };
    }

    const currentQuantity = availableQuantity(level);
    if (currentQuantity !== SAMPLE_QUANTITY) {
      const updated = adminRequest(
        `mutation SetLynxPreviewQuantity($input: InventorySetQuantitiesInput!, $key: String!) {
          inventorySetQuantities(input: $input) @idempotent(key: $key) {
            inventoryAdjustmentGroup { id }
            userErrors { field message }
          }
        }`,
        {
          input: {
            name: "available",
            reason: "correction",
            quantities: [
              {
                inventoryItemId: inventoryItem.id,
                locationId: location.id,
                quantity: SAMPLE_QUANTITY,
                changeFromQuantity: currentQuantity,
              },
            ],
          },
          key: `lynx-preview:${productSeed.handle}:quantity:${variant.title}:${currentQuantity}-to-${SAMPLE_QUANTITY}:v1`,
        },
      );
      assertNoUserErrors(
        updated.inventorySetQuantities,
        `Set preview stock for ${productSeed.handle} ${variant.title}`,
      );
    }
  }

  const published = adminRequest(
    `mutation PublishLynxPreview($id: ID!, $input: [PublicationInput!]!, $key: String!) {
      publishablePublish(id: $id, input: $input) @idempotent(key: $key) {
        userErrors { field message }
      }
    }`,
    {
      id: product.id,
      input: [{ publicationId: publication.id }],
      key: `lynx-preview:${productSeed.handle}:publish:replit:v1`,
    },
  );
  assertNoUserErrors(
    published.publishablePublish,
    `Publish ${productSeed.handle} to the Replit preview channel`,
  );
  console.log(`Ready for preview: ${productSeed.handle}`);
}

const finalState = adminRequest(`query LynxPreviewCatalog {
  products(first: 100) {
    nodes {
      handle
      variants(first: 100) { nodes { id price selectedOptions { name value } } }
    }
  }
}`);
const expectedHandles = new Set(productsToSeed.map((product) => product.handle));
const seeded = finalState.products.nodes.filter((product) =>
  expectedHandles.has(product.handle),
);
console.log(
  `Preview catalog complete: ${seeded.length} products, ${seeded.reduce((count, product) => count + product.variants.nodes.length, 0)} variants.`,
);
