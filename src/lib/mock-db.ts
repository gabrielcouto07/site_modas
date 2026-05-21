import sampleProducts from "../../data/sample-products.json";

type MockCategory = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  sortOrder: number;
};

type MockProductImage = {
  id: string;
  productId: string;
  url: string;
  alt: string;
  sortOrder: number;
};

type MockProductVariant = {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
};

type MockProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  basePrice: number;
  compareAtPrice: number | null;
  sku: string;
  isActive: boolean;
  weightGrams: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
  createdAt: Date;
  updatedAt: Date;
};

type MockUser = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  phone: string | null;
  cpf: string | null;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type MockAddress = {
  id: string;
  userId: string;
  label: string;
  recipient: string;
  zip: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type MockOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  name: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
};

type MockOrder = {
  id: string;
  number: string;
  userId: string | null;
  email: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: "PIX" | "CARD" | "BOLETO";
  paymentStatus: string;
  paymentProviderId: string | null;
  shippingService: string | null;
  shippingTrackingCode: string | null;
  addressSnapshot: unknown;
  itemsSnapshot: unknown;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type MockCoupon = {
  id: string;
  code: string;
  kind: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minSubtotal: number | null;
  expiresAt: Date | null;
  isActive: boolean;
};

type MockWebhookEvent = {
  id: string;
  provider: string;
  eventType: string;
  payload: unknown;
  receivedAt: Date;
  processedAt: Date | null;
};

type MockState = {
  categories: MockCategory[];
  products: MockProduct[];
  images: MockProductImage[];
  variants: MockProductVariant[];
  users: MockUser[];
  addresses: MockAddress[];
  orders: MockOrder[];
  orderItems: MockOrderItem[];
  coupons: MockCoupon[];
  webhooks: MockWebhookEvent[];
};

declare global {
  // eslint-disable-next-line no-var
  var mockPrismaState: MockState | undefined;
}

function now() {
  return new Date();
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function seedState(): MockState {
  const samples = sampleProducts as Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    category: { id: string; name: string; slug: string };
    basePrice: number;
    compareAtPrice: number | null;
    sku: string;
    isActive: boolean;
    images: Array<{ url: string; alt: string; sortOrder: number }>;
    variants: Array<{ size: string; color: string; colorHex: string; stock: number; sku: string }>;
  }>;
  const categoryMap = new Map<string, MockCategory>();

  for (const sample of samples) {
    if (!categoryMap.has(sample.category.id)) {
      categoryMap.set(sample.category.id, {
        id: sample.category.id,
        name: sample.category.name,
        slug: sample.category.slug,
        image: null,
        sortOrder: categoryMap.size,
      });
    }
  }

  const categories = [...categoryMap.values()];
  const products: MockProduct[] = samples.map((sample) => ({
    id: sample.id,
    name: sample.name,
    slug: sample.slug,
    description: sample.description,
    categoryId: sample.category.id,
    basePrice: sample.basePrice,
    compareAtPrice: sample.compareAtPrice ?? null,
    sku: sample.sku,
    isActive: sample.isActive,
    weightGrams: 450,
    widthCm: 25,
    heightCm: 8,
    lengthCm: 35,
    createdAt: now(),
    updatedAt: now(),
  }));

  const images: MockProductImage[] = samples.flatMap((sample) =>
    sample.images.map((image, index) => ({
      id: createId("img"),
      productId: sample.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder ?? index + 1,
    }))
  );

  const variants: MockProductVariant[] = samples.flatMap((sample) =>
    sample.variants.map((variant) => ({
      id: createId("var"),
      productId: sample.id,
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      stock: variant.stock,
      sku: variant.sku,
    }))
  );

  const demoUser: MockUser = {
    id: "user-demo",
    email: "cliente@camilamodas.com.br",
    name: "Cliente Demo",
    role: "USER",
    phone: "11999999999",
    cpf: "12345678901",
    passwordHash: null,
    createdAt: now(),
    updatedAt: now(),
  };

  const demoAddress: MockAddress = {
    id: "addr-demo",
    userId: demoUser.id,
    label: "Casa",
    recipient: "Cliente Demo",
    zip: "01310-100",
    street: "Avenida Paulista",
    number: "1000",
    complement: "8 andar",
    district: "Bela Vista",
    city: "Sao Paulo",
    state: "SP",
    isDefault: true,
    createdAt: now(),
    updatedAt: now(),
  };

  const firstProduct = products[0]!;
  const firstVariant = variants.find((variant) => variant.productId === firstProduct.id)!;
  const demoOrder: MockOrder = {
    id: "order-demo-1",
    number: "CM-2026-000001",
    userId: demoUser.id,
    email: demoUser.email,
    status: "PAID",
    subtotal: firstProduct.basePrice,
    shippingCost: 19.9,
    discount: 0,
    total: firstProduct.basePrice + 19.9,
    paymentMethod: "PIX",
    paymentStatus: "approved",
    paymentProviderId: "demo-provider",
    shippingService: "Correios PAC",
    shippingTrackingCode: null,
    addressSnapshot: demoAddress,
    itemsSnapshot: [
      {
        productId: firstProduct.id,
        variantId: firstVariant.id,
        quantity: 1,
        unitPrice: firstProduct.basePrice,
        name: firstProduct.name,
        size: firstVariant.size,
        color: firstVariant.color,
        image: images.find((image) => image.productId === firstProduct.id)?.url ?? "",
      },
    ],
    expiresAt: null,
    createdAt: now(),
    updatedAt: now(),
  };

  return {
    categories,
    products,
    images,
    variants,
    users: [demoUser],
    addresses: [demoAddress],
    orders: [demoOrder],
    orderItems: [
      {
        id: createId("item"),
        orderId: demoOrder.id,
        productId: firstProduct.id,
        variantId: firstVariant.id,
        name: firstProduct.name,
        size: firstVariant.size,
        color: firstVariant.color,
        unitPrice: firstProduct.basePrice,
        quantity: 1,
      },
    ],
    coupons: [],
    webhooks: [],
  };
}

function getState() {
  globalThis.mockPrismaState ??= seedState();
  return globalThis.mockPrismaState;
}

function productCategory(product: MockProduct, state = getState()) {
  return state.categories.find((category) => category.id === product.categoryId) ?? null;
}

function productImages(productId: string, state = getState()) {
  return state.images
    .filter((image) => image.productId === productId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function productVariants(productId: string, state = getState()) {
  return state.variants
    .filter((variant) => variant.productId === productId)
    .sort((a, b) => a.size.localeCompare(b.size));
}

function asProduct(product: MockProduct, state = getState()) {
  return {
    ...clone(product),
    category: productCategory(product, state),
    images: productImages(product.id, state),
    variants: productVariants(product.id, state),
  };
}

function asVariant(variant: MockProductVariant, state = getState()) {
  const product = state.products.find((entry) => entry.id === variant.productId);

  return {
    ...clone(variant),
    product: product ? asProduct(product, state) : null,
  };
}

function orderItems(orderId: string, state = getState()) {
  return state.orderItems.filter((item) => item.orderId === orderId).map((item) => clone(item));
}

function asOrder(order: MockOrder, state = getState(), includeItems = false) {
  const user = state.users.find((entry) => entry.id === order.userId) ?? null;

  return {
    ...clone(order),
    user,
    items: includeItems ? orderItems(order.id, state) : orderItems(order.id, state),
  };
}

function matchesString(value: string | null | undefined, filter?: { contains?: string }) {
  if (!filter?.contains) {
    return true;
  }

  return value?.toLowerCase().includes(filter.contains.toLowerCase()) ?? false;
}

function matchesPrice(value: number, filter?: { gte?: number; lte?: number }) {
  if (filter?.gte !== undefined && value < filter.gte) {
    return false;
  }

  if (filter?.lte !== undefined && value > filter.lte) {
    return false;
  }

  return true;
}

function matchesProductWhere(product: MockProduct, where: any, state = getState()) {
  if (!where) {
    return true;
  }

  if (where.isActive !== undefined && product.isActive !== where.isActive) {
    return false;
  }

  if (where.slug && product.slug !== where.slug) {
    return false;
  }

  if (where.id && product.id !== where.id) {
    return false;
  }

  if (where.category?.slug) {
    const category = productCategory(product, state);
    if (category?.slug !== where.category.slug) {
      return false;
    }
  }

  if (!matchesPrice(product.basePrice, where.basePrice)) {
    return false;
  }

  if (!matchesString(product.name, where.name)) {
    return false;
  }

  if (where.variants?.some) {
    const required = where.variants.some;
    const variants = productVariants(product.id, state);
    const variantMatch = variants.some((variant) => {
      const colorOk = required.color ? variant.color === required.color : true;
      const sizeOk = required.size ? variant.size === required.size : true;
      const colorIn = required.color?.in ? required.color.in.includes(variant.color) : true;
      const sizeIn = required.size?.in ? required.size.in.includes(variant.size) : true;

      return colorOk && sizeOk && colorIn && sizeIn;
    });

    if (!variantMatch) {
      return false;
    }
  }

  return true;
}

function sortProducts(products: MockProduct[], orderBy?: any) {
  const sorted = [...products];
  const by = Array.isArray(orderBy) ? orderBy[0] : orderBy;

  if (by?.basePrice === "asc") {
    sorted.sort((a, b) => a.basePrice - b.basePrice);
  } else if (by?.basePrice === "desc") {
    sorted.sort((a, b) => b.basePrice - a.basePrice);
  } else {
    sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return sorted;
}

function matchesDateRange(date: Date, filter?: { gte?: Date; lt?: Date }) {
  if (filter?.gte && date < filter.gte) {
    return false;
  }

  if (filter?.lt && date >= filter.lt) {
    return false;
  }

  return true;
}

function matchesOrderWhere(order: MockOrder, where: any) {
  if (!where) {
    return true;
  }

  if (where.userId !== undefined && order.userId !== where.userId) {
    return false;
  }

  if (where.status) {
    if (where.status.in && !where.status.in.includes(order.status)) {
      return false;
    }

    if (where.status !== order.status && !where.status.in) {
      return false;
    }
  }

  if (where.createdAt && !matchesDateRange(order.createdAt, where.createdAt)) {
    return false;
  }

  if (where.expiresAt && !matchesDateRange(order.expiresAt ?? new Date(8640000000000000), where.expiresAt)) {
    return false;
  }

  return true;
}

function sortOrders(orders: MockOrder[], orderBy?: any) {
  const sorted = [...orders];
  const by = Array.isArray(orderBy) ? orderBy[0] : orderBy;

  if (by?.createdAt === "asc") {
    sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } else {
    sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return sorted;
}

function createMockModel<ModelName extends string>(modelName: ModelName) {
  const state = getState();

  if (modelName === "category") {
    return {
      findMany: async (args?: any) => {
        const items = [...state.categories].sort((a, b) => a.sortOrder - b.sortOrder);
        return clone(items);
      },
    };
  }

  if (modelName === "product") {
    return {
      findMany: async (args?: any) => {
        const items = sortProducts(
          state.products.filter((product) => matchesProductWhere(product, args?.where, state)),
          args?.orderBy
        );
        const sliced = items.slice(args?.skip ?? 0, (args?.skip ?? 0) + (args?.take ?? items.length));
        return sliced.map((product) => asProduct(product, state));
      },
      findUnique: async (args?: any) => {
        const product = state.products.find(
          (entry) => entry.id === args?.where?.id || entry.slug === args?.where?.slug
        );
        return product ? asProduct(product, state) : null;
      },
      create: async (args?: any) => {
        const data = args?.data ?? {};
        const product: MockProduct = {
          id: data.id ?? createId("prod"),
          name: data.name,
          slug: data.slug,
          description: data.description,
          categoryId: data.categoryId,
          basePrice: Number(data.basePrice),
          compareAtPrice: data.compareAtPrice !== undefined && data.compareAtPrice !== null ? Number(data.compareAtPrice) : null,
          sku: data.sku,
          isActive: data.isActive ?? true,
          weightGrams: data.weightGrams,
          widthCm: data.widthCm,
          heightCm: data.heightCm,
          lengthCm: data.lengthCm,
          createdAt: now(),
          updatedAt: now(),
        };

        state.products.push(product);

        if (Array.isArray(data.images?.create)) {
          for (const image of data.images.create) {
            state.images.push({
              id: createId("img"),
              productId: product.id,
              url: image.url,
              alt: image.alt,
              sortOrder: image.sortOrder ?? state.images.length + 1,
            });
          }
        }

        if (Array.isArray(data.variants?.create)) {
          for (const variant of data.variants.create) {
            state.variants.push({
              id: createId("var"),
              productId: product.id,
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              stock: variant.stock,
              sku: variant.sku,
            });
          }
        }

        return asProduct(product, state);
      },
      update: async (args?: any) => {
        const product = state.products.find((entry) => entry.id === args?.where?.id);
        if (!product) {
          throw new Error("Produto nao encontrado.");
        }

        const data = args?.data ?? {};
        Object.assign(product, {
          ...data,
          basePrice: data.basePrice !== undefined ? Number(data.basePrice) : product.basePrice,
          compareAtPrice:
            data.compareAtPrice !== undefined
              ? data.compareAtPrice === null
                ? null
                : Number(data.compareAtPrice)
              : product.compareAtPrice,
          updatedAt: now(),
        });

        return asProduct(product, state);
      },
    };
  }

  if (modelName === "productImage") {
    return {
      deleteMany: async (args?: any) => {
        const before = state.images.length;
        state.images = state.images.filter((image) => image.productId !== args?.where?.productId);
        return { count: before - state.images.length };
      },
      createMany: async (args?: any) => {
        const data = args?.data ?? [];
        for (const image of data) {
          state.images.push({
            id: createId("img"),
            productId: image.productId,
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder ?? state.images.length + 1,
          });
        }
        return { count: data.length };
      },
    };
  }

  if (modelName === "productVariant") {
    return {
      findMany: async (args?: any) => {
        const items = state.variants.filter((variant) => {
          if (args?.where?.id?.in && !args.where.id.in.includes(variant.id)) {
            return false;
          }
          if (args?.where?.productId && variant.productId !== args.where.productId) {
            return false;
          }
          if (args?.where?.color && variant.color !== args.where.color) {
            return false;
          }
          if (args?.where?.size && variant.size !== args.where.size) {
            return false;
          }
          return true;
        });

        return items.map((variant) => asVariant(variant, state));
      },
      update: async (args?: any) => {
        const variant = state.variants.find((entry) => entry.id === args?.where?.id);
        if (!variant) {
          throw new Error("Variacao nao encontrada.");
        }

        const data = args?.data ?? {};
        if (data.stock?.increment !== undefined) {
          variant.stock += data.stock.increment;
        }
        if (data.stock?.decrement !== undefined) {
          variant.stock -= data.stock.decrement;
        }
        if (data.sku !== undefined) {
          variant.sku = data.sku;
        }
        if (data.colorHex !== undefined) {
          variant.colorHex = data.colorHex;
        }

        return asVariant(variant, state);
      },
      updateMany: async (args?: any) => {
        let count = 0;
        for (const variant of state.variants) {
          if (args?.where?.id && variant.id !== args.where.id) {
            continue;
          }
          if (args?.where?.stock?.gte !== undefined && variant.stock < args.where.stock.gte) {
            continue;
          }
          if (args?.data?.stock?.decrement !== undefined) {
            variant.stock -= args.data.stock.decrement;
          }
          if (args?.data?.stock?.increment !== undefined) {
            variant.stock += args.data.stock.increment;
          }
          count += 1;
        }
        return { count };
      },
      upsert: async (args?: any) => {
        const lookup = args?.where?.productId_size_color;
        let variant = state.variants.find(
          (entry) =>
            entry.productId === lookup?.productId &&
            entry.size === lookup?.size &&
            entry.color === lookup?.color
        );

        if (!variant) {
          variant = {
            id: createId("var"),
            productId: args?.create?.productId,
            size: args?.create?.size,
            color: args?.create?.color,
            colorHex: args?.create?.colorHex,
            stock: args?.create?.stock,
            sku: args?.create?.sku,
          };
          state.variants.push(variant);
        } else {
          Object.assign(variant, args?.update ?? {});
        }

        return asVariant(variant, state);
      },
      deleteMany: async (args?: any) => {
        const ids = args?.where?.id?.in ?? [];
        const before = state.variants.length;
        state.variants = state.variants.filter((variant) => !ids.includes(variant.id));
        return { count: before - state.variants.length };
      },
    };
  }

  if (modelName === "user") {
    return {
      findUnique: async (args?: any) => {
        const user = state.users.find(
          (entry) => entry.id === args?.where?.id || entry.email === args?.where?.email
        );
        if (!user) {
          return null;
        }

        return {
          ...clone(user),
          addresses: state.addresses.filter((address) => address.userId === user.id),
          orders: state.orders.filter((order) => order.userId === user.id),
          _count: {
            orders: state.orders.filter((order) => order.userId === user.id).length,
            addresses: state.addresses.filter((address) => address.userId === user.id).length,
          },
        };
      },
      findMany: async (_args?: any) => {
        return state.users.map((user) => ({
          ...clone(user),
          addresses: state.addresses.filter((address) => address.userId === user.id),
          orders: state.orders.filter((order) => order.userId === user.id),
          _count: {
            orders: state.orders.filter((order) => order.userId === user.id).length,
            addresses: state.addresses.filter((address) => address.userId === user.id).length,
          },
        }));
      },
      upsert: async (args?: any) => {
        const email = args?.where?.email;
        let user = state.users.find((entry) => entry.email === email);

        if (!user) {
          user = {
            id: createId("user"),
            email,
            name: args?.create?.name ?? null,
            role: args?.create?.role ?? "USER",
            phone: args?.create?.phone ?? null,
            cpf: args?.create?.cpf ?? null,
            passwordHash: args?.create?.passwordHash ?? null,
            createdAt: now(),
            updatedAt: now(),
          };
          state.users.push(user);
        } else {
          Object.assign(user, args?.update ?? {}, { updatedAt: now() });
        }

        return clone(user);
      },
      update: async (args?: any) => {
        const user = state.users.find((entry) => entry.id === args?.where?.id);
        if (!user) {
          throw new Error("Usuario nao encontrado.");
        }

        Object.assign(user, args?.data ?? {}, { updatedAt: now() });
        return clone(user);
      },
    };
  }

  if (modelName === "address") {
    return {
      findFirst: async (args?: any) => {
        return (
          state.addresses.find((address) => {
            if (args?.where?.userId && address.userId !== args.where.userId) {
              return false;
            }
            if (args?.where?.isDefault !== undefined && address.isDefault !== args.where.isDefault) {
              return false;
            }
            return true;
          }) ?? null
        );
      },
      findMany: async (args?: any) => {
        const items = state.addresses.filter((address) => {
          if (args?.where?.userId && address.userId !== args.where.userId) {
            return false;
          }
          return true;
        });

        return items.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
      },
      create: async (args?: any) => {
        const data = args?.data ?? {};
        const address: MockAddress = {
          id: createId("addr"),
          userId: data.userId,
          label: data.label,
          recipient: data.recipient,
          zip: data.zip,
          street: data.street,
          number: data.number,
          complement: data.complement ?? null,
          district: data.district,
          city: data.city,
          state: data.state,
          isDefault: Boolean(data.isDefault),
          createdAt: now(),
          updatedAt: now(),
        };
        state.addresses.push(address);
        return clone(address);
      },
      update: async (args?: any) => {
        const address = state.addresses.find((entry) => entry.id === args?.where?.id);
        if (!address) {
          throw new Error("Endereco nao encontrado.");
        }

        Object.assign(address, args?.data ?? {}, { updatedAt: now() });
        return clone(address);
      },
      deleteMany: async (args?: any) => {
        const ids = args?.where?.id?.in ?? [];
        const before = state.addresses.length;
        state.addresses = state.addresses.filter((address) => !ids.includes(address.id));
        return { count: before - state.addresses.length };
      },
    };
  }

  if (modelName === "order") {
    return {
      count: async (args?: any) => state.orders.filter((order) => matchesOrderWhere(order, args?.where)).length,
      findMany: async (args?: any) => {
        const items = sortOrders(
          state.orders.filter((order) => matchesOrderWhere(order, args?.where)),
          args?.orderBy
        );
        const sliced = items.slice(args?.skip ?? 0, (args?.skip ?? 0) + (args?.take ?? items.length));
        return sliced.map((order) => asOrder(order, state, true));
      },
      findUnique: async (args?: any) => {
        const order = state.orders.find((entry) => entry.id === args?.where?.id);
        return order ? asOrder(order, state, true) : null;
      },
      create: async (args?: any) => {
        const data = args?.data ?? {};
        const order: MockOrder = {
          id: createId("order"),
          number: data.number,
          userId: data.userId ?? null,
          email: data.email,
          status: data.status,
          subtotal: Number(data.subtotal),
          shippingCost: Number(data.shippingCost),
          discount: Number(data.discount),
          total: Number(data.total),
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          paymentProviderId: data.paymentProviderId ?? null,
          shippingService: data.shippingService ?? null,
          shippingTrackingCode: data.shippingTrackingCode ?? null,
          addressSnapshot: data.addressSnapshot,
          itemsSnapshot: data.itemsSnapshot,
          expiresAt: data.expiresAt ?? null,
          createdAt: now(),
          updatedAt: now(),
        };
        state.orders.push(order);

        for (const item of data.items?.create ?? []) {
          state.orderItems.push({
            id: createId("item"),
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            size: item.size,
            color: item.color,
            unitPrice: Number(item.unitPrice),
            quantity: item.quantity,
          });
        }

        return asOrder(order, state, true);
      },
      update: async (args?: any) => {
        const order = state.orders.find((entry) => entry.id === args?.where?.id);
        if (!order) {
          throw new Error("Pedido nao encontrado.");
        }

        Object.assign(order, args?.data ?? {}, { updatedAt: now() });
        return asOrder(order, state, true);
      },
    };
  }

  if (modelName === "coupon") {
    return {
      findFirst: async (args?: any) => {
        return (
          state.coupons.find((coupon) => {
            if (args?.where?.code && coupon.code !== args.where.code) {
              return false;
            }
            if (args?.where?.isActive !== undefined && coupon.isActive !== args.where.isActive) {
              return false;
            }
            return true;
          }) ?? null
        );
      },
    };
  }

  if (modelName === "webhookEvent") {
    return {
      findFirst: async () => state.webhooks[0] ?? null,
      create: async (args?: any) => {
        const event: MockWebhookEvent = {
          id: createId("web"),
          provider: args?.data?.provider,
          eventType: args?.data?.eventType,
          payload: args?.data?.payload,
          receivedAt: now(),
          processedAt: null,
        };
        state.webhooks.push(event);
        return clone(event);
      },
      update: async (args?: any) => {
        const event = state.webhooks.find((entry) => entry.id === args?.where?.id);
        if (!event) {
          throw new Error("Evento nao encontrado.");
        }

        Object.assign(event, args?.data ?? {});
        return clone(event);
      },
    };
  }

  throw new Error(`Modelo mock nao implementado: ${modelName}`);
}

export function createMockPrismaClient() {
  const client: any = {
    category: createMockModel("category"),
    product: createMockModel("product"),
    productImage: createMockModel("productImage"),
    productVariant: createMockModel("productVariant"),
    user: createMockModel("user"),
    address: createMockModel("address"),
    order: createMockModel("order"),
    coupon: createMockModel("coupon"),
    webhookEvent: createMockModel("webhookEvent"),
    $transaction: async (arg: any) => {
      if (Array.isArray(arg)) {
        return Promise.all(arg);
      }

      return arg(client);
    },
    $disconnect: async () => undefined,
  };

  return client;
}