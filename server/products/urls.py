from django.urls import path
from .views import ProductListView,ProductDetailView,ProductByCategoryView
urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    # path("categories/", CategoryListView.as_view(), name="category-list"),
    path("category/<slug:slug>/", ProductByCategoryView.as_view(), name="products-by-category"),
]