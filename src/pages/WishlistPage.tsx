import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, moveToCart, products } = useStore();

  const handleMoveToCart = (productId: string) => {
    moveToCart(productId);
    toast.success('Moved to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save your favorite products here
          </p>
          <Button asChild className="btn-sacred">
            <Link to="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold mb-8">
          Wishlist ({wishlist.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = products.find(p => p.id === item.productId);
            
            return (
              <div key={item.productId} className="card-premium overflow-hidden">
                <Link 
                  to={`/product/${item.productId}`}
                  className="block aspect-square bg-muted overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-4">
                  <Link 
                    to={`/product/${item.productId}`}
                    className="font-semibold hover:text-primary transition-colors line-clamp-2 mb-2"
                  >
                    {item.name}
                  </Link>
                  
                  <p className="text-primary font-bold mb-4">
                    From ₹{item.price.toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMoveToCart(item.productId)}
                      className="flex-1 btn-sacred"
                      size="sm"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => removeFromWishlist(item.productId)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
