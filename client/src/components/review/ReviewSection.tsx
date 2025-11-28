import { Star } from "lucide-react";

type Review = {
  id: number;
  user: { full_name: string };
  comment: string;
  rating: number;
  created_at: string;
};

interface ReviewSectionProps {
  reviews?: Review[];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
      {safeReviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-8">
          {safeReviews.map((review) => (
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
