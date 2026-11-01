import { Router, type IRouter } from "express";
import {
  CreateShopifyCheckoutBody,
  CreateShopifyCheckoutResponse,
  ListShopifyProductsResponse,
} from "@workspace/api-zod";
import { shopifyStorefrontRequest } from "../lib/shopifyStorefrontClient";

const router: IRouter = Router();

const PRODUCTS_QUERY = `#graphql
  query LynxStorefrontProducts {
    products(first: 100) {
      nodes {
        id
        handle
        title
        productType
        description
        featuredImage { url }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 100) {
          nodes {
            id
            title
            price { amount currencyCode }
            availableForSale
            quantityAvailable
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `#graphql
  mutation LynxCreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

type ShopifyProductsResponse = {
  products: {
    nodes: Array<{
      id: string;
      handle: string;
      title: string;
      productType: string | null;
      description: string;
      featuredImage: { url: string } | null;
      priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
      };
      variants: {
        nodes: Array<{
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          quantityAvailable: number | null;
          selectedOptions: Array<{ name: string; value: string }>;
        }>;
      };
    }>;
  };
};

type ShopifyCartResponse = {
  cartCreate: {
    cart: { checkoutUrl: string } | null;
    userErrors: Array<{ message: string }>;
  };
};

router.get("/shopify/products", async (req, res): Promise<void> => {
  try {
    const data = await shopifyStorefrontRequest<ShopifyProductsResponse>(
      PRODUCTS_QUERY,
    );
    const products = data.products.nodes.map((product) => ({
      id: product.id,
      handle: product.handle,
      title: product.title,
      productType: product.productType ?? "إكسسوارات",
      description: product.description,
      imageUrl: product.featuredImage?.url ?? null,
      price: Number(product.priceRange.minVariantPrice.amount),
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
      variants: product.variants.nodes.map((variant) => ({
        id: variant.id,
        title: variant.title,
        price: Number(variant.price.amount),
        currencyCode: variant.price.currencyCode,
        availableForSale: variant.availableForSale,
        quantityAvailable: Math.max(0, variant.quantityAvailable ?? 0),
        selectedOptions: variant.selectedOptions,
      })),
    }));

    res.json(ListShopifyProductsResponse.parse(products));
  } catch (error) {
    req.log.error({ err: error }, "Shopify product query failed");
    res.status(502).json({ error: "تعذر تحميل المنتجات من المتجر الآن." });
  }
});

router.post("/shopify/checkout", async (req, res): Promise<void> => {
  const parsed = CreateShopifyCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const quantities = new Map<string, { variantId: string; quantity: number; color?: string }>();
  const variantTotals = new Map<string, number>();
  for (const line of parsed.data.lines) {
    const color = line.color?.trim();
    const key = `${line.variantId}\u0000${color ?? ""}`;
    const quantity = (quantities.get(key)?.quantity ?? 0) + line.quantity;
    const variantTotal = (variantTotals.get(line.variantId) ?? 0) + line.quantity;
    if (variantTotal > 99) {
      res.status(400).json({ error: "الكمية القصوى للصنف الواحد ٩٩ قطعة." });
      return;
    }
    variantTotals.set(line.variantId, variantTotal);
    quantities.set(key, {
      variantId: line.variantId,
      quantity,
      ...(color ? { color } : {}),
    });
  }

  const lines = [...quantities.values()].map(({ variantId, quantity, color }) => ({
    merchandiseId: variantId,
    quantity,
    ...(color ? { attributes: [{ key: "Color", value: color }] } : {}),
  }));

  try {
    const data = await shopifyStorefrontRequest<ShopifyCartResponse>(
      CART_CREATE_MUTATION,
      { lines },
    );
    const error = data.cartCreate.userErrors[0];
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const checkoutUrl = data.cartCreate.cart?.checkoutUrl;
    if (!checkoutUrl) {
      res.status(502).json({ error: "Shopify لم يُرجع رابط إتمام الطلب." });
      return;
    }

    const url = new URL(checkoutUrl);
    if (url.protocol !== "https:") {
      res.status(502).json({ error: "رابط إتمام الطلب غير آمن." });
      return;
    }

    // The connected Replit store is currently for preview. Keep Shopify's
    // hosted checkout in its online-store preview mode until the merchant
    // explicitly transfers the store and asks to go live.
    url.searchParams.set("channel", "online_store");
    res.json(CreateShopifyCheckoutResponse.parse({ checkoutUrl: url.toString() }));
  } catch (error) {
    req.log.error({ err: error }, "Shopify checkout creation failed");
    res.status(502).json({ error: "تعذر بدء إتمام الطلب عبر Shopify الآن." });
  }
});

export default router;
