from oscar.apps.catalogue import managers as _managers


class ProductQuerySet(_managers.ProductQuerySet):

    def available_in_cms(self):
        return self

    def get_queryset(self):
        return ProductQuerySet(self.model, using=self._db)


#class ProductManager(_managers.ProductQuerySet.as_manager()):
#    def get_queryset(self):
#        return ProductQuerySet(self.model, using=self._db)
