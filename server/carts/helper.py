from .models import Cart,CartItem
def get_session_cart(request):
    return request.session.get("cart", {})

def save_session_cart(request, cart):
    request.session["cart"] = cart
    request.session.modified = True


def merge_carts(request, user):
    session_cart = request.session.get("cart", {})
    print(f"from Merging {session_cart}")
    if not session_cart:
        return
    cart, _ = Cart.objects.get_or_create(user=user)

    for product_id, data in session_cart.items():
        quantity = data["quantity"]
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
        )
        if not created:
            item.quantity += quantity
        item.save()

    
    request.session["cart"] = {}
    request.session.modified = True
