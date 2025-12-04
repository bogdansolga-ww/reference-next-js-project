import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { HTTP_STATUS } from "@/lib/core/http/constants";
import { handleError } from "@/lib/core/http/errorHandler";
import { Messages } from "@/lib/core/i18n/messages";
import { cartService } from "@/lib/services/cartService";
import { updateCartItemSchema } from "@/lib/types/cart";

/**
 * PATCH /api/v1/cart/[id] - Update cart item quantity
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: Messages.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: Messages.VALIDATION_FAILED, details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    const item = await cartService.updateCartItem(session.user.id, parseInt(id, 10), parsed.data);
    return NextResponse.json(item);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/v1/cart/[id] - Remove item from cart
 */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: Messages.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const { id } = await params;
    await cartService.removeFromCart(session.user.id, parseInt(id, 10));
    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  } catch (error) {
    return handleError(error);
  }
}
