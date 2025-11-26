from django.urls import path
from .views import ProductListView,ProductDetailView,ProductByCategoryView,CreateProductReview,CategoryListView
urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("<int:id>/", ProductDetailView.as_view(), name="product-detail"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("category/<slug:slug>/", ProductByCategoryView.as_view(), name="products-by-category"),
    path("<int:id>/review/",CreateProductReview.as_view(),name="add-review")
]