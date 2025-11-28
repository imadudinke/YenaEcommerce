import { ProductReviewAdd } from "@/api/products";
import { Star } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

type Review = {
  id: number;
  user: { full_name: string };
  comment: string;
  rating: number;
  created_at: string;
};

interface ReviewSectionProps {
  reviews?: Review[];
  productId?: number;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  productId,
}) => {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const { user, isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>(safeReviews);

  const hasReviewed =
    isAuthenticated &&
    user &&
    localReviews.some((r) => r.user.full_name === user.full_name);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!rating || !comment.trim()) {
      setError("Please provide a rating and comment.");
      return;
    }
    setSubmitting(true);
    try {
      if (!productId) throw new Error("Product not found");
      await ProductReviewAdd(productId, rating, comment);

      setLocalReviews([
        ...localReviews,
        {
          id: Date.now(),
          user: { full_name: user ? user.full_name : "" },
          comment,
          rating,
          created_at: new Date().toISOString(),
        },
      ]);
      setSuccess(true);
      setComment("");
      setRating(0);
    } catch (err: any) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {isAuthenticated ? (
        hasReviewed ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Thank you for your review!
          </div>
        ) : (
          <form
            onSubmit={handleAddReview}
            className="mb-8 bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i)}
                    className={
                      i <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                    aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                  >
                    <Star size={22} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                maxLength={500}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && (
              <div className="text-green-600 text-sm">Review submitted!</div>
            )}
            <button
              type="submit"
              className="self-end px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )
      ) : (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          Please{" "}
          <a href="/login" className="underline font-medium">
            log in
          </a>{" "}
          to write a review.
        </div>
      )}

      {/* Reviews List */}
      {localReviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-8">
          {localReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {review.user.full_name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-base">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
