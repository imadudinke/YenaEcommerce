import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const EmptyCart = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 text-center py-16">
      <div className="text-6xl mb-4">🛒</div>
      <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
      <p className="text-gray-500 mb-6">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button asChild>
        <Link to="/">Continue Shopping</Link>
      </Button>
    </div>
  );
};
export default EmptyCart;
