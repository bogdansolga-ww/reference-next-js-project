import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { HTTP_STATUS } from "@/lib/core/http/constants";
import { handleError } from "@/lib/core/http/errorHandler";
import { Messages } from "@/lib/core/i18n/messages";
import { cartService } from "@/lib/services/cartService";
import { addToCartSchema } from "@/lib/types/cart";

/**
 * GET /api/v1/cart - Get user's cart
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: Messages.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const cart = await cartService.getUserCart(session.user.id);
    return NextResponse.json(cart);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/v1/cart - Add item to cart
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: Messages.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: Messages.VALIDATION_FAILED, details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    const item = await cartService.addToCart(session.user.id, parsed.data);
    return NextResponse.json(item, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/v1/cart - Clear entire cart
 */
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: Messages.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    await cartService.clearCart(session.user.id);
    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    return handleError(error);
  }
}
